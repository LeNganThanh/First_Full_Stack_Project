import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

//connect to MongoDB on local machine only for test - for user - using mongo atlas
mongoose.connect(MONGO_URL, () => {
  console.log("DB connection established!");
});
