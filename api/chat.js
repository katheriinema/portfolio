// api/chat.js
import { OpenAI } from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { messages } = req.body;
  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: "messages must be an array" });
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const result = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages
    });
    return res.status(200).json({ content: result.choices[0].message.content });
  } catch (err) {
    console.error("❌ OpenAI error:", err);
    return res.status(500).json({ error: err.message });
  }
}
