import mongoose from "mongoose";
import { env } from "./env.js";

const connectDB = async (): Promise<void> => {
  try {
    const connectionInstance = await mongoose.connect(env.MONGO_URI);

    console.log(
      `MongoDb Connected !!! \n ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("MongoDb Connection Failed");
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;
