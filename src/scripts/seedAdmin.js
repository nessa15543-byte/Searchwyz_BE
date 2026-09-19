import mongoose from "mongoose";
import { CONFIG } from "../config/index.js";
import Admin from "../models/Admin.js";

const seedAdmin = async () => {
  try {
    if (!CONFIG.MONGO_URI) throw new Error("MONGO_URI missing");
    if (!CONFIG.ADMIN_EMAIL || !CONFIG.ADMIN_PASSWORD) {
      throw new Error("ADMIN_EMAIL or ADMIN_PASSWORD missing in .env");
    }

    await mongoose.connect(CONFIG.MONGO_URI);

    const existing = await Admin.findOne({ email: CONFIG.ADMIN_EMAIL });
    if (existing) {
      console.log("Admin already exists:", existing.email);
      await mongoose.disconnect();
      process.exit(0);
    }

    const admin = await Admin.create({
      fullName: CONFIG.ADMIN_NAME || "Super Admin",
      email: CONFIG.ADMIN_EMAIL,
      password: CONFIG.ADMIN_PASSWORD,
      role: "admin",
    });

    console.log("Admin created:", admin.email);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Seed admin failed:", err.message);
    process.exit(1);
  }
};

seedAdmin();