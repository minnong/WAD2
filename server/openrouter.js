const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config({ path: "../.env" });

const router = express.Router();

// POST /api/chat
router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
      }),
    });

    const data = await response.json();

    res.json({ reply: data.choices[0].message.content });
  } catch (error) {
    console.error("Error calling OpenRouter:", error);
    res.status(500).json({ error: "Failed to fetch from OpenRouter" });
  }
});

module.exports = router;
