require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");

app.use(cors());
const port = process.env.PORT || 6867;
app.use(express.json());
const product_route = require("./routing/routes");
const users = require("./schema/register");
const { Chats } = require("./schema/Chat");


const http = require("http");
const server = http.createServer(app);
console.log("server",server);
const io = require("socket.io")(server,{
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const storedata = {};
io.on("connection", (socket) => {
  console.log("connected with user");

  socket.on("user_connected", async (data) => {
    if (data) {
      storedata[data.userId] = socket.id;
    }
  });
  socket.on("sendMessage", async (data) => {
    const receiverId = storedata[data.receiverId];
    const senderId = storedata[data.senderId];
    const id1 = data.receiverId;
    const userId = data.senderId;

    const user1 = await users.findById({ _id: id1 });
    const user2 = await users.findById({ _id: userId });
    const getallmessage = await Chats.aggregate([
      { $match: { $or: [{ To: user1.id }, { From: user1.id }] } },
      { $match: { $or: [{ To: user2.id }, { From: user2.id }] } },
    ]);
    io.to(receiverId).emit("receiveMessage", getallmessage);
    io.to(senderId).emit("receiveMessage", getallmessage);
  });
  socket.on("Calling", async (data) => {
    console.log(`incoming call from ${data.senderId}`)
    const receiverId = storedata[data.receiverId];
    const senderId = storedata[data.senderId];
    io.to(receiverId).emit("incomingCall", { callerId: senderId });
  });

  socket.on("acceptCall", async (data) => {
    const receiverId = storedata[data.receiverId];
    const senderId = storedata[data.senderId];
    io.to(senderId).emit("callAccepted", { receiverId: receiverId });
  });

  socket.on("endCall", (data) => {
    console.log("User ended call with:", data.senderId);
    socket.broadcast.emit("endCall", data);
  })
  socket.on("disconnect", () => {
    const userId = Object.keys(storedata).find(
      (key) => storedata[key] === socket.id
    );
    if (userId) {
      delete storedata[userId];
      console.log(`User ${userId} disconnected`);
    }
  });
});

app.use("/api/products", product_route);


app.listen(port, async () => {
  await mongoose.connect(process.env.MONGO_URL);
});
