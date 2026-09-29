import { CONFIG } from "../config/index.js";
import { devLogger } from "./dev.logger.js";
import { proLogger } from "./production.logger.js";

let logger = null;
 

if ( CONFIG.NODE_ENV === "development" || CONFIG.NODE_ENV === "dev") {
  logger = devLogger();
} else {
  logger = proLogger();
}

export default logger;
export { logger };