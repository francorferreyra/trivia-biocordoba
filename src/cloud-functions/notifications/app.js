// const express = require("express");

// const Notification = require("./notifications.js");

// const app = express();

// app.get("/one-user", (res, req) => {
//     try {
//         const data = {
//             tokenId: "asd",
//             title: "Sending Message with Cloud Funtion",
//             body: "Message Notification to One User"
//         }
//         Notification.sendPushToOneUser(data);
//         res.status(200).json("Send notification to one user");
//     } catch (error) {
//         res.status(400).send(error);
//     }
// })

// app.get("/topic", (res, req) => {
//     try {
//         const data = {
//             topic: "allUsers",
//             title: "Sending Message with Cloud Funtion",
//             body: "Message Notification to Topic"
//         }
//         Notification.sendPushToTopic(data);        
//         res.status(200).json("Send notification to topic");
//     } catch (error) {
//         res.status(400).send(error);
//     }
// });

// app.get("/", (res, req) => {
//     res.send("Succes");
// });

// app.listen("/notifications", () => {
//     console.log("Server started");
// })