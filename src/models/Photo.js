import mongoose from "mongoose";

const photoSchema = new mongoose.Schema(
  {
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case",
      required: true,
      index: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    format: {
      type: String,
      default: null,
    },
    bytes: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

const Photo = mongoose.model("Photo", photoSchema);
export default Photo;