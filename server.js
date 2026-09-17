 
import  dbConnect  from "./src/config/database/db.config.js";
import config from "./src/config/env.js";
import appLogger  from "./src/logger/index.js";
import  {errorMiddleWareModule}  from "./src/middleware/index.js";
 import { app as appServer } from "./app.js";
 import  expressWinston  from "express-winston";
import http from "http";

const server = http.createServer(appServer);
const startServer = async () => {
  try{ 
  const PORT = config.PORT || 4000;
 appServer.all("*splat", errorMiddleWareModule.notFound);
  appServer.use(errorMiddleWareModule.errorHandler);
  appServer.use(expressWinston.logger(appLogger));
    server.listen(PORT, async () => {
  try { 
   await   dbConnect.MongoDB(); 
    appLogger.info(`server running on port ${PORT}`, {service:"application"}); 
  } catch (error) {
    appLogger.error(error, {service:"application"});
    process.exit(-1);
  }
});
  } catch (error){
     appLogger.error(error, {service:"application"});
    process.exit(-1);
  }
}

startServer();