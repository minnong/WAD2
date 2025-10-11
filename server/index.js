const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
const openRouterRoute = require("./openrouter");
app.use("/api", openRouterRoute);


// Gmail transporter configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
};

// Send email endpoint
app.post('/api/send-email', async (req, res) => {
  const { to, subject, html } = req.body;

  if (!to || !subject || !html) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: to, subject, html'
    });
  }

  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `ShareLah <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent successfully:', info.messageId);
    res.json({
      success: true,
      messageId: info.messageId,
      message: 'Email sent successfully'
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Email service is running' });
});

// Test email endpoint
app.get('/api/test-email', async (req, res) => {
  try {
    const transporter = createTransporter();

    const info = await transporter.sendMail({
      from: `ShareLah <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER, // Send to yourself
      subject: 'Test Email from ShareLah',
      html: '<h1>Success!</h1><p>Your email configuration is working correctly.</p>'
    });

    res.json({
      success: true,
      message: 'Test email sent successfully!',
      messageId: info.messageId
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// FAQ Chatbot Endpoint 
const fetch = require('node-fetch');

app.post('/api/faq-chat', async (req, res) => {
  const { question } = req.body;

  if (!question || question.trim() === '') {
    return res.status(400).json({ error: 'Question is required' });
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful FAQ assistant for the ShareLah app. Only answer questions related to the app features, rentals, safety, or usage. Keep answers short and clear.',
          },
          { role: 'user', content: question },
        ],
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error('OpenRouter error:', data.error);
      return res.status(500).json({ error: data.error.message });
    }

    const reply =
      data.choices?.[0]?.message?.content ||
      "Sorry, I don’t have an answer for that yet.";

    res.json({ reply });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ error: 'Failed to contact chatbot service' });
  }
});

app.listen(PORT, () => {
  console.log(`Email service running on port ${PORT}`);
  console.log(`Gmail user: ${process.env.GMAIL_USER || 'Not configured'}`);
  console.log(`Gmail app password configured: ${process.env.GMAIL_APP_PASSWORD ? 'Yes' : 'No'}`);
  console.log(`Backend URL: ${process.env.VITE_BACKEND_URL || 'http://localhost:5000'}`);
});
