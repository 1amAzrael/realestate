// routes/admin.route.js
import express from 'express';
import { deleteUser, deleteListing } from '../controllers/admin.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Delete a user
router.delete('/delete-user/:id', verifyToken, deleteUser);

// Delete a listing
router.delete('/delete-listing/:id', verifyToken, deleteListing);

export default router;