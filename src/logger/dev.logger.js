import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf, errors, json, colorize } = format;

const myFormat = printf(({ level, message, service, timestamp, stack, ...meta }) => {
  const rest = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
  return `${timestamp} [${level}] [${service || "response"}] ${stack || message}${rest}`;
});

export const devLogger = () => {
  return createLogger({
    level: "debug",
    format: combine(
      colorize(),
      timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      errors({ stack: true }),
      myFormat
    ),
    transports: [new transports.Console()],
  });
};