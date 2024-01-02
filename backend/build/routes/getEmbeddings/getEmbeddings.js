import OpenAI from 'openai';

import { connectDb } from '../../db/chromadb-connection/index.js';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Function to generate text embeddings and save them to ChromaDB
async function generateAndSaveTextEmbeddings(text, key) {

  console.log('text========', text);

  try {
    const textResponse = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text
    });

    const textEmbedding = textResponse.data[0].embedding;

    console.log('embedding==========', textEmbedding);

    // Choose a target length for dimensionality reduction
    const targetLength = 100; // Adjust the desired length

    // Reduce the length of the embedding vector
    const reducedEmbedding = reduceDimensionality(textEmbedding, targetLength); // Adjust the desired length

    // Save the text embedding in ChromaDB
    await saveEmbeddingsToDB(key, reducedEmbedding, text);

    return textEmbedding;
  } catch (error) {
    console.error('Error generating or saving text embeddings:', error.message);
    throw error;
  }
}

// Function to save embeddings in ChromaDB
async function saveEmbeddingsToDB(key, embedding, text) {
  try {
    const db = await connectDb();
    const response = await db.add({
      ids: ["id2"],
      embeddings: embedding,
      metadatas: [{ source: "my_source" }],
      documents: [text]
    });
    console.log(`Embeddings saved successfully for key: ${response}`);
  } catch (error) {
    console.error(`Error saving embeddings for key ${key}: ${error.message}`);
    throw error;
  }
}

// Function to retrieve embeddings from ChromaDB
async function getEmbeddingsFromDB(key) {
  try {
    const db = await connectDb();
    const result = await db.query({
      queryEmbeddings: [[11.1, 12.1, 13.1]],
      nResults: 10
    });

    console.log('result============', result);
  } catch (error) {
    console.error('Error retrieving embeddings from ChromaDB:', error.message);
    throw error;
  }
}

// Function to generate a blog with a similar writing style based on a given text embedding
async function generateSimilarBlog(textEmbedding) {
  try {
    // You can customize the content generation based on your needs
    const blogResponse = await openai.completions.create({
      model: 'text-davinci-002',
      prompt: `Generate a blog with a similar writing style as the provided text embedding: ${textEmbedding}`,
      temperature: 0.7
    });

    const generatedBlog = blogResponse.data.choices[0].text;
    console.log('Generated Blog:', generatedBlog);

    return generatedBlog;
  } catch (error) {
    console.error('Error generating a similar blog:', error.message);
    throw error;
  }
}

// Function to apply simple dimensionality reduction
function reduceDimensionality(embedding, targetLength) {
  // Take the first `targetLength` elements of the embedding vector
  return embedding.slice(0, targetLength);
}

// Example usage in your main function
export async function getPersonalisedBlog(req, res) {
  try {
    // Assuming you have the text to generate embeddings and the key for ChromaDB in req.body
    // const { text, key } = req.body;
    const text = 'h';
    const key = 102;

    // Generate and save text embeddings
    const generatedTextEmbedding = await generateAndSaveTextEmbeddings(text, key);

    // Generate a blog with a similar writing style using the generated text embedding
    const similarBlogGenerated = await generateSimilarBlog(generatedTextEmbedding);

    // Return the generated blogs or do further processing
    res.status(200).json({ similarBlogGenerated, similarBlogRetrieved });
  } catch (error) {
    console.error('Error in the main function:', error.message);
    res.status(500).json({ error: error.message });
  }
}