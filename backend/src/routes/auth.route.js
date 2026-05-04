import express from "express";
import {
  login,
  logout,
  signup,
  updateprofile,
  checkAuth,
  toggleBlock,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.put("/update-profile", protectRoute, updateprofile);
router.post("/block/:id", protectRoute, toggleBlock);
router.get("/check", protectRoute, checkAuth);

export default router;
