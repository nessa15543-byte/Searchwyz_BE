import mongoose from "mongoose";

export const clueSchema = new mongoose.Schema(
  {
    location: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    description: { type: String, required: true, trim: true },
    submittedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const caseSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    age: { type: Number, required: true },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    height: { type: String, default: null },
    physicalDescription: { type: String, required: true },
    clothingLastSeen: { type: String, required: true },

    lastKnownLocation: { type: String, required: true, trim: true },
    dateLastSeen: { type: String, required: true },
    timeLastSeen: { type: String, required: true },

    additionalInfo: { type: String, default: null },

    photograph: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Photo",
      default: null,
    },

    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: [
        "Pending Verification",
        "Active",
        "Under Investigation",
        "Person Found",
        "Closed",
        "Rejected",
      ],
      default: "Pending Verification",
    },

    adminNote: { type: String, default: null },

    clues: [clueSchema],
  },
  { timestamps: true }
);

caseSchema.index({ fullName: "text", lastKnownLocation: "text" });

const Case = mongoose.model("Case", caseSchema);
export default Case;