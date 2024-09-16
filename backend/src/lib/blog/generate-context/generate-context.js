import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

export async function generateContext(content) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const prompt = process.env.GENERATE_CONTEXT_PROMPT;

  try {
    for (const sections of content) {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `${prompt}${sections}`,
          },
        ],
      });

      console.log(response.choices[0].message.content);
    }
  } catch (error) {
    console.log(error);
    return { error: false, message: error.message };
  }
}
