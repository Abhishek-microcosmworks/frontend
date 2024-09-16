import { blogSchema } from "../../../../db/model/index.js";

export async function findBlogById(blogId) {
  try {
    const blog = await blogSchema.findById(blogId);

    return { error: false, data: blog };
  } catch (error) {
    console.log(error);
    return { error: true, message: error.message };
  }
}
