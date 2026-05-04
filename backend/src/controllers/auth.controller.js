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
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile picture is required" });
    }

    let imageUrl;
    try {
      const result = await cloudinary.uploader.upload(profilePic);
      imageUrl = result.secure_url;
    } catch (uploadError) {
      console.error("Cloudinary upload failed, falling back to base64:", uploadError.message);
      imageUrl = profilePic; // Fallback to base64 string directly
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: imageUrl },
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
