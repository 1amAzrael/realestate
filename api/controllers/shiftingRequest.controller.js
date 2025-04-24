import ShiftingRequest from "../models/shiftingRequest.model.js";
import Worker from "../models/worker.model.js"; // Import Worker model to get rate
import { errorHandler } from "../utils/error.js";

// Create a new shifting request
export const createShiftingRequest = async (req, res, next) => {
  try {
    const { customerName, customerPhone, shiftingDate, shiftingAddress, workerId, userId } = req.body;

    // Validate required fields
    if (!customerName || !customerPhone || !shiftingDate || !shiftingAddress || !workerId || !userId) {
      return next(errorHandler(400, "All fields are required"));
    }

    // Get worker details to determine totalAmount based on worker's rate
    const worker = await Worker.findById(workerId);
    if (!worker) {
      return next(errorHandler(404, "Worker not found"));
    }

    // Use worker's rate or a default amount
    const totalAmount = worker.rate ? parseFloat(worker.rate) : 500;

    // Create a new shifting request
    const shiftingRequest = new ShiftingRequest({
      customerName,
      customerPhone,
      shiftingDate,
      shiftingAddress,
      workerId, // Use workerId as per the model
      userId,   // Use userId as per the model
      totalAmount, // Set the required totalAmount field
      status: 'pending'
    });

    const savedRequest = await shiftingRequest.save(); // Save to the database
    console.log("Shifting request saved:", savedRequest); 
    res.status(201).json({ 
      success: true, 
      message: "Shifting request created successfully",
      shiftingRequest: savedRequest 
    });
  } catch (error) {
    console.error("Error saving shifting request:", error); // Debugging
    next(errorHandler(500, `Failed to create shifting request: ${error.message}`));
  }
};

// Get all shifting requests for admin
export const getShiftingRequests = async (req, res, next) => {
  try {
    const shiftingRequests = await ShiftingRequest.find()
      .populate("userId", "username email") // Populate with select fields
      .populate("workerId", "name experience rate"); // Populate with select fields
    
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
    )
      .populate("userId", "username email")
      .populate("workerId", "name experience rate");

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
    const shiftingRequests = await ShiftingRequest.find({ userId }) 
      .populate("workerId", "name experience rate"); // Changed from worker to workerId
    
    res.status(200).json({ success: true, shiftingRequests });
  } catch (error) {
    next(errorHandler(500, "Failed to    user shifting requests"));
  }
};
