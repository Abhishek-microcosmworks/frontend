import { OpenAIEmbeddingFunction } from 'chromadb'
import { ChromaClient } from "chromadb";
const client = new ChromaClient({ path: "http://localhost:8000" });

const embedder = new OpenAIEmbeddingFunction({
  openai_api_key: process.env.OPENAI_API_KEY,
});

export async function connectDb(){
  try {
    const collection = await client.getCollection({
      name: "test_vectorDb",
      embeddingFunction: embedder,
    })
  //   const collection = await client.createCollection({
  //     name: "test_vectorDb",
  //     embeddingFunction: embedder,
  // });

  return collection 
  } catch (error) {
    console.log('error in trycatch=====',error)
    // if (error.message.includes("already exists")) {
    //         // Handle the case where the collection already exists
    //         console.log("Collection 'test_vectorDb' already exists.");
    //         // You might return the existing collection or take appropriate action.
    //     } else {
    //         // Handle other errors
    //         console.error("Error creating collection:", error);
    //     }
  }
}