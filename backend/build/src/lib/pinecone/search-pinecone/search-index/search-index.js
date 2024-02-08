import { Pinecone } from '@pinecone-database/pinecone';

export async function searchIndex(queryEmbedding, indexName) {

  const client = new Pinecone({
    apiKey: `${process.env.PINECONE_API_KEY}`
  });

  //const introVector = await embedText(query);
  const pinecoe_index = client.index(indexName);

  // Search for nearest neighbors in Pinecone
  const searchResult = await pinecoe_index.query({ vector: [], topK: 5, includeValues: true, includeMetadata: true });

  // Filter out matches that contain "introduction" or "conclusion" in pageContent
  const filteredMatches = searchResult.matches.filter(match => {
    const pageContent = match.metadata.pageContent.toLowerCase();
    return !pageContent.includes('introduction') && !pageContent.includes('conclusion');
  });

  // Extract pageContent from each filtered match and concatenate them into a single string
  const pageContents = filteredMatches.map(match => match.metadata.pageContent);
  const concatenatedPageContent = pageContents.join('\n');

  console.log('main-parts==========', concatenatedPageContent);

  // Return the concatenated page content
  return concatenatedPageContent;
}