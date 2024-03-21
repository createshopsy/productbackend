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
// const db = require("./productdb");

app.use("/api/products", product_route);
const io = require("socket.io")(7654, {
  cors: {
    origin: "http://localhost:3000",
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


  socket.on('callUser', (data) => {
    console.log(`Incoming call from ${data.senderId}`);
    io.to(data.receiverId).emit('callUser', {
      signalData: data.signalData,
      senderId: data.senderId,
    });
  
    socket.on('answerCall', (data) => {
      console.log(`Answering call from ${data.senderId}`);
      io.to(data.senderId).emit('callAccepted', data.signal);
    });
  });

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



app.listen(port, async () => {
  mongoose.connect(process.env.MONGO_URL);
});
