import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log("Database Connected successfully");
  } catch (error) {
    console.log("Erron in connecting Database.", error);
  }
};
