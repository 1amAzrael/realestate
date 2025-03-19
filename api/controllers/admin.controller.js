import User from "../models/user.model.js";
import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

// Edit a user (Admin only)
export const editUser = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not authorized to perform this action."));
  }

  try {
    const { username, email } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { username, email },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

// Edit a listing (Admin only)
export const editListing = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not authorized to perform this action."));
  }

  try {
    const { name, address } = req.body;
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      { name, address },
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};
// Delete a user (Admin only)
export const deleteUser = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not authorized to perform this action."));
  }

  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    next(error);
  }
};

// Delete a listing (Admin only)
export const deleteListing = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not authorized to perform this action."));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Listing deleted successfully." });
  } catch (error) {
    next(error);
  }
};