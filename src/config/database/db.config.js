import { mongoose, connect } from "mongoose";
import logger  from "../../logger";
import config from "../env";  

 
 const MongoDB = async () => {
  try {
    // mongoose.set("strictQuery", true);
    logger.info("Connecting to Database...", { service: "database" });
    await connect(config.DB_URI);
    logger.info("Database Connected Successfully", { service: "database" });
  } catch (e) {
    logger.error(e);
    process.exit(-1);
  }
};
export default MongoDB;