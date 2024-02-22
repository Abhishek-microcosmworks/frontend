import Openai from 'openai';

export async function generateEmbeddings(content) {

  try {
    // Use the same OpenAI model to embed the text into a vector
    const openai = new Openai();
    let embeddings = [];

    // Split the content string into an array of sections using newline character as delimiter
    // const sections = content.split('\n');

    for (const section of content) {

      console.log('sections====', section.sections);

      const response = await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: section.sections
      });
      embeddings.push(response.data[0].embedding);
    }

    return { error: false, data: embeddings };
  } catch (error) {
    console.log(error);
    return { error: true, message: 'Error happened while generating embeddings' };
  }
}