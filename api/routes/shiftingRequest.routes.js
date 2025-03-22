import express from "express";
import {
  createShiftingRequest,
  getShiftingRequests,
  updateShiftingRequestStatus,
  getUserShiftingRequests,
} from "../controllers/shiftingRequest.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// User: Create a shifting request
router.post("/create", verifyToken, createShiftingRequest);

// Admin: Get all shifting requests
router.get("/all", verifyToken, getShiftingRequests);

// Admin: Update shifting request status
router.put("/update/:id", verifyToken, updateShiftingRequestStatus);

// User: Get shifting requests for a specific user
router.get("/user/:userId", verifyToken, getUserShiftingRequests);

export default router;