// models/booking.model.js
import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: { type: String, required: true },
  address: { type: String, required: true },
  contact: { type: String, required: true },
  preferredDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
}, { timestamps: true });

export default mongoose.model("Booking", BookingSchema);
