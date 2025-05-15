// server.js
require("dotenv").config();
const express = require("express");
const cors    = require("cors");
// import the new client
const { OpenAI } = require("openai");

const app = express();
app.use(cors(), express.json());

// instantiate with your key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;
  try {
    // new method signature:
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages
    });
    // the reply lives in .choices[0].message
    res.json(completion.choices[0].message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Proxy listening on http://localhost:${PORT}`));
