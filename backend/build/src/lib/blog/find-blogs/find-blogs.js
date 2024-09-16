import { blogSchema } from "../../../../db/model/index.js";

export async function findBlogs(email) {
  try {
    const blogs = await blogSchema.find({
      email,
      isDeleted: false
    });

    console.log(blogs);

    return { error: false, data: blogs };
  } catch (error) {
    console.log(error);
    return { error: true, message: "Server error" };
  }
}