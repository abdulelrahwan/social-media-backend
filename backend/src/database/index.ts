import mongoose from "mongoose";

const url = `${process.env.MONGODB_URL}`;

export const connectDatabase = async (): Promise<mongoose.Connection> => {
  mongoose.connect(url);
  return mongoose.connection;
};
