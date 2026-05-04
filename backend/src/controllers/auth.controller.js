import { generateToken } from "../lib/utilis.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  if (!req.body) {
    return res
      .status(400)
      .json({ message: "Request body is missing. Please send JSON data." });
  }
  // Accept both 'fullname' and 'fullName' for flexibility
  const fullname = req.body.fullname || req.body.fullName;
  let { email, password } = req.body;
  if (email) email = email.toLowerCase();
  try {
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    if (!email || !fullname || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    generateToken(newUser._id, res);
    return res.status(201).json({
      _id: newUser._id,
      fullname: newUser.fullname,
      email: newUser.email,
      profilePic: newUser.profilePic,
      bio: newUser.bio,
      blockedUsers: newUser.blockedUsers,
      showOnlineStatus: newUser.showOnlineStatus,
    });
  } catch (error) {
    console.log("Error in signup controller:", error.message);
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const login = async (req, res) => {
  let { email, password } = req.body;
  if (email) email = email.toLowerCase();
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res);
    return res.status(200).json({
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      profilePic: user.profilePic,
      bio: user.bio,
      blockedUsers: user.blockedUsers,
      showOnlineStatus: user.showOnlineStatus,
    });
  } catch (error) {
    console.log("Error in login controller:", error.message);
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller:", error.message);
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const updateprofile = async (req, res) => {
  try {
    const { profilePic, bio, fullname, showOnlineStatus } = req.body;
    const userId = req.user._id;

    if (!profilePic && bio === undefined && !fullname && showOnlineStatus === undefined) {
      return res.status(400).json({ message: "No data to update" });
    }

    let updateData = {};
    if (bio !== undefined) updateData.bio = bio;
    if (fullname) updateData.fullname = fullname;
    if (showOnlineStatus !== undefined) updateData.showOnlineStatus = showOnlineStatus;

    if (profilePic) {
      let imageUrl;
      try {
        const result = await cloudinary.uploader.upload(profilePic);
        imageUrl = result.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary upload failed, falling back to base64:", uploadError.message);
        imageUrl = profilePic; // Fallback to base64 string directly
      }
      updateData.profilePic = imageUrl;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true },
    );
    res.status(200).json({ updatedUser });
  } catch (error) {
    console.log("Error in updateProfile controller:", error.message);
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json({ user: req.user });
  } catch (error) {
    console.log("Error in checkAuth controller:", error.message);
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const toggleBlock = async (req, res) => {
  try {
    const userIdToToggle = req.params.id;
    const myId = req.user._id;

    if (userIdToToggle === myId.toString()) {
      return res.status(400).json({ message: "You cannot block yourself" });
    }

    const user = await User.findById(myId);
    const isBlocked = user.blockedUsers.includes(userIdToToggle);

    if (isBlocked) {
      user.blockedUsers = user.blockedUsers.filter((id) => id.toString() !== userIdToToggle);
    } else {
      user.blockedUsers.push(userIdToToggle);
    }

    await user.save();
    
    // Also return the updated user object with the blocked array
    res.status(200).json({
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      profilePic: user.profilePic,
      bio: user.bio,
      blockedUsers: user.blockedUsers,
      showOnlineStatus: user.showOnlineStatus,
    });
  } catch (error) {
    console.log("Error in toggleBlock controller:", error.message);
    res.status(500).json({ message: "Internal Server error" });
  }
};

import Message from "../models/message.model.js";

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;
    // Delete all messages sent or received by this user
    await Message.deleteMany({ $or: [{ senderId: userId }, { receiverId: userId }] });
    // Delete the user
    await User.findByIdAndDelete(userId);
    // Clear cookie
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.log("Error in deleteAccount controller:", error.message);
    res.status(500).json({ message: "Internal Server error" });
  }
};
