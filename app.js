import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import expressWinston from "express-winston"; 
import logger from "./src/logger/index.js"; // Or "./logger.js" depending on your setup
import { CONFIG, CORS_WHITELISTS } from "./src/config/index.js"; // Or "./config.js" 
import { errorHandler } from "./src/middleware/error.middleware.js";
  
const app = express();   
app.use(
  cors({
    origin: function (origin, cb) {
      logger.info({ origin, whitelists: CORS_WHITELISTS }, "Cors Info");
      logger.info({...CORS_WHITELISTS }, "Cors Info");
      if (!origin || CORS_WHITELISTS.includes(origin)) {
        return cb(null, true);
      }
      return cb(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "PUT", "POST", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use(expressWinston.logger(logger));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));
app.use("/api/v1/status", (_req, res) => {
  res.send({ msg: `Yes!... Welcome to ${CONFIG.APP_NAME} API` });
});
app.use(errorHandler);
export  {app};
