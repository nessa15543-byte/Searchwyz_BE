import mongoose, { connect } from "mongoose";
import logger from "../../logger/index.js";
import config from "../env.js";

 
 const MongoDB = async () => {
  try { 
    logger.info("Connecting to Database...", { service: "database" });
    await connect(config.DB_URL);
    logger.info("Database Connected Successfully", { service: "database" });
  } catch (e) {
    logger.error(e);
    process.exit(-1);
  }
};
export  {MongoDB};