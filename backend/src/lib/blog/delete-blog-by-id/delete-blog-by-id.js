import { findBlog } from '../../../../common/index.js';

export async function deleteBlogById (id)
{
  try
  {
    const prevBlog = await findBlog(id);
      if (prevBlog.error === false && prevBlog.message === 'Blog not found!')
      {
        return { error: true, message: prevBlog.message };
      }

      if(prevBlog.error === true){
        return { error: true, message: prevBlog.message }
      }
  
    prevBlog.data.isDeleted = true;

    await prevBlog.data.save();
  
      return { error: false, message: 'Blog deleted successfully!'}
    } catch (error) {
      console.error('Error showing blog:', error);

      return { error: true, message: error.message }
    }
  }