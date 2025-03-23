import mongoose from 'mongoose';
import { defineNitroPlugin } from 'nitropack/dist/runtime/plugin';

export const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...'); // Debug log
    
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('MongoDB Connected Successfully');
    
    // Test the connection
    if (!mongoose.connection.db) {
      throw new Error('Database connection not established');
    }    
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default defineNitroPlugin(async (nitroApp) => {
  console.log('Initializing MongoDB connection...'); // Debug log
  await connectDB();
  console.log('MongoDB plugin initialized'); // Debug log
});