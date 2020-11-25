const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const { fromatMessage } = require("./utils/messages");
const formatMessage = require("./utils/messages");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set Static folder
app.use(express.static(path.join(__dirname, "public")));

const PORT = 5000 || process.env.PORT;

const botName = "Chat Bot";

// Run when client connects
io.on("connection", (socket) => {
  socket.emit("message", formatMessage(botName, "Welcome to the Chat"));

  // Broadcast when a user connects
  socket.broadcast.emit(
    "message",
    formatMessage(botName, "A user has joined the chat")
  );

  // Runs when client disconnects
  socket.on("disconnect", () => {
    io.emit("message", formatMessage(botName, "A user has left the chat"));
  });

  // Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    console.log(msg);
    io.emit("message", formatMessage("USER", msg));
  });
});

server.listen(PORT, () =>
  console.log(`Server running on: http://localhost:${PORT}`)
);
