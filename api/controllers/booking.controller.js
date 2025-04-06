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
// Additional Admin-specific controller functions

// Get all bookings (Admin only)
export const getAllBookings = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not authorized to perform this action."));
  }

  try {
    const bookings = await Booking.find()
      .sort({ createdAt: -1 })
      .populate("listingId", "name address type price discountPrice")
      .populate("userId", "username email");
      
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching all bookings:", error);
    next(errorHandler(500, "Internal server error"));
  }
};

// Update booking (Admin only)
export const updateBooking = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not authorized to perform this action."));
  }

  try {
    const { id } = req.params;
    const { status, preferredDate, name, address, contact } = req.body;
    
    const updateData = {};
    if (status) updateData.status = status;
    if (preferredDate) updateData.preferredDate = preferredDate;
    if (name) updateData.name = name;
    if (address) updateData.address = address;
    if (contact) updateData.contact = contact;
    
    const booking = await Booking.findByIdAndUpdate(
      id, 
      updateData,
      { new: true }
    ).populate("listingId", "name address type price discountPrice")
      .populate("userId", "username email");
    
    if (!booking) {
      return next(errorHandler(404, "Booking not found"));
    }
    
    res.status(200).json({ success: true, booking });
  } catch (error) {
    console.error("Error updating booking:", error);
    next(errorHandler(500, "Internal server error"));
  }
};

// Delete booking (Admin only)
export const deleteBooking = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not authorized to perform this action."));
  }

  try {
    const { id } = req.params;
    const booking = await Booking.findByIdAndDelete(id);
    
    if (!booking) {
      return next(errorHandler(404, "Booking not found"));
    }
    
    res.status(200).json({ success: true, message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    next(errorHandler(500, "Internal server error"));
  }
};

// Get booking statistics (Admin only)
export const getBookingStats = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not authorized to perform this action."));
  }

  try {
    // Get total count of bookings
    const totalBookings = await Booking.countDocuments();
    
    // Get count by status
    const pendingBookings = await Booking.countDocuments({ status: "pending" });
    const approvedBookings = await Booking.countDocuments({ status: "approved" });
    const rejectedBookings = await Booking.countDocuments({ status: "rejected" });
    
    // Get bookings by month (for the last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const bookingsByMonth = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: { 
            year: { $year: "$createdAt" }, 
            month: { $month: "$createdAt" } 
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);
    
    // Get top properties with most bookings
    const topProperties = await Booking.aggregate([
      {
        $group: {
          _id: "$listingId",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 5
      },
      {
        $lookup: {
          from: "listings",
          localField: "_id",
          foreignField: "_id",
          as: "property"
        }
      },
      {
        $project: {
          count: 1,
          property: { $arrayElemAt: ["$property", 0] }
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      stats: {
        totalBookings,
        pendingBookings,
        approvedBookings,
        rejectedBookings,
        bookingsByMonth,
        topProperties
      }
    });
  } catch (error) {
    console.error("Error fetching booking stats:", error);
    next(errorHandler(500, "Internal server error"));
  }
};