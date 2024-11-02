import mongoose from 'mongoose';
import logStatus from './logStatus';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Connect to the MongoDB database using Mongoose.
 * Throws an error if the database connection fails.
 */
async function connect() {
  const dbUri = process.env.MONGOOSE_DB_URI;

  if (!dbUri) {
    logStatus.error('Database URI is not defined in environment variables.');
    process.exit(1);
  }

  try {
    await mongoose.connect(dbUri);
    logStatus.info('DB Connected Successfully');
  } catch (error) {
    logStatus.error('Could not connect to the database', error);
    process.exit(1);
  }
}

export default connect;
