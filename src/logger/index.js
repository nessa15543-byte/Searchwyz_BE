import config from "../config/env.js";
import { devLogger } from "./dev.logger.js";
import { proLogger } from "./production.logger.js";
let logger = null;
if (config.NODE_ENV === "dev") {
  logger = devLogger();
} else {
  logger = proLogger();
}

 export default  logger;
 