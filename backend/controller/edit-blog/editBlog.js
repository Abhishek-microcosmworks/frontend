import { updatedBlog } from '../../src/lib/index.js';

export const editBlog = async (req, res) => {
  const context = req.body.context;
  const id = req.body.id;
  const email = req.body.email;
  const blogContent = req.body.blogContent;

  try {
    const blogData = await updatedBlog(
      email,
      context,
      blogContent,
      id,
    );

   if(blogData.error === true){
    res.status(500).json({ error: true, message: blogData.message});
   }
    
   res.status(200).json({ error: false, data: blogData.data })

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
};


