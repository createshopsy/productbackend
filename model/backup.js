
// ================calls===========================

// import { useState, useEffect, useRef } from "react";
// import io from "socket.io-client";
// import axios from "axios";
// import NotificationsIcon from "@mui/icons-material/Notifications";

// const Showchat = () => {
//   const [userName, setUserName] = useState();
//   const [getalluser, Setgetaluser] = useState();
//   const [allMessages, setAllMessages] = useState([]);
//   const [inputValue, setInputValue] = useState("");
//   const [selectedUserId, setSelectedUserId] = useState("");
//   const [selectedIndex, setSelectedIndex] = useState();
//   const [showWebcam, setShowWebcam] = useState(false);
//   const [stream, setStream] = useState();
//   const videoRef = useRef();
//   const socket = io("http://localhost:7654");

//   const getusersdata = () => {
//     axios
//       .get("http://localhost:4545/api/products/user", {
//         headers: { Authorization: ` ${token}` },
//       })
//       .then((response) => {
//         setUserName(response?.data?.newuser);
//       });
//   };

//   const callUser = () => {
// socket.emit("receiveCall", {
//   senderId: userName._id,
//   receiverId: selectedUserId,
// });

//     navigator.mediaDevices
//       .getUserMedia({ audio: true, video: true })
//       .then((stream) => {
//         setStream(stream);
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//         }
//       })
//       .catch((error) => {
//         console.error(error);
//       });
//   };

//   useEffect(() => {
//     if (socket) {
//       socket.on("incomingCall", (data) => {
//         // Handle incoming call notification
//         console.log("Incoming call from user: ", data.callerId);
//       });

//       socket.on("callAccepted", (data) => {
//         // Handle call acceptance logic
//         console.log("Call accepted by user: ", data.receiverId);
//       });

//       socket.on("callRejected", (data) => {
//         // Handle call rejection logic
//         console.log("Call rejected by user: ", data.receiverId);
//       });

//       socket.on("disconnect", () => {
//         console.log("Disconnected from server");
//       });
//     }
//   }, [socket]);

//   return (
//     // Your existing JSX code here
//   );
// };

// export default Showchat;
// Backend code for receiving calls using Socket.IO

// Add a new event listener for receiving calls

// =================backendreceivecall===============================
// socket.on("receiveCall", async (data) => {
//     const receiverId = storedata[data.receiverId];
//     const senderId = storedata[data.senderId];
  
//     // Handle the call logic here
//     // You can emit events to notify the sender and receiver about the call
//     // For example:
//     // io.to(receiverId).emit("incomingCall", { callerId: data.senderId });
//   });
  
//   // Handle call acceptance event
//   socket.on("acceptCall", async (data) => {
//     const receiverId = storedata[data.receiverId];
//     const senderId = storedata[data.senderId];
  
//     // Handle the call acceptance logic here
//     // You can establish a connection between the caller and receiver
//     // For example:
//     // io.to(senderId).emit("callAccepted", { receiverId: data.receiverId });
//   });
  
//   // Handle call rejection event
//   socket.on("rejectCall", async (data) => {
//     const receiverId = storedata[data.receiverId];
//     const senderId = storedata[data.senderId];
  
//     // Handle the call rejection logic here
//     // You can notify the caller that the call was rejected
//     // For example:
//     // io.to(senderId).emit("callRejected", { receiverId: data.receiverId });
//   });