require("dotenv").config();
const express = require("express");
const twilio = require("twilio");
const mysql = require("mysql");
const multer = require("multer");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // Serve frontend files
app.use("/uploads", express.static(path.join(__dirname, "Uploads")));
// Expose activity-timer static files
app.use("/activity-timer/public", express.static(path.join(__dirname, "activity-timer", "public")));
// Expose demo1 static files (clean alias)
app.use("/demo1", express.static(path.join(__dirname, "demo1", "demo1", "demo1", "public")));
// Back-compat for the long path that was previously used
app.use("/demo1/demo1/demo1/public", express.static(path.join(__dirname, "demo1", "demo1", "demo1", "public")));
// Expose emergency_alert frontend (clean alias)
app.use("/emergency-alert", express.static(path.join(__dirname, "emergency_alert", "emergency_alert", "frontend")));
// Back-compat for the long path that was used
app.use("/emergency_alert/emergency_alert/frontend", express.static(path.join(__dirname, "emergency_alert", "emergency_alert", "frontend")));
// Expose call/server static files
app.use("/call", express.static(path.join(__dirname, "call", "server", "public")));
// Back-compat for the long path
app.use("/call/server/public", express.static(path.join(__dirname, "call", "server", "public")));
// Expose sos-call static files
app.use("/sos-call", express.static(path.join(__dirname, "sos-call", "public")));
// Back-compat for the long path
app.use("/sos-call/public", express.static(path.join(__dirname, "sos-call", "public")));
// Direct file route for sos-call
app.get(["/sos-call", "/sos-call/", "/sos-call/index.html"], (req, res) => {
  res.sendFile(path.join(__dirname, "sos-call", "public", "index.html"));
});
// Expose safety videos (clean alias and space-path back-compat)
app.use("/safety-videos", express.static(path.join(__dirname, "safety videos", "safety videos")));
app.use("/safety videos/safety videos", express.static(path.join(__dirname, "safety videos", "safety videos")));
// Direct file routes for reliability
app.get(["/safety-videos/videos.html", "/safety-videos/", "/safety videos/safety videos/videos.html", "/safety videos/safety videos/"], (req, res) => {
  res.sendFile(path.join(__dirname, "safety videos", "safety videos", "videos.html"));
});

// Twilio Client
const client = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
  { lazyLoading: true }
);

// Emergency Contacts (support comma-separated list via EMERGENCY_CONTACTS or single EMERGENCY_CONTACT)
const emergencyContacts = (process.env.EMERGENCY_CONTACTS || process.env.EMERGENCY_CONTACT || "+919550207745")
  .split(",")
  .map(n => n.trim())
  .filter(Boolean);

// MySQL Connection (Optional)
let db;
const mysqlConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
};

function ensureFilesTableExists() {
  if (!db) return;
  const createTableSql = `
    CREATE TABLE IF NOT EXISTS files (
      id INT AUTO_INCREMENT PRIMARY KEY,
      filename VARCHAR(255) NOT NULL,
      filepath VARCHAR(1024) NOT NULL,
      uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;
  db.query(createTableSql, (err) => {
    if (err) {
      console.warn("⚠️ Failed to ensure files table exists:", err.message);
    } else {
      console.log("✅ Verified/created MySQL table: files");
    }
  });
}

if (mysqlConfig.user && mysqlConfig.password && mysqlConfig.database) {
  db = mysql.createConnection(mysqlConfig);
  db.connect(err => {
    if (err) {
      console.warn("⚠️ MySQL Connection Failed:", err.message, "\nFile metadata storage will be disabled.");
      db = null;
    } else {
      console.log("✅ MySQL Connected...");
      ensureFilesTableExists();
    }
  });
} else {
  console.warn("⚠️ MySQL credentials missing in .env. File metadata storage disabled.");
  db = null;
}

// Multer Setup for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "Uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  }
});
const upload = multer({ storage });

// Timer Management
let activeTimers = {};

app.post("/start-timer", (req, res) => {
  const { timeLimit } = req.body;
  if (!timeLimit || isNaN(timeLimit)) {
    return res.status(400).json({ message: "Invalid time limit" });
  }
  const timerId = Date.now();

  activeTimers[timerId] = setTimeout(() => {
    sendAlert();
    delete activeTimers[timerId];
  }, timeLimit * 1000);

  res.json({ message: "Timer started", timerId });
});

app.post("/cancel-timer", (req, res) => {
  const { timerId } = req.body;

  if (activeTimers[timerId]) {
    clearTimeout(activeTimers[timerId]);
    delete activeTimers[timerId];
    res.json({ message: "Timer canceled" });
  } else {
    res.status(400).json({ message: "Invalid timer ID" });
  }
});

function sendAlert() {
  client.messages
    .create({
      body: "Alert: IAM IN DANGER, HELP ME!!!",
      from: process.env.TWILIO_PHONE_NUMBER,
      to: process.env.EMERGENCY_CONTACT
    })
    .then(message => console.log("✅ Alert Sent:", message.sid))
    .catch(error => console.error("❌ Error sending alert:", error.message));
}

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

app.post("/call", async (req, res) => {
  try {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      return res.status(500).json({ message: "Twilio credentials not configured" });
    }
    if (!twilioPhoneNumber || !twilioPhoneNumber.startsWith("+")) {
      return res.status(400).json({ message: "Invalid TWILIO_PHONE_NUMBER. Must be E.164 format starting with +" });
    }
    if (!emergencyContacts.length || !emergencyContacts.every(n => n.startsWith("+"))) {
      return res.status(400).json({ message: "Invalid EMERGENCY_CONTACT(S). Must be E.164 format starting with +" });
    }

    const calls = [];
    for (const contact of emergencyContacts) {
      const call = await client.calls.create({
        url: "http://demo.twilio.com/docs/voice.xml",
        to: contact,
        from: twilioPhoneNumber
      });
      calls.push(call.sid);
    }
    res.json({ message: "Emergency calls placed!", callSids: calls });
  } catch (error) {
    console.error("❌ Error making calls:", error.message || error);
    res.status(500).json({ message: "Failed to make calls", error: error.message || String(error) });
  }
});


// Emergency Call
app.post("/call-sos", async (req, res) => {
  try {
    const calls = await Promise.all(
      emergencyContacts.map(contact =>
        client.calls.create({
          url: "http://demo.twilio.com/docs/voice.xml",
          to: contact,
          from: process.env.TWILIO_PHONE_NUMBER
        })
      )
    );
    res.json({ message: "Emergency calls placed!", callSids: calls.map(call => call.sid) });
  } catch (error) {
    console.error("❌ Error making calls:", error.message);
    res.status(500).json({ message: "Failed to make calls", error: error.message });
  }
});

// Send SMS with Location
async function handleSendAlert(req, res) {
  try {
    const { latitude, longitude } = req.body;
    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Latitude and longitude are required" });
    }
    const messageBody = `🚨 EMERGENCY ALERT!\n📍 Location: https://www.google.com/maps?q=${latitude},${longitude}`;

    const message = await client.messages.create({
      body: messageBody,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: process.env.EMERGENCY_CONTACT
    });

    console.log("✅ Alert SMS sent:", message.sid);
    res.json({ success: true, message: "Alert SMS sent successfully!" });
  } catch (error) {
    console.error("❌ Error sending SMS:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
}

// Support both routes used by different frontends
app.post("/send-alert", handleSendAlert);
app.post("/emergency-alert", handleSendAlert);

// Backward compatible route name
app.post("/send-sms", handleSendAlert);

// File Upload
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const filePath = req.file.path;

  if (db) {
    const query = "INSERT INTO files (filename, filepath) VALUES (?, ?)";
    db.query(query, [req.file.filename, filePath], (err) => {
      if (err) {
        if (err.code === "ER_NO_SUCH_TABLE") {
          // Attempt to create the table and retry once
          ensureFilesTableExists();
          return db.query(query, [req.file.filename, filePath], (retryErr) => {
            if (retryErr) {
              console.error("❌ Error saving file metadata after creating table:", retryErr.message);
              return res.status(500).json({ message: "Failed to save file metadata" });
            }
            return res.json({ message: "✅ File Uploaded", filePath });
          });
        }
        console.error("❌ Error saving file metadata:", err.message);
        return res.status(500).json({ message: "Failed to save file metadata" });
      }
      res.json({ message: "✅ File Uploaded", filePath });
    });
  } else {
    res.json({ message: "✅ File Uploaded (no DB storage)", filePath });
  }
});

// Fetch Uploaded Files
app.get("/files", (req, res) => {
  fs.readdir(path.join(__dirname, "Uploads"), (err, files) => {
    if (err) {
      console.error("❌ Error reading files:", err.message);
      return res.status(500).json({ message: "Error reading files" });
    }
    res.json(files);
  });
});

// Serve Frontend
app.get("/", (req, res) => {
  const indexPath = path.join(__dirname, "public", "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ message: "index.html not found in public directory" });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});