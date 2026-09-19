import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { CONFIG, CORS_WHITELISTS } from "./config/index.js";
import { connectDB } from "./config/db.js";
import { verifyEmailConnection } from "./config/email.js";
import routes from "./routes/index.js";
import logger from "./logger/index.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS whitelist
app.use(
  cors({
    origin: (origin, callback) => {
      // allow tools like Bruno/Postman (no origin header)
      if (!origin) return callback(null, true);

      if (CORS_WHITELISTS.includes(origin)) {
        return callback(null, true);
      }

      logger.warn({
        message: `CORS blocked: ${origin}`,
        service: "cors",
      });

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

app.use(helmet());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ message: `${CONFIG.APP_NAME}_BE running` });
});

app.use("/api", routes);

// 404 — needs next even if unused, Express expects 3 args only if you want it
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// global error handler — must have 4 args
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res
      .status(400)
      .json({ success: false, message: "Invalid JSON body" });
  }

  if (err.message && err.message.startsWith("CORS blocked")) {
    return res
      .status(403)
      .json({ success: false, message: "Origin not allowed" });
  }

  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
    service: "global-error",
  });

  return res.status(500).json({ success: false, message: "Server error" });
});

const start = async () => {
  await connectDB();
  await verifyEmailConnection();

  app.listen(CONFIG.PORT, () => {
    logger.info({
      message: `${CONFIG.APP_NAME}_BE running on port ${CONFIG.PORT}`,
      service: "server",
    });
  });
};

start();