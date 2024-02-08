import OpenAI from 'openai';

export async function generateSections(content) {

  const sectionNames = [];

  try {
    const openai = new OpenAI();

    const generatedTextArray = []; // to store generated text for each section

    for (const sectionData of content.data) {

      console.log('content=====', sectionData);

      //const section = sectionData.content.join('\n');

      const section = sectionData.blogContent;

      const prompt = `Given the following blog content, please divide it into sections \n\n${section}\n\n`;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{
          role: 'system',
          content: `Instructions for dividing the blog into sections.`
        }, { role: 'user', content: prompt }, {
          role: 'assistant',
          content: `Divide the blog into sections.`
        }]
      });

      // Extract relevant information from OpenAI response
      const generateText = response.choices[0].message.content;

      // Store the generated text for each section
      generatedTextArray.push(generateText);
      // Extract and store the section name
      const sectionNameRegex = /Section (\d+): ([^\n]+)/g;
      let match;
      while ((match = sectionNameRegex.exec(generateText)) !== null) {
        const sectionName = match[2];
        sectionNames.push(sectionName);
      }
    }

    return { error: false, data: generatedTextArray };
  } catch (error) {
    console.log(error);

    return { error: true, message: 'Error while generating sections.' };
  }
}