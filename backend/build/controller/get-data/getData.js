import OpenAI from 'openai';

import { connectDb } from '../../db/chromadb-connection/index.js';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Function to retrieve embeddings from ChromaDB
async function getEmbeddingsFromDB(key) {
  try {

    const textResponse = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: `Gain practical insights from successful fund stories.`
    });

    const textEmbedding = textResponse.data[0].embedding;

    const db = await connectDb();

    // const items = await db.peek()

    // console.log('items==========', items);

    // const response = await db.add({
    //   ids: ["id5"],
    //   embeddings: textEmbedding,
    //   //metadatas: [{ "category": "vehicle" }],
    //   documents: ["Learn from real-world examples and success stories of individuals or organizations that have effectively utilized funds to achieve their financial objectives. These case studies will provide practical insights into the application of fund investment strategies, showcasing the diversity of approaches and the positive outcomes that can be achieved through thoughtful and strategic fund management."],
    // });
    const results = await db.query({
      queryEmbeddings: textEmbedding,
      nResults: 1
    });

    // const results = await db.delete({
    //   ids: ['id1']
    // })

    console.log('result============', results);

    return response;
  } catch (error) {
    console.error('Error retrieving embeddings from ChromaDB:', error.message);
    throw error;
  }
}

// Example usage in your main function
export async function getPersonalisedBlog(req, res) {
  try {

    const res = await getEmbeddingsFromDB('id2');

    res.status(200).json({ res });
  } catch (error) {
    console.error('Error in the main function:', error.message);
    res.status(500).json({ error: error.message });
  }
}