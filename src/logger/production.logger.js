import { createLogger, format, transports } from "winston";
import "winston-mongodb";
import { CONFIG } from "../config/index.js";

const { combine, timestamp, errors, json, metadata } = format;

const cleanMongoUrl = (value) => {
  if (!value) return null;
  return String(value).trim().replace(/^"|"$/g, "");
};

export const proLogger = () => {
  const dbUrl = cleanMongoUrl(CONFIG.ERROR_LOG_URL);

  const logger = createLogger({
    level: "info",
    exitOnError: false,
    format: combine(timestamp(), errors({ stack: true }), metadata(), json()),
    transports: [],
  });

  if (!dbUrl) {
    logger.add(new transports.Console());
    logger.error("ERROR_LOG_URL is not configured; falling back to console logging.");
    return logger;
  }

  try {
    logger.add(
      new transports.MongoDB({
        level: "error",
        collection: "searchwyz_error_log",
        db: dbUrl,
      })
    );
    logger.add(
      new transports.MongoDB({
        level: "info",
        collection: "searchwyz_info_log",
        db: dbUrl,
      })
    );
    logger.add(
      new transports.MongoDB({
        level: "debug",
        collection: "searchwyz_debug_log",
        db: dbUrl,
      })
    );
  } catch (error) {
    logger.add(new transports.Console());
    logger.error(
      "Failed to initialize MongoDB logger transport; falling back to console.",
      error
    );
  }

  logger.on("error", (err) => {
    console.error("Logger transport error:", err.message);
  });

  return logger;
};