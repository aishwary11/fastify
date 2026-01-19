import mongoose from 'mongoose';

const RECONNECT_INTERVAL = 10000;

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.log(`Retrying connection in ${RECONNECT_INTERVAL / 1000} seconds...`);
    setTimeout(connectDB, RECONNECT_INTERVAL);
  }
};

export default connectDB;
