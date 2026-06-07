import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Attempt to connect using the URI string from our hidden .env file
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Database Connected Successfully');
  } catch (error) {
    console.error(`❌ Database Connection Error: ${error.message}`);
    process.exit(1); // Force terminate the application if database fails to mount
  }
};

export default connectDB;