import redis from 'redis';
import { promisify } from 'util';

/**
 * Class for performing operations with Redis service.
 */
class RedisClient {
  /**
   * Constructor for creating a Redis client instance.
   * Initializes the client and binds Redis methods to promises for asynchronous handling.
   */
  constructor() {
    this.client = redis.createClient();
    this.getAsync = promisify(this.client.get).bind(this.client);

    // Handle Redis client errors
    this.client.on('error', (error) => {
      console.error(`Redis client error: ${error.message}`);
    });
  }

  /**
   * Checks if the connection to Redis is alive.
   * @returns {boolean} True if the connection is alive, otherwise false.
   */
  isAlive() {
    return this.client.connected;
  }

  /**
   * Retrieves the value associated with the given key from Redis.
   * @param {string} key - The key to search for in Redis.
   * @returns {Promise<string|null>} The value of the key, or null if the key does not exist.
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
   * Sets a key-value pair in Redis with a specific TTL (time-to-live).
   * @param {string} key - The key to be saved in Redis.
   * @param {string} value - The value to be assigned to the key.
   * @param {number} duration - The TTL of the key in seconds.
   */
  async set(key, value, duration) {
    try {
      this.client.setex(key, duration, value);
    } catch (error) {
      console.error(`Error setting key '${key}' in Redis: ${error.message}`);
    }
  }

  /**
   * Deletes a key from the Redis service.
   * @param {string} key - The key to be deleted.
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
