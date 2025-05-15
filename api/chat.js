// api/chat.js
import { config }        from "dotenv";
import { OpenAI }        from "openai";

config(); // load process.env.OPENAI_API_KEY

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { messages } = req.body;
    const completion = await openai.chat.completions.create({
      model:    "gpt-3.5-turbo",
      messages
    });
    res.status(200).json(completion.choices[0].message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
