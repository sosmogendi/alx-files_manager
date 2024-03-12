import dbClient from '../utils/db';
import sha1 from 'sha1';

class UsersController {
  static async postNew(request, response) {
    const { email, password } = request.body;

    if (!email) {
      return response.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return response.status(400).json({ error: 'Missing password' });
    }

    try {
      const userExists = await dbClient.getUser(email);
      if (userExists) {
        return response.status(400).json({ error: 'Already exist' });
      }

      const hashedPassword = sha1(password);

      const newUser = await dbClient.createUser(email, hashedPassword);

      response.status(201).json({ id: newUser._id, email: newUser.email });
    } catch (error) {
      console.error('Error creating user:', error);
      response.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getMe(request, response) {
    try {
      const userId = request.userId;
      const user = await dbClient.getUserById(userId);
      if (!user) {
        return response.status(401).json({ error: 'Unauthorized' });
      }
      response.json({ id: user._id, email: user.email });
    } catch (error) {
      console.error('Error retrieving user:', error);
      response.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default UsersController;
