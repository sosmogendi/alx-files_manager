import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AppController {
  static getStatus(request, response) {
    const status = {
      redis: redisClient.isAlive(),
      db: dbClient.isAlive(),
    };
    response.status(200).json(status);
  }

  static async getStats(request, response) {
    try {
      const usersCount = await dbClient.nbUsers();
      const filesCount = await dbClient.nbFiles();
      const stats = { users: usersCount, files: filesCount };
      response.status(200).json(stats);
    } catch (error) {
      console.error('Error getting stats:', error);
      response.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default AppController;
