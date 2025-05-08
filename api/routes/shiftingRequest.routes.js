import express from 'express';
import { verifyToken, verifyAdmin } from '../utils/verifyUser.js';
import { 
  createShiftingRequest, 
  getShiftingRequests,
  updateShiftingRequestStatus,
  getUserShiftingRequests,
  softDeleteShiftingRequestUser,
  softDeleteShiftingRequestWorker,
  softDeleteShiftingRequestAdmin,
  restoreShiftingRequest,
  getDeletedShiftingRequests,
  deleteShiftingRequest
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

// Soft delete routes
router.put('/user/:id/delete', verifyToken, softDeleteShiftingRequestUser);
router.put('/worker/:id/delete', verifyToken, softDeleteShiftingRequestWorker);
router.put('/admin/:id/delete', verifyAdmin, softDeleteShiftingRequestAdmin);

// Admin deletion and restoration routes
router.delete('/:id', verifyAdmin, deleteShiftingRequest);
router.put('/:id/restore', verifyAdmin, restoreShiftingRequest);
router.get('/deleted', verifyAdmin, getDeletedShiftingRequests);

export default router;
