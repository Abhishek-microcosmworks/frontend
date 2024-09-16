import { blogSchema } from "../../../../db/model/index.js";

export async function saveBlog(email, blogData, requestId) {
  try {
    const previousBlogs = await blogSchema.find({ requestId });

    //const titleMatch = blogData.match(/\*\*Title:\s*(.+)\*\*/);
    //const title = titleMatch ? titleMatch[1].trim() : "Untitled";


    const extractTitle = data => {
      // Case 1: Extract title in bold or markdown-like format (**Title: ...**)
      let titleMatch = data.match(/\*\*Title:\s*(.+?)\*\*/);

      // Case 2: Extract title with no special formatting (Title: ...)
      if (!titleMatch) {
        titleMatch = data.match(/^Title:\s*(.*)$/m);
      }

      // Return extracted title or fallback to "Untitled"
      return titleMatch ? titleMatch[1].trim() : "Untitled";
    };

    const title = extractTitle(blogData);

    //   if (previousBlogs.length > 0) {
    //     await Promise.all(previousBlogs.map(async (prevBlog) => {
    //       prevBlog.isLatest = false;
    //       await prevBlog.save();
    //     }));
    //   }

    const blog_data = await blogSchema.create({
      email: email,
      title: title,
      finalContent: blogData,
      requestId: requestId,
      isLatest: true
    });

    return { error: false, data: blog_data };
  } catch (error) {
    console.log(error.message);
    return { error: true, message: error.message };
  }
}