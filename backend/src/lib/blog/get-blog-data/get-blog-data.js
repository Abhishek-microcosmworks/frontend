// import axios from 'axios';
// import cheerio from 'cheerio';
// import { saveBlogsContent } from '../save-blogs-content/index.js';

// export async function getBlogData(blog, email, requestId) {
//     try {
//       const responses = await Promise.all(blog.map((url) => axios.get(url)));
//       const blogContent = [];
  
//       for (const response of responses) {
//         const data = response.data;
//         const $ = cheerio.load(data);
//         let wordCount = 0;
//         const blogObject = { content: [] };
  
//         $('body').find('p').each((_, element) => {
//           const content = $(element).text();
//           const words = content.split(' ');
  
//           if (wordCount + words.length <= 800) {
//             blogObject.content.push(content);
//             wordCount += words.length;
//           } else {
//             return false;
//           }
//         });
  
        
//         const blogsContent = await saveBlogsContent(email, requestId, blogObject.content)
        
//         if(blogsContent.error === true){
//           return {error: true, message: blogsContent.message}
//         }
//         blogContent.push(blogsContent.data);
//       }
//       return { error: false, data: blogContent };
//     } catch (error) {
//       console.error('Error fetching blog data:', error);
//       return { error: true, message: error.message }
//     }
//   }














import axios from 'axios';
import cheerio from 'cheerio';
import { saveBlogsContent } from '../save-blogs-content/index.js';
import { generateSections } from '../generate-sections/index.js';
import { extractSectionNames } from '../extract-sections-name/index.js';

export async function getBlogData(blog, email, requestId) {
  try {
    const blogsData = [];

    for (let i = 0; i < blog.length; i++) {
      const url = blog[i];
      const response = await axios.get(url);
      const data = response.data;
      const $ = cheerio.load(data);
      let wordCount = 0;
      const blogObject = { url, content: '' };

$('body').find('p').each((_, element) => {
  const content = $(element).text();
  const words = content.split(' ');

  if (wordCount + words.length <= 800) {
    blogObject.content += content + ' '; // Proper concatenation
    wordCount += words.length;
  } else {
    return false;
  }
});

    // const blogsContent = await generateSections(blogObject.content, email, requestId, blogObject.url);

    //   if(blogsContent.error === true){
    //     return { error: true, message: blogsContent.message }
    //   }

      blogsData.push(blogObject);

      // const sectionNames = await extractSectionNames(blogsSection.data);

      // if(blogsSection.error === true){
      //   return { error: true, message: blogsSection.message }
      // }

    //   const savedBlogs = await saveBlogsContent(email, blogObject.url, requestId, blogObject.content);

    //   if (savedBlogs.error === true) {
    //     return { error: true, message: savedBlogs.message };
    //   }
    //   blogContent.push(savedBlogs.data);
     }
    return { error: false, data: blogsData };
  } catch (error) {
    console.error('Error fetching blog data:', error);
    return { error: true, message: error.message };
  }
}