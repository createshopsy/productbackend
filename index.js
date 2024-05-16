require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
// const twilio = require("twilio");
// const client = new twilio(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_TOKEN
// );

app.use(cors());
const port = process.env.PORT || 6867;
app.use(express.json());
const product_route = require("./routing/routes");
const users = require("./schema/register");
const { Chats } = require("./schema/Chat");

// const httpServer = require("http");
// const server = httpServer.createServer(app);

const io = require("socket.io")(7654, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
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
  socket.on("typing", (data) => {
    const receiverId = storedata[data.receiverId];
    io.to(receiverId).emit("typingResponse", data.senderId);
  });

  socket.on("sendMessage", async (data) => {
    // client.messages
    //   .create({
    //     body: data.message,
    //     from: "+12513090514",
    //     to: "+918102473490",
    //   })
    //   .then((message) => console.log(message, "number messagessssss"));
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
    console.log(`incoming call from ${data.senderId}`);
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

app.use("/api/products", product_route);

app.listen(port, async () => {
  await mongoose.connect(process.env.MONGO_URL);
});
