require("dotenv").config();
const twilio = require("twilio");

// Load credentials from .env
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendAlertSMS = async () => {
    try {
        const message = await client.messages.create({
            body: "🚨 Emergency Alert! A panic button has been triggered. Please respond immediately.",
            from: process.env.TWILIO_PHONE_NUMBER,
            to: process.env.EMERGENCY_CONTACT
        });

        console.log("✅ SMS sent successfully:", message.sid);
    } catch (error) {
        console.error("❌ Error sending SMS:", error.message);
    }
};

// Run function to send SMS
sendAlertSMS();
