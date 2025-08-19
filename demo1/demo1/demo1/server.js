// require("dotenv").config();  

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
// const emergencyContact = process.env.EMERGENCY_CONTACT;

// console.log("Twilio setup loaded successfully!");
// console.log("Sending alerts to:", emergencyContact);



// require("dotenv").config();
// const express = require("express");
// const twilio = require("twilio");
// const cors = require("cors");
// const path = require("path");

// const app = express();
// app.use(express.json());
// app.use(cors());
// app.use(express.static("public"));  // ✅ Serve frontend

// const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// app.post("/send-alert", async (req, res) => {
//     try {
//         const { latitude, longitude } = req.body;
//         const messageBody = `🚨 EMERGENCY ALERT!\n📍 Location: https://www.google.com/maps?q=${latitude},${longitude}`;

//         const message = await client.messages.create({
//             body: messageBody,
//             from: process.env.TWILIO_PHONE_NUMBER,
//             to: process.env.EMERGENCY_CONTACT
//         });

//         console.log("✅ Alert SMS sent:", message.sid);
//         res.json({ success: true, message: "Alert SMS sent successfully!" });
//     } catch (error) {
//         console.error("❌ Error sending SMS:", error.message);
//         res.status(500).json({ success: false, error: error.message });
//     }
// });

// app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, "public", "index.html")); // ✅ Serve `index.html`
// });

// app.listen(3002, () => {
//     console.log("🚀 Server running on http://localhost:3002");
// });
