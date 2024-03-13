import Queue from 'bull';
import { ObjectId } from 'mongodb';
import { promises as fsPromises } from 'fs';
import fileUtils from './utils/file';
import userUtils from './utils/user';
import basicUtils from './utils/basic';
const imageThumbnail = require('image-thumbnail');

// Initialize queues
const fileQueue = new Queue('fileQueue');
const userQueue = new Queue('userQueue');

// Process file queue jobs
fileQueue.process(async (job) => {
  const { fileId, userId } = job.data;

  // Check for missing userId or fileId
  if (!userId) {
    console.log('Missing userId');
    throw new Error('Missing userId');
  }

  if (!fileId) {
    console.log('Missing fileId');
    throw new Error('Missing fileId');
  }

  // Check for valid file and user IDs
  if (!basicUtils.isValidId(fileId) || !basicUtils.isValidId(userId)) throw new Error('File not found');

  // Retrieve file information
  const file = await fileUtils.getFile({
    _id: ObjectId(fileId),
    userId: ObjectId(userId),
  });

  if (!file) throw new Error('File not found');

  // Generate thumbnails for different widths
  const { localPath } = file;
  const thumbnailOptions = {};
  const widths = [500, 250, 100];

  // Generate thumbnails for each width asynchronously
  widths.forEach(async (width) => {
    thumbnailOptions.width = width;
    try {
      // Generate thumbnail
      const thumbnail = await imageThumbnail(localPath, thumbnailOptions);
      // Write thumbnail to file system
      await fsPromises.writeFile(`${localPath}_${width}`, thumbnail);
    } catch (err) {
      console.error(err.message);
    }
  });
});

// Process user queue jobs
userQueue.process(async (job) => {
  const { userId } = job.data;

  // Check for missing userId
  if (!userId) {
    console.log('Missing userId');
    throw new Error('Missing userId');
  }

  // Check for valid user ID
  if (!basicUtils.isValidId(userId)) throw new Error('User not found');

  // Retrieve user information
  const user = await userUtils.getUser({
    _id: ObjectId(userId),
  });

  if (!user) throw new Error('User not found');

  // Welcome message for the user
  console.log(`Welcome ${user.email}!`);
});
