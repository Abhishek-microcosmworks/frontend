import Openai from 'openai';

export async function generateEmbeddings(content) {

  try {
    // Use the same OpenAI model to embed the text into a vector
    const openai = new Openai();

    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: content
    });

    return { error: false, data: response.data[0].embedding };
  } catch (error) {
    console.log(error);
    return { error: true, message: 'Error happened while generating embeddings' };
  }
}