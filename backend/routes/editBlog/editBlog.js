import 'dotenv/config';
import { blog } from '../../db/model/index.js';

export const editBlog = async (req, res) => {
  const context = req.body.context;
  const id = req.body.id;
  const email = req.body.email;
  const blogContent = req.body.blogContent;

  try {
    const blogData = await generateBlog(
      email,
      context,
      blogContent,
      id,
    );

    res.status(200).json({
      error: false,
      data: { blogData },
    });
  } catch (error) {
    res.status(500).json({ error: true, message: 'Internal Server Error' });
    console.error(error);
  }
};

async function generateBlog(email, context, responsefinalContent, id) {
  try {

    console.log(id);
    const prevBlog = await blog.findById(id);

    // Check if the blog exists
    if (!prevBlog) {
      console.error('Blog not found');
      return null;
    }

    // Update the values of isActive and isDeleted
    prevBlog.isActive = true;
    prevBlog.isDeleted = true;

    // Save the changes to the existing blog
    await prevBlog.save();

    // Create a new blog entry with the updated values
    const editedBlog = new blog({
      email: email,
      title: context,
      finalContent: responsefinalContent,
    });

    // Save the new blog entry
    const blogData = await editedBlog.save();
    console.log(blogData);
    return blogData;
  } catch (error) {
    console.error('Error showing blog:', error);
  }
}
