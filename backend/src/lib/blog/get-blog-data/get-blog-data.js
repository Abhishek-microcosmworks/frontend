import axios from 'axios';
import cheerio from 'cheerio';
import { saveBlogsContent } from '../save-blogs-content/index.js';

export async function getBlogData(blog, email, requestId) {
    try {
      const responses = await Promise.all(blog.map((url) => axios.get(url)));
      const blogContent = [];
  
      for (const response of responses) {
        const data = response.data;
        const $ = cheerio.load(data);
        let wordCount = 0;
        const blogObject = { content: [] };
  
        $('body').find('p').each((_, element) => {
          const content = $(element).text();
          const words = content.split(' ');
  
          if (wordCount + words.length <= 800) {
            blogObject.content.push(content);
            wordCount += words.length;
          } else {
            return false;
          }
        });
  
        
        const blogsContent = await saveBlogsContent(email, requestId, blogObject.content)
        
        if(blogsContent.error === true){
          return {error: true, message: blogsContent.message}
        }
        blogContent.push(blogsContent.data);
      }
      return { error: false, data: blogContent };
    } catch (error) {
      console.error('Error fetching blog data:', error);
      return { error: true, message: error.message }
    }
  }