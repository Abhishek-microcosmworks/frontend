import OpenAI from 'openai';
import { extractSectionNames } from '../extract-sections-name/index.js';
import { blogsContent } from '../../../../db/model/index.js';
import { saveBlogsContent } from '../save-blogs-content/index.js';

export async function generateSections(content, email, requestId) {

  const blogs = [];
  const sectionsContentArray = []; // to store generated text for each section

  try {
    const openai = new OpenAI();

    for (const blogContent of content) {

      //const section = sectionData.content.join('\n');

      //const scrappedContent = blogData.blogContent;

      const prompt = `Given the following blog content, please divide it into sections, labeling each section with a title in the format "Section 1: Title" and content = ${blogContent.content}`;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `Instructions for dividing the blog into sections.`,
          },
          { role: 'user', content: prompt },
          {
            role: 'assistant',
            content: `Divide the blog into sections.`,
          },
        ],
      });


    // Extract relevant information from OpenAI response
    const generateText = response.choices[0].message.content;
    
    const sectionsName = await extractSectionNames(generateText);

    if(sectionsName.error === true){
      return { error: true, message: sectionsName.message }
    }

    const result = await saveBlogsContent(email, blogContent.url, requestId, blogContent.content, sectionsName.data)

    if(result.error === true){
      return { error: true, message: result.message }
    }

    sectionsContentArray.push(generateText)
    blogs.push(result.data)
    
    // // Store the generated text for each section
    // generatedTextArray.push(generateText);
    // blogs.push(result)
  }

  return { error: false, data: blogs, sectionsContent: sectionsContentArray }
  }catch(error){
    console.log(error)

    return { error: true, message: 'Error while generating sections.' }
  }
}