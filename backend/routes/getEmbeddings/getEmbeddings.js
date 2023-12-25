import OpenAI from 'openai';

const openai = new OpenAI();

// Function to get embeddings using OpenAI GPT-3.5
export async function generateEmbeddings(text) {
  try {

    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
    });

    console.log(response);
    const embeddings = response.choices[0].embedding; 

    return embeddings;

  } catch (error) {
    console.error('Error getting embeddings:', error.message);
    throw error;
  }
}