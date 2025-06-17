const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-joined", socket.id);

    socket.on("offer", (data) => {
      socket.to(roomId).emit("offer", data);
    });

    socket.on("answer", (data) => {
      socket.to(roomId).emit("answer", data);
    });

    socket.on("ice-candidate", (data) => {
      socket.to(roomId).emit("ice-candidate", data);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
      socket.to(roomId).emit("user-left");
    });
  });
});

server.listen(5000, () => console.log("Server running on port 5000"));
