// routes/booking.route.js
import express from "express";
import { createBooking, getUserBookings, getLandlordBookings, updateBookingStatus } from "../controllers/booking.controller.js";

const router = express.Router();

router.post("/create", createBooking);
router.get("/user/:userId", getUserBookings);
router.get("/landlord/:landlordId", getLandlordBookings);
router.put("/:id/status", updateBookingStatus);

export default router;
