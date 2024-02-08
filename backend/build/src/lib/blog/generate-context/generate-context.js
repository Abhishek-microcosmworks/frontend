import OpenAI from 'openai';

export async function generateContext(content) {

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
  const blog_context = [];

  try {

    for (const blogContent of content.data) {

      // const data = blogContent.content.join('\n');

      const data = blogContent.blogContent;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{
          role: 'system',
          // content: `Please create a context using the blog keep it simple and precise not more then 20 words please make it a meaning full sentence for an ai image generation ${content}`,
          content: `Please create a context using the blog content:${data}`
        }]
      });

      blog_context.push(response.choices[0].message.content);

      //return { error: true, data: response.choices[0].message }
    }
  } catch (error) {
    console.log(error);
    return { error: false, message: error.message };
  }
}