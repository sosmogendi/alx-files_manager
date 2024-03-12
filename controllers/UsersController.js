import dbClient from '../utils/db';
import sha1 from 'sha1';

class UsersController {
  static async postNew(request, response) {
    const { email, password } = request.body;

    // Check if email and password are provided
    if (!email) {
      return response.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return response.status(400).json({ error: 'Missing password' });
    }

    try {
      // Check if the email already exists
      const userExists = await dbClient.getUser(email);
      if (userExists) {
        return response.status(400).json({ error: 'Already exist' });
      }

      // Hash the password using SHA1
      const hashedPassword = sha1(password);

      // Save the new user to the database
      const newUser = await dbClient.createUser(email, hashedPassword);

      // Respond with the new user's id and email
      response.status(201).json({ id: newUser._id, email: newUser.email });
    } catch (error) {
      console.error('Error creating user:', error);
      response.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default UsersController;
