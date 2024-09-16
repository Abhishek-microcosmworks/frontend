import { findBlogById } from "../../src/lib/index.js";

export const getBlogById = async (req, res) => {
  try {
    const { blogId } = req.body;

    const blog = await findBlogById(blogId);

    console.log('blog===', blog);

    if (blog.error === true) {
      return res.status(500).json({ message: blog.message });
    }

    return res.status(200).json({ error: false, data: blog.data });
  } catch (error) {
    console.error("Error in history:", error);
    res.status(500).json({ message: "Server Error" });
  }
};