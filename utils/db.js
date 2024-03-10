import { MongoClient } from 'mongodb';

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 27017;
const DB_DATABASE = process.env.DB_DATABASE || 'files_manager';
const url = `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;

/**
 * Class for performing operations with MongoDB service
 */
class DBClient {
  constructor() {
    MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
      if (err) {
        console.error(`MongoDB connection error: ${err}`);
        this.db = null;
        return;
      }
      
      this.db = client.db(DB_DATABASE);
      this.usersCollection = this.db.collection('users');
      this.filesCollection = this.db.collection('files');
      console.log('MongoDB connection successful');
    });
  }

  /**
   * Checks if connection to MongoDB is alive
   * @return {boolean} true if connection is alive, false otherwise
   */
  isAlive() {
    return !!this.db;
  }

  /**
   * Returns the number of documents in the users collection
   * @return {Promise<number>} Number of documents in the users collection
   */
  async nbUsers() {
    return this.usersCollection.countDocuments();
  }

  /**
   * Returns the number of documents in the files collection
   * @return {Promise<number>} Number of documents in the files collection
   */
  async nbFiles() {
    return this.filesCollection.countDocuments();
  }
}

const dbClient = new DBClient();

export default dbClient;
