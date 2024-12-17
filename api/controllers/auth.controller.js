import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req,res,next)=>{
    const {username,email,password} = req.body;
    const hashedPassword = bcryptjs.hashSync(password,10);
    const newUSer = new User({username,email,password:hashedPassword});
    try{
        await newUSer.save()
        res.status(201).json("User has been created")

    } catch(err){
        next(err);
    }
 

};

export const signin = async (req,res,next)=>{
    const {email,password} = req.body;
    try{
        const validUser = await User.findOne({email});
        if(!validUser) return next(errorHandler(404,"User not found"));

        const validPassword = bcryptjs.compareSync(password,validUser.password);
        if(!validPassword) return next(errorHandler(400,"Wrong Password"));

        const token = jwt.sign({id:validUser._id},process.env.JWT_KEY);
        const {password:pass,...rest} = validUser._doc;
        res.cookie("access_token",token,{httpOnly:true,}).status(200).json(rest);

    } catch(err){
        next(err);
    }
}