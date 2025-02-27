import express from 'express';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';

const router = express.Router();

const ADMIN_EMAIL = 'adminonly@gmail.com';
const ADMIN_PASSWORD = 'madebykrisham';
const ADMIN_SECRET = process.env.JWT_KEY;

// Admin Login Route
router.post('/login', (req, res, next) => {
    const { email, password } = req.body;
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
        return next(errorHandler(403, 'Unauthorized admin access'));
    }
    const token = jwt.sign({ admin: true }, ADMIN_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
});

// Middleware to verify admin
const verifyAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return next(errorHandler(401, 'Access Denied'));
    try {
        const verified = jwt.verify(token, ADMIN_SECRET);
        if (!verified.admin) return next(errorHandler(403, 'Unauthorized'));
        next();
    } catch (error) {
        next(error);
    }
};

// Admin actions to fetch users and listings
router.get('/users', verifyAdmin, async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
});

// Admin action to delete user
router.delete('/users/:id', verifyAdmin, async (req, res, next) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json('User deleted');
    } catch (error) {
        next(error);
    }
});

// Admin action to fetch listings
router.get('/listings', verifyAdmin, async (req, res, next) => {
    try {
        const listings = await Listing.find();
        res.status(200).json(listings);
    } catch (error) {
        next(error);
    }
});

// Admin action to delete listing
router.delete('/listings/:id', verifyAdmin, async (req, res, next) => {
    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json('Listing deleted');
    } catch (error) {
        next(error);
    }
});


export default router;
