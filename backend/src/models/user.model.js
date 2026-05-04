import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "Hey there! I am using ChatApp.",
    },
    blockedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    showOnlineStatus: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
