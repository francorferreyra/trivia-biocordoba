const functions = require('firebase-functions');
const express = require('express');

const app = express();

app.get('/', (res, req) => {
    return res.status(200).json({message: 'Hello Word'});
})

exports.app = functions.https.onRequest(app); 





// const admin = require("firebase-admin");
// function initFirebase() {
//     const serviceAccount = require(__dirname + "/keys/prueba-v9-firebase-adminsdk-qklrx-8e0bb27ba6.json")
//     admin.initializeApp({
//         credential: admin.credential.cert(serviceAccount)
//     });
// }
// initFirebase();

// function sendPushToOneUser(notification) {
//     const message = {
//         token: notification.tokenId,
//         data: {
//             title: notification.title,
//             bodi: notification.body
//         }
//     }
//     sendMessage(message);
// }


// function sendPushToTopic(notification) {
//     const message = {
//         topic: notification.topix,
//         data: {
//             title: notification.title,
//             body: notification.body
//         }
//     }
//     sendMessage(message);
// }

// module.exports = { sendPushToOneUser, sendPushToTopic }

// function sendMessage(message) {
//     admin.messaging().send(message)
//     .then((response) => {
//         console.log("Succesfully sent message: ", response);
//     }).catch((error) => {
//         console.log("Error sending message: ", error);
//     });
// }