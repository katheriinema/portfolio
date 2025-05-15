// api/chat.js
import { OpenAI } from "openai";

// 🔍 Immediately verify the env var on every cold start
const rawKey = process.env.OPENAI_API_KEY;
console.log(
  "OpenAI key loaded:",
  rawKey && rawKey.startsWith("sk-") ? "✅ valid format" : "❌ MISSING or invalid"
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  // (Optionally, you can also double-check inside the handler)
  console.log(
    "Inside handler, key:",
    process.env.OPENAI_API_KEY?.startsWith("sk-") ? "✅ loaded" : "❌ missing"
  );

  const { messages } = req.body;
  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: "messages must be an array" });
  }

  try {
    const openai = new OpenAI({ apiKey: rawKey });
    const result = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
    });
    return res.status(200).json({ content: result.choices[0].message.content });
  } catch (err) {
    console.error("❌ OpenAI error:", err);
    return res.status(500).json({ error: err.message });
  }
}
