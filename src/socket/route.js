const { Server } = require("socket.io");
const { jwtVerify } = require("jose");
require("dotenv").config({ path: "../../.env" }); // Load environment variables

// Log to ensure .env variables are loaded
console.log("Loaded SECRETKEY:", process.env.SECRETKEY);

// Initialize Socket.IO server
const io = new Server(4000, {
  cors: {
    origin: "http://localhost:4000",
  },
});

let onlineUsers = [];

io.on("connection", (socket) => {
  console.log("Connection established. Socket ID:", socket.id);

  socket.on("addNewUser", async (session) => {
    console.log("Received 'addNewUser' event. Session:", session);

    if (!session) {
      console.error("Session not provided by client.");
      return;
    }

    const secretkey = process.env.SECRETKEY || "fallback_key_for_debugging"; // Fallback for debugging
    console.log("SECRETKEY:", secretkey);

    if (!secretkey) {
      console.error("SECRETKEY is not defined in the environment.");
      return;
    }

    const key = new TextEncoder().encode(secretkey);

    try {
      const { payload } = await jwtVerify(session, key, {
        algorithms: ["HS256"],
      });

      console.log("Decoded payload:", payload);
      const username = payload?.User?.username;
      console.log("Extracted username:", username);

      if (!username) {
        console.error("Username not found in payload:", payload);
        return;
      }

      if (!onlineUsers.some((user) => user.userId === username)) {
        onlineUsers.push({
          userId: username,
          socketId: socket.id,
        });
        console.log("User added to onlineUsers:", username);
        console.log("Updated onlineUsers list:", onlineUsers);
      } else {
        console.log("User already exists in onlineUsers:", username);
      }
    } catch (error) {
      console.error("Error verifying JWT:", error);
    }
  });
  socket.on('join-chat',groupId=>{
    socket.join(groupId)
  })
  socket.on('new-message', (message) => {
    if (message?.groupId) {
        console.log(`Broadcasting message to group ${message.groupId}:`, message.text);
        io.to(message.groupId).emit('new-message', message);
    } else {
        console.log('Message does not have a groupId:', message);
    }
});

  socket.on("disconnect", () => {
    console.log("User disconnected. Socket ID:", socket.id);
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    console.log("Updated onlineUsers list after disconnection:", onlineUsers);
  });
});
