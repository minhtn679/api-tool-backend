import mongoose from "mongoose";
import Logger from "../common/logger.js";

export const ConnectDB = async (callback) => {
   try {
      mongoose.set("strictQuery", false);
      await mongoose.connect(process.env.DATABASE_CLOUD);
      Logger.log("Mongodb connected successfuly");

      callback();
   } catch (error) {
      Logger.error(`Mongodb connected error: ${error}`);
   }
};
