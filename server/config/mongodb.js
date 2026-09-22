import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () => {
      console.log("DB Connected");
    });

    // Added a check to ensure URI is loaded
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in .env file");
    }

    await mongoose.connect(`${process.env.MONGODB_URI}/e-commerce`);
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1); // Stop the server if DB fails
  }
}
export default connectDB;
