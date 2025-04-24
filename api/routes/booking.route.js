// routes/booking.route.js
import express from "express";
import { 
  createBooking, 
  getUserBookings, 
  getLandlordBookings, 
  updateBookingStatus,
  getAllBookings,
  updateBooking,       
  deleteBooking,        
  getBookingStats      
} from "../controllers/booking.controller.js";
import { verifyToken, verifyAdmin } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", createBooking);
router.get("/user/:userId", getUserBookings);
router.get("/landlord/:landlordId", getLandlordBookings);
router.put("/:id/status", updateBookingStatus);
// Admin routes
router.get("/all", verifyAdmin, getAllBookings);
router.put("/admin/:id", verifyAdmin, updateBooking);
router.delete("/admin/:id", verifyAdmin, deleteBooking);
router.get("/stats", verifyAdmin, getBookingStats);

export default router;


