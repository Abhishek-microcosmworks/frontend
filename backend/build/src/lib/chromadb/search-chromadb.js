import { ChromaClient, OpenAIEmbeddingFunction } from "chromadb";

const client = new ChromaClient({ path: "http://localhost:8000" });

const embedder = new OpenAIEmbeddingFunction({
  openai_api_key: process.env.OPENAI_API_KEY
});

export async function searchQuery(embeddings, collection, requestId) {
  try {
    let concatenatedPageContent = "";

    const collection = await client.getOrCreateCollection({
      name: "personalised_vectorDb",
      embeddingFunction: embedder
    });

    const collectionName = "personalised_vectorDb";

    for (const embedding of embeddings) {
      const searchResult = await collection.query({
        collectionName,
        queryEmbeddings: [embedding],
        where: {
          requestId: requestId
        }
      });

      searchResult.metadatas.forEach(metadataArray => {
        metadataArray.forEach(metadata => {
          if (metadata.pageContent) {
            concatenatedPageContent += metadata.pageContent + "\n";
          }
        });
      });
    }

    return { error: false, data: concatenatedPageContent.trim() };
  } catch (error) {
    console.log(error);
    return { error: true, message: "Error occurred while searching vector." };
  }
}