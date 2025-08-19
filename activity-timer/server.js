// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const twilio = require("twilio");

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// let activeTimers = {};

// app.post("/start-timer", (req, res) => {
//     const { timeLimit } = req.body;
//     const timerId = Date.now();

//     activeTimers[timerId] = setTimeout(() => {
//         sendAlert();
//     }, timeLimit * 1000);

//     res.json({ message: "Timer started", timerId });
// });

// app.post("/cancel-timer", (req, res) => {
//     const { timerId } = req.body;

//     if (activeTimers[timerId]) {
//         clearTimeout(activeTimers[timerId]);
//         delete activeTimers[timerId];
//         res.json({ message: "Timer canceled" });
//     } else {
//         res.status(400).json({ message: "Invalid timer ID" });
//     }
// });

// function sendAlert() {
//     client.messages
//         .create({
//             body: "Alert: IAM IN DANGER ,HELP ME!!!",
//             from: process.env.TWILIO_PHONE_NUMBER,
//             to: process.env.OWNER_PHONE_NUMBER,
//         })
//         .then(message => console.log("Alert Sent: " + message.sid))
//         .catch(error => console.error(error));
// }
// app.use(express.static("public"));

// app.listen(process.env.PORT, () => {
//     console.log(`Server running on http://localhost:${process.env.PORT}`);
// });
