import Openai from 'openai';

export async function generateNewBlog(introduction) {
  const openai = new Openai();

  try {

    //const prompt = `Provided you with the introduction ${introduction} and conclusion ${conclusion}, combine them and create a new blog. Please keep the writing style same as the introduction and conclusion.`

    // const prompt = `Combine the provided introduction and conclusion to create a cohesive blog. Ensure that the writing style remains consistent throughout. Do not use separate sections; instead, structure the content into paragraphs without plagarism.`;
    const prompt = `Combine the provided content to create a cohesive blog. Ensure that the writing style remains consistent throughout. Do not use separate sections; instead, structure the content into paragraphs without plagarism.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'system',
        //content: `Combine all the data and make a new blog. Please don't create sections create it on paragraph based`,
        content: 'Generate a new blog by combining the content without plagarism.'
      }, { role: 'user', content: prompt }, {
        role: 'assistant',
        //content: `Divide the blog into sections.`,
        content: `Combine the content:\n"${introduction}"\n\nand create a coherent and engaging blog without plagarism.`
      }]
    });
    // Extract the generated introduction from the response
    const newBlog = response.choices[0].message.content;

    return { error: false, data: newBlog };

    //return generatedIntroduction;
  } catch (error) {
    // Handle any errors that may occur during the API call
    console.error('Error generating new blog:', error);

    return { error: true, message: 'Error while generating the new blog.' };
  }
}