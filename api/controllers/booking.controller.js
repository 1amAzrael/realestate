// controllers/booking.controller.js
import Listing from "../models/listing.model.js";
import Booking from "../models/booking.model.js";
import { errorHandler } from "../utils/error.js";
import mongoose from "mongoose";

// Create a booking
export const createBooking = async (req, res, next) => {
  try {
    const { listingId, userId, name, address, contact, preferredDate } = req.body;
    if (!listingId || !userId || !name || !address || !contact || !preferredDate) {
      return next(errorHandler(400, "All fields are required"));
    }
    const booking = new Booking({
      listingId,
      userId,
      name,
      address,
      contact,
      preferredDate,
    });
    await booking.save();
    res.status(201).json({ success: true, booking });
  } catch (error) {
    console.error("Error creating booking:", error);
    next(errorHandler(500, "Internal server error"));
  }
};

// Get bookings for a user
export const getUserBookings = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return next(errorHandler(400, "Invalid user ID"));
    }
    const bookings = await Booking.find({ userId }).populate("listingId", "name address");
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    next(errorHandler(500, "Internal server error"));
  }
};

// Get bookings for a landlord
export const getLandlordBookings = async (req, res, next) => {
  try {
    const { landlordId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(landlordId)) {
      return next(errorHandler(400, "Invalid landlord ID"));
    }

    // Find all listings belonging to the landlord
    const listings = await Listing.find({ userRef: landlordId });
    const listingIds = listings.map((listing) => listing._id);

    // Find bookings for those listings and populate both listingId and userId
    const bookings = await Booking.find({ listingId: { $in: listingIds } })
      .populate("listingId", "name address") // Populate listing details
      .populate("userId", "username email"); // Populate user details

    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error("Error fetching landlord bookings:", error);
    next(errorHandler(500, "Internal server error"));
  }
};

// Update booking status
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!["pending", "approved", "rejected"].includes(status)) {
      return next(errorHandler(400, "Invalid status"));
    }
    const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true });
    if (!booking) {
      return next(errorHandler(404, "Booking not found"));
    }
    res.status(200).json({ success: true, booking });
  } catch (error) {
    console.error("Error updating booking status:", error);
    next(errorHandler(500, "Internal server error"));
  }
};
