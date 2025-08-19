 
// require("dotenv").config();
// const express = require("express");
// const mysql = require("mysql");
// const multer = require("multer");
// const fs = require("fs");
// const cors = require("cors");
// const twilio = require("twilio");
// const bodyParser = require("body-parser");
// const path = require("path");

// const app = express();
// app.use(express.json());
// app.use(cors());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use(express.static(path.join(__dirname, "../frontend")));

// const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// // 📌 Set up MySQL connection
// const db = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASS,
//     database: process.env.DB_NAME
// });

// db.connect(err => {
//     if (err) throw err;
//     console.log("✅ MySQL Connected...");
// });

// // 📌 Set up Multer for File Uploads (Audio/Video)
// const storage = multer.diskStorage({
//     destination: "./uploads/",
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + "_" + file.originalname);
//     }
// });
// const upload = multer({ storage });

// // 📌 Route to Send Emergency SMS with Location
// app.post("/send-sms", (req, res) => {
//     const { latitude, longitude } = req.body;
//     const locationURL = `https://www.google.com/maps?q=${latitude},${longitude}`;

//     client.messages.create({
//         body: `🚨 Emergency! HELP detected! Location: ${locationURL}`,
//         from: process.env.TWILIO_PHONE_NUMBER,
//         to: process.env.EMERGENCY_CONTACT
//     })
//     .then(() => res.send("✅ SMS Sent Successfully!"))
//     .catch(err => res.status(500).send(err));
// });

// // 📌 Route to Upload Audio/Video
// app.post("/upload", upload.single("file"), (req, res) => {
//     const filePath = req.file.path;
//     res.json({ message: "✅ File Uploaded", filePath });
// });

// // 📌 Route to Fetch Recorded Files
// app.get("/files", (req, res) => {
//     fs.readdir("./uploads", (err, files) => {
//         if (err) return res.status(500).send("Error reading files.");
//         res.json(files);
//     });
// });

// // 📌 Route to serve index.html
// app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, "../frontend/index.html"));
// });

// // 📌 Start Server
// const PORT = 3000;  // Change port if needed
// app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));

