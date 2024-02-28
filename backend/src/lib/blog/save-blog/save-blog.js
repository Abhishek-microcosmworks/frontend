import { blog } from '../../../../db/model/index.js';

export async function saveBlog(email, title, blogData, requestId) {
 try {
  const previousBlogs = await blog.find({ requestId });

//   if (previousBlogs.length > 0) {
//     await Promise.all(previousBlogs.map(async (prevBlog) => {
//       prevBlog.isLatest = false;
//       await prevBlog.save();
//     }));
//   }

  const blog_data = await blog.create({
   email: email,
   title: title,
   finalContent: blogData,
   requestId: requestId,
   isLatest: true, 
  });

  return { error: false, data: blog_data };
 } catch (error) {
  console.log(error.message);
  return { error: true, message: error.message };
 }
}