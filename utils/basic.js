import { ObjectId } from 'mongodb';

const basicUtils = {
  isValidId(id) {
    try {
      ObjectId(id);
      return true;
    } catch (err) {
      return false;
    }
  },
};

export default basicUtils;
