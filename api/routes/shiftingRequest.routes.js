import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { 
  createShiftingRequest, 
  getShiftingRequests,
  updateShiftingRequestStatus,
  getUserShiftingRequests
} from '../controllers/shiftingRequest.controller.js';

const router = express.Router();

// Create a new shifting request
router.post('/create', verifyToken, createShiftingRequest);

// Get all shifting requests (admin only)
router.get('/all', verifyToken, getShiftingRequests);

// Update shifting request status
router.put('/update/:id', verifyToken, updateShiftingRequestStatus);

// Get shifting requests for a specific user
router.get('/user/:userId', verifyToken, getUserShiftingRequests);

export default router;