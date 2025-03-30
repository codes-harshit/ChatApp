import express from "express";
import http from "http";

import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const userSocketMap = {};

export const getReceiverSocketId = (userId) => {
  return userSocketMap[userId];
};

io.on("connection", (socket) => {
  // console.log("A user connected: ", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap)); //send online users
  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    // console.log("A user disconnected: ", socket.id);
  });
});

export { io, app, server };
