import Openai from "openai";
import dotenv from "dotenv";

dotenv.config();

export async function generateNewBlog(content) {
  const openai = new Openai();
  try {
    //const prompt = `Please read and integrate the following content:\n"${content}"\n\nThen, craft a coherent, engaging, and original blog post that is free of plagiarism. Ensure that the blog is well-structured and flows naturally, maintaining a captivating and informative tone throughout.`;

    const prompt = `${process.env.GENERATE_BLOG_PROMPT}${content}`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "system",
        content: "You are an assistant that helps create original, engaging, and high-quality blog content and blog title."
      }, {
        role: "user",
        content: prompt
      }]
    });

    const newBlog = response.choices[0].message.content;

    return { error: false, data: newBlog };
  } catch (error) {
    console.error("Error generating new blog:", error);
    return { error: true, message: "Error while generating the new blog." };
  }
}