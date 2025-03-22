import mongoose from "mongoose";

const ShiftingRequestSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    shiftingDate: { type: Date, required: true },
    shiftingAddress: { type: String, required: true },
    worker: { type: mongoose.Schema.Types.ObjectId, ref: "Worker", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.model("ShiftingRequest", ShiftingRequestSchema);