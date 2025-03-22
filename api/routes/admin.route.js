// routes/admin.route.js
import express from 'express';
import { deleteUser, deleteListing, editUser, editListing } from '../controllers/admin.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Delete a user
router.delete('/delete-user/:id', verifyToken, deleteUser);

// Delete a listing
router.delete('/delete-listing/:id', verifyToken, deleteListing);

// Edit a user
router.put('/edit-user/:id', verifyToken, editUser);

// Edit a listing
router.put('/edit-listing/:id', verifyToken, editListing);

export default router;