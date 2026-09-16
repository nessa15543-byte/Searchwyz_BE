import { createLogger, format, transports } from 'winston';
const { combine, timestamp, printf, errors, json} = format;

const myFormat = printf(({ level, message, service, timestamp , stack}) => {
  return `${timestamp} [${level}] [${service || "response"}]  ${stack || message}`;
});
export const devLogger = () => {
  return createLogger({
    level: "debug",
    format: combine(
      json(),
      format.colorize(),
      timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      errors({ stack: true }),
      myFormat
    ),
    // meta: { service },
    transports: [new transports.Console()],
  });
};