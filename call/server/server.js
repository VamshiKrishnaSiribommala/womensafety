// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const twilio = require("twilio");

// const app = express();
// const port = 8000;

// app.use(cors());
// app.use(express.static("public")); // Serve frontend files
// app.use(express.json());

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
// const emergencyContacts = [
//     "+919550207745"
// ];

// const client = twilio(accountSid, authToken);

// app.post("/call", async (req, res) => {
//     try {
//         for (let contact of emergencyContacts) {
//             await client.calls.create({
//                 url: "http://demo.twilio.com/docs/voice.xml",
//                 to: contact,
//                 from: twilioPhoneNumber
//             });
//         }
//         res.json({ message: "Emergency calls placed!" });
//     } catch (error) {
//         console.error("Error making calls:", error);
//         res.status(500).json({ message: "Failed to make calls" });
//     }
// });

// // Serve HTML file
// app.get("/", (req, res) => {
//     res.sendFile(__dirname + "/public/index.html");
// });

// app.listen(port, () => {
//     console.log(`🚀 Local server running at http://localhost:${port}`);
// });
