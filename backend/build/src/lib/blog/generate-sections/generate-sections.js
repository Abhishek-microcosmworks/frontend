import OpenAI from "openai";
import { extractSectionNames } from "../extract-sections-name/index.js";
import { saveBlogsContent } from "../save-blogs-content/index.js";
import dotenv from "dotenv";

dotenv.config();

export async function generateSections(content, email, requestId) {
  const blogs = [];
  const sectionsContentArray = [];

  try {
    const openai = new OpenAI();

    for (const blogContent of content) {
      const prompt = `${process.env.GENERATE_SECTIONS_PROMPT}${blogContent.content}`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{
          role: "system",
          content: `Instructions for dividing the blog into sections.`
        }, { role: "user", content: prompt }, {
          role: "assistant",
          content: `Divide the blog into sections.`
        }]
      });

      // Extract relevant information from OpenAI response
      const generateText = response.choices[0].message.content;

      const sectionsName = await extractSectionNames(generateText);

      if (sectionsName.error === true) {
        return { error: true, message: sectionsName.message };
      }

      const result = await saveBlogsContent(email, blogContent.url, requestId, blogContent.content, sectionsName.data);

      if (result.error === true) {
        return { error: true, message: result.message };
      }

      sectionsContentArray.push(generateText);
      blogs.push(result.data);
    }

    return { error: false, data: blogs, sectionsContent: sectionsContentArray };
  } catch (error) {
    console.log(error);

    return { error: true, message: "Error while generating sections." };
  }
}