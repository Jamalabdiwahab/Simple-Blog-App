import { accessToken, refreshToken } from "../lib/token.js";
import User from "../models/users.model.js";
import jwt from "jsonwebtoken";
import ImageKit from "imagekit";
import bcrypt from "bcryptjs";

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export async function register(req,res) {

    let { name, email, password, profilePic} = req.body

    if(!name || !email || !password){
        return res.status(400).json({message:"please fill all the fields"})
    }

    try {
        email = email.trim().toLowerCase();
        const existing = await User.findOne({email});

        if(existing){
            return res.status(400).json({message:"this email already exists."})
        }

        const user = await User.create({name,email,password,profilePic});
        
        const newAccessToken = accessToken(user._id);
        const newRefreshToken = refreshToken(user._id);

        res.cookie("refreshToken",newRefreshToken,{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite:"strict"
        })
        res.status(201).json({
            message:"user created successfully",
            user,
            newAccessToken
        })
    } catch (error) {
        console.error("error creating user: ",error);
        res.status(500).json({message:"internal server error"})
    }
}
export async function login(req,res) {

    let { email, password} = req.body

    if(!email || !password){
        return res.status(400).json({message:"please fill all the fields"})
    }

    try {
        email = email.trim().toLowerCase();
        const user = await User.findOne({email});

        if(!user || !(await user.matchPassword(password))){
            return res.status(404).json({message:"invalid email or password"})
        }

        const newAccessToken = accessToken(user._id);
        const newRefreshToken = refreshToken(user._id);

        res.cookie("refreshToken",newRefreshToken,{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite:"strict"
        })


        res.status(200).json({
            message:"logged in successfully",
            user,
            newAccessToken
        })
    } catch (error) {
        console.error("error logging in user: ",error);
        res.status(500).json({message:"internal server error"})
    }
}

export async function refreshTokenController(req,res) {

    const token = req.cookies.refreshToken;

    if(!token){
        return res.status(401).json({message:"No refresh token provided."})
    }

    try {
        
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        console.log(decoded);

        const user = await User.findById(decoded.id);

        if(!user){
            return res.status(404).json({message:"User not found."})
        }

        const newAccessToken=accessToken(user._id);

        res.status(200).json({
            accessToken:newAccessToken,
            user
        })

    } catch (error) {
        console.error("error refresh token: ",error);
        res.status(500).json({message:"internal server error"})
    }
    
}
export async function logout(req,res) {


    try {
        res.clearCookie("refreshToken",{
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        })

        res.status(200).json({
            message:"logged out successfully."
        })

    } catch (error) {
        console.error("error logging out: ",error);
        res.status(500).json({message:"internal server error"})
    }
    
}

// Upload or update profile picture
export async function updateProfilePic(req, res) {

    try {
        
        if(!req.file){
            return res.status(400).json({ message: "No image file provided." });
        }

        const user = await User.findById(req.user.id);

        if(!user){
            return res.status(404).json({ message: "User not found." });
        }

        // Delete old image from ImageKit if it exists
        if (user.profilePicFileId) {
            await imagekit.deleteFile(user.profilePicFileId).catch((err) => {
                console.warn("Could not delete old profile pic:", err.message);
            });
        }

        // upload new image to imagekit
        const uploadRes = await imagekit.upload({
            file: req.file.buffer,           // file buffer from multer
            fileName: `profile_${user._id}`, // unique filename per user
            folder: "/profile-pictures",     // folder in ImageKit
            useUniqueFileName: false,        // overwrite same filename
        })

        // Save new URL and fileId to user
        user.profilePic = uploadRes.url;
        user.profilePicFileId = uploadRes.fileId;
        await user.save();

        res.status(200).json({
            message: "Profile picture updated successfully.",
            profilePic: user.profilePic,
            user,
        });
    } catch (error) {
        console.error("error updating profile pic: ", error);
        res.status(500).json({ message: "internal server error" });
    }
}

export async function updateProfile(req, res) {
  try {
    const { name, email } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (email) user.email = email.toLowerCase();

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}


export async function updatePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword; // (make sure your model hashes it)
    await user.save();

    res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}