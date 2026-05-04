
import express from "express";
import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import { createServer } from "http";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { initSocket } from "./lib/socket.js";
import path from "path";

const app = express();
const httpServer = createServer(app);

// Init Socket.IO
initSocket(httpServer);

const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.use((req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

// Start
httpServer.listen(PORT, () => {
  console.log("✅ Server running on PORT: " + PORT);
  connectDB();
});
