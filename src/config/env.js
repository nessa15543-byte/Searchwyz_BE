import dotenv from "dotenv";

dotenv.config();
const config = {
    PORT: process.env.PORT,
    DB_URL: process.env.DB_URL,
    ERROR_LOG_URL: process.env.ERROR_DB_URL,
    NODE_ENV: process.env.NODE_ENV,
}

export default config;