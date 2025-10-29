// server/index.js
import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: "../.env", override: true });

// Import API routes
import stripeRoutes from "./api/stripe.js";


// Initialize Express
const app = express();
const PORT = process.env.PORT || 3001;

// --------------------
// ✅ Middleware
// --------------------
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(","),
    credentials: true,
  })
);

// --------------------
// ✅ Gmail Transporter
// --------------------
const createTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

// --------------------
// ✅ Email Endpoints
// --------------------
app.post("/api/send-email", async (req, res) => {
  const { to, subject, html } = req.body;

  if (!to || !subject || !html) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields: to, subject, html",
    });
  }

  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: `ShareLah <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("📧 Email sent successfully:", info.messageId);
    res.json({
      success: true,
      message: "Email sent successfully",
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.get("/api/test-email", async (_, res) => {
  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: `ShareLah <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: "Test Email from ShareLah",
      html: "<h1>Success!</h1><p>Your email configuration works 🎉</p>",
    });

    res.json({
      success: true,
      message: "Test email sent successfully!",
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("❌ Error testing email:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// --------------------
// ✅ Payment Routes
// --------------------
app.use("/api/stripe", stripeRoutes);


// --------------------
// ✅ Health Check
// --------------------
app.get("/api/health", (_, res) => {
  res.json({
    ok: true,
    message: "ShareLah backend is running 🟢",
  });
});

// --------------------
// ✅ Start Server
// --------------------
app.listen(PORT, () => {
  console.log("🚀 ShareLah backend running:");
  console.log(`→ PORT: ${PORT}`);
  console.log(`→ Gmail user: ${process.env.GMAIL_USER || "Not configured"}`);
  console.log(
    `→ Gmail password configured: ${process.env.GMAIL_APP_PASSWORD ? "Yes" : "No"}`
  );
  console.log(
    `→ CORS allowed: ${
      process.env.CORS_ORIGIN || "All origins (development default)"
    }`
  );
  console.log(
    `→ Stripe key configured: ${process.env.STRIPE_SECRET_KEY ? "Yes" : "No"}`
  );
});
