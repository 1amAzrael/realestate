
import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import Listing from '../models/listing.model.js';

export const test = (req, res) => {
    res.send('Hello World')
};

export const updateUser = async (req, res) => {
    if(req.user.id !== req.params.id) return res.status(403).json("You can only update your account!");

    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }
        const updatedUser =await User.findByIdAndUpdate(req.params.id, { $set:
            {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                photoURL: req.body.photoURL
            }
        }, { new: true });
        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res) => {
    if(req.user.id !== req.params.id) return res.status(403).json("You can only delete your account!");
    try {        
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted");
    } catch (error) {
        next(error);
    }
}

export const getUserListings = async (req, res) => {
   if(req.user.id !== req.params.id) return res.status(403).json("You can only get your listing!");
  try{
    const listings = await Listing.find({userRef: req.params.id});
    res.status(200).json(listings);
  }catch(err){
    next(err);
  }
}

export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user) return res.status(404).json("User not found");
        const { password: pass, ...rest } = user._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
}