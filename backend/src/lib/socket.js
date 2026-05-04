import { Server } from "socket.io";

let io;
const userSocketMap = {}; // userId -> socketId

export const getReceiverSocketId = (userId) => {
  return userSocketMap[userId?.toString()];
};

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) {
      userSocketMap[userId] = socket.id;
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
      if (userId) {
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
      }
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io is not initialized!");
  return io;
};
