import axios from "axios";
import cheerio from "cheerio";

export async function getBlogData(blog, email, requestId) {
  try {
    const blogsData = [];

    for (let i = 0; i < blog.length; i++) {
      const url = blog[i];
      const response = await axios.get(url);
      const data = response.data;
      const $ = cheerio.load(data);
      let wordCount = 0;
      const blogObject = { url, content: "" };

      $("body").find("p").each((_, element) => {
        const content = $(element).text();
        const words = content.split(" ");

        if (wordCount + words.length <= 800) {
          blogObject.content += content + " ";
          wordCount += words.length;
        } else {
          return false;
        }
      });
      blogsData.push(blogObject);
    }
    return { error: false, data: blogsData };
  } catch (error) {
    console.error("Error fetching blog data:", error);
    return { error: true, message: error.message };
  }
}