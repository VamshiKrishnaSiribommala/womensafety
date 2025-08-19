// require("dotenv").config();
// const express = require("express");
// const twilio = require("twilio");
// const path = require("path");

// const app = express();
// const port = 3001;

// const client = new twilio(
//     process.env.TWILIO_ACCOUNT_SID,
//     process.env.TWILIO_AUTH_TOKEN
// );

// // Serve static files from public folder
// app.use(express.static(path.join(__dirname, "public")));

// app.post("/call-sos", async (req, res) => {
//     try {
//         const call = await client.calls.create({
//             url: "http://demo.twilio.com/docs/voice.xml",
//             to: process.env.OWNER_PHONE_NUMBER,
//             from: process.env.TWILIO_PHONE_NUMBER,
//         });

//         res.json({ message: "SOS Call Initiated", callSid: call.sid });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });
// app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, "public", "index.html"));
// });

// app.listen(port, () => {
//     console.log(`Server running at http://localhost:${port}`);
// });
