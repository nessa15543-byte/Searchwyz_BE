import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
    {
        platformName: { type: String, default: "Searchwyz_BE" },
        maintenanceMode: { type: Boolean, default: false },
        systemNotice: { type: String, default: "" },
        maxClueUploadsPerUserPerDay: { type: Number, default: false },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
        lastUpdated: { type: Date, default: Date.now }
    }
);
const Settings = mongoose.models["Setting", settingSchema];
export default Settings;