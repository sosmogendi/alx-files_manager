import redisClient from '../utils/redis';
import dbClient from '../utils/db';
import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';

class AuthController {
  static async getConnect(request, response) {
    const { authorization } = request.headers;

    if (!authorization || !authorization.startsWith('Basic ')) {
      return response.status(401).json({ error: 'Unauthorized' });
    }

    const base64Credentials = authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [email, password] = credentials.split(':');

    if (!email || !password) {
      return response.status(401).json({ error: 'Unauthorized' });
    }

    const hashedPassword = sha1(password);
    const user = await dbClient.getUser(email);

    if (!user || user.password !== hashedPassword) {
      return response.status(401).json({ error: 'Unauthorized' });
    }

    const token = uuidv4();
    const key = `auth_${token}`;
    redisClient.set(key, user._id.toString(), 'EX', 86400);

    return response.status(200).json({ token });
  }

  static async getDisconnect(request, response) {
    const { 'x-token': token } = request.headers;

    if (!token) {
      return response.status(401).json({ error: 'Unauthorized' });
    }

    const userId = await redisClient.get(`auth_${token}`);

    if (!userId) {
      return response.status(401).json({ error: 'Unauthorized' });
    }

    redisClient.del(`auth_${token}`);
    return response.status(204).send();
  }
}

export default AuthController;
