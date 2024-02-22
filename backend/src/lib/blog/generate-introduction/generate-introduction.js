import OpenAI from 'openai'

export async function generateIntroduction(content) {
    const openai = new OpenAI();
  
    console.log('content====', content)
  
    try {
  
      // // Combine array elements into a single string
      // const combinedContent = content.join('\n\n');
  
      // console.log('Combined Content:', combinedContent);
  
      // Add user and assistant messages
      const prompt = `Combine content:${content} create a new introduction for a blog strictly create a introduction part for the blog nothing else nothing else. Also keep the writing style as the content provided.`
  
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `Combine all the data and make a new introduction for the blog only introduction nothing else`,
          },
          { role: 'user', content: prompt },
          {
            role: 'assistant',
            content: `Divide the blog into sections.`,
          },
        ],
      });
      // Extract the generated introduction from the response
      const newIntroduction = response.choices[0].message.content;
  
      return { error: false, data: newIntroduction };
  
      //return generatedIntroduction;
    } catch (error) {
      // Handle any errors that may occur during the API call
      console.error('Error generating introduction:', error);
      return { error: true, message: 'Errro while genertaing introduction.' }
    }
  }