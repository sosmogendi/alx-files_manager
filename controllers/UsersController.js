import { ObjectId } from 'mongodb';
import sha1 from 'sha1';
import Queue from 'bull';
import dbClient from '../utils/db';
import userUtils from '../utils/user';

const userQueue = new Queue('userQueue');

class UsersController {
  /**
   * Creates a new user with the provided email and password.
   *
   * To create a user, both email and password must be provided.
   * If the email is missing, it responds with an error "Missing email" and a status code of 400.
   * If the password is missing, it responds with an error "Missing password" and a status code of 400.
   * If the email already exists in the database, it responds with an error "Already exists" and a status code of 400.
   * The password is stored in the database after being hashed using SHA1.
   * The endpoint returns the newly created user with only the email and the auto-generated id (by MongoDB) and a status code of 201.
   * The new user is saved in the "users" collection with the email and hashed password.
   */
  static async postNew(request, response) {
    const { email, password } = request.body;

    if (!email) {
      return response.status(400).send({ error: 'Missing email' });
    }

    if (!password) {
      return response.status(400).send({ error: 'Missing password' });
    }

    const emailExists = await dbClient.usersCollection.findOne({ email });

    if (emailExists) {
      return response.status(400).send({ error: 'Already exists' });
    }

    const sha1Password = sha1(password);

    try {
      const result = await dbClient.usersCollection.insertOne({
        email,
        password: sha1Password,
      });

      const user = {
        id: result.insertedId,
        email,
      };

      await userQueue.add({
        userId: result.insertedId.toString(),
      });

      return response.status(201).send(user);
    } catch (err) {
      await userQueue.add({});
      return response.status(500).send({ error: 'Error creating user.' });
    }
  }

  /**
   * Retrieves the user based on the token used.
   *
   * Retrieves the user based on the token:
   * If not found, it responds with an error "Unauthorized" and a status code of 401.
   * Otherwise, it returns the user object with only the email and id.
   */
  static async getMe(request, response) {
    const { userId } = await userUtils.getUserIdAndKey(request);

    const user = await userUtils.getUser({ _id: ObjectId(userId) });

    if (!user) {
      return response.status(401).send({ error: 'Unauthorized' });
    }

    const processedUser = { id: user._id, email: user.email };

    return response.status(200).send(processedUser);
  }
}

export default UsersController;
