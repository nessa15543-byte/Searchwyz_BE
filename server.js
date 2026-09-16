import { MongoDB } from "./src/config/database/db.config";
import config from "./src/config/env";
import appLogger  from "./src/logger/";
import errorMiddleWareModule from "./src/middleware/"
const startServer = async () => {
  try{ 
  const PORT = config.PORT || 4000;
  appServer.all("*", errorMiddleWareModule.notFound);
  appServer.use(errorMiddleWareModule.errorHandler);
  appServer.use(expressWinston.logger(appLogger));
    server.listen(PORT, async () => {
  try { 
   await MongoDB();
    // await defaultAdminAccount(); 
    appLogger.info(`server running on port ${PORT}`, {service:"application"});
    // notice.emit("systemLoaded");
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