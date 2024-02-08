import { Pinecone } from '@pinecone-database/pinecone';

export async function searchQuery(queryEmbedding, indexName, requestId) {

  try {

    const client = new Pinecone({
      apiKey: `${process.env.PINECONE_API_KEY}`
    });

    //const introVector = await embedText(query);
    const pinecoe_index = client.index(indexName);

    // Search for nearest neighbors in Pinecone
    const searchResult = await pinecoe_index.query({
      vector: queryEmbedding,
      filter: {
        "requestId": { "$eq": requestId }
      },
      topK: 5,
      includeValues: true,
      includeMetadata: true
    });

    // Extract pageContent from each match and concatenate them into a single string
    const pageContents = searchResult.matches.map(match => match.metadata.pageContent);
    const concatenatedPageContent = pageContents.join('\n');

    return { error: false, data: concatenatedPageContent };
  } catch (error) {
    console.log(error);
    return { error: true, message: 'Error occured while searching vector.' };
  }
}