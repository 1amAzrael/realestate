import ShiftingRequest from "../models/shiftingRequest.model.js";
import { errorHandler } from "../utils/error.js";

// Create a new shifting request
export const createShiftingRequest = async (req, res, next) => {
  try {
    const { customerName, customerPhone, shiftingDate, shiftingAddress, workerId, userId } = req.body;

    // Validate required fields
    if (!customerName || !customerPhone || !shiftingDate || !shiftingAddress || !workerId || !userId) {
      return next(errorHandler(400, "All fields are required"));
    }

    // Create a new shifting request
    const shiftingRequest = new ShiftingRequest({
      customerName,
      customerPhone,
      shiftingDate,
      shiftingAddress,
      worker: workerId,
      user: userId,
    });

    await shiftingRequest.save(); // Save to the database
    console.log("Shifting request saved:", shiftingRequest); // Debugging
    res.status(201).json({ success: true, shiftingRequest });
  } catch (error) {
    console.error("Error saving shifting request:", error); // Debugging
    next(errorHandler(500, "Failed to create shifting request"));
  }
};

// Get all shifting requests for admin
export const getShiftingRequests = async (req, res, next) => {
  try {
    const shiftingRequests = await ShiftingRequest.find().populate("user worker");
    res.status(200).json({ success: true, shiftingRequests });
  } catch (error) {
    next(errorHandler(500, "Failed to fetch shifting requests"));
  }
};

// Update shifting request status
export const updateShiftingRequestStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedRequest = await ShiftingRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("user worker");

    if (!updatedRequest) {
      return next(errorHandler(404, "Shifting request not found"));
    }

    res.status(200).json({ success: true, shiftingRequest: updatedRequest });
  } catch (error) {
    next(errorHandler(500, "Failed to update shifting request"));
  }
};

// Get shifting requests for a specific user
export const getUserShiftingRequests = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const shiftingRequests = await ShiftingRequest.find({ user: userId }).populate("worker");
    res.status(200).json({ success: true, shiftingRequests });
  } catch (error) {
    next(errorHandler(500, "Failed to fetch user shifting requests"));
  }
};