import redis from 'redis';
import { promisify } from 'util';

/**
 * Class for performing operations with Redis service
 */
class RedisClient {
  /**
   * Constructor for creating a Redis client instance
   * Initializes the client and binds Redis methods to promises for asynchronous handling
   */
  constructor() {
    this.client = redis.createClient();

    // Promisify Redis methods
    this.getAsync = promisify(this.client.get).bind(this.client);

    // Event listener for handling Redis client errors
    this.client.on('error', (error) => {
      console.error(`Redis client error: ${error.message}`);
    });
  }

  /**
   * Checks if connection to Redis is alive
   * @returns {boolean} True if connection is alive, false otherwise
   */
  isAlive() {
    return this.client.connected;
  }

  /**
   * Retrieves the value corresponding to a key in Redis
   * @param {string} key - Key to search for in Redis
   * @returns {Promise<string|null>} Value of the key, or null if key does not exist
   */
  async get(key) {
    try {
      const value = await this.getAsync(key);
      return value;
    } catch (error) {
      console.error(`Error retrieving value for key '${key}' from Redis: ${error.message}`);
      return null;
    }
  }

  /**
   * Creates a new key in Redis with a specific TTL
   * @param {string} key - Key to be saved in Redis
   * @param {string} value - Value to be assigned to the key
   * @param {number} duration - TTL (time-to-live) of the key in seconds
   */
  async set(key, value, duration) {
    try {
      this.client.setex(key, duration, value);
    } catch (error) {
      console.error(`Error setting key '${key}' in Redis: ${error.message}`);
    }
  }

  /**
   * Deletes a key from the Redis service
   * @param {string} key - Key to be deleted
   */
  async del(key) {
    try {
      this.client.del(key);
    } catch (error) {
      console.error(`Error deleting key '${key}' from Redis: ${error.message}`);
    }
  }
}

// Create an instance of RedisClient
const redisClient = new RedisClient();

export default redisClient;
