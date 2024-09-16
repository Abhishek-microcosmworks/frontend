import { calculateEmbeddingDistance } from "../embedding-distance/index.js";

// Function to find the most similar text in the dataset
export function findMostSimilarText(inputEmbedding, dataset) {
  let minDistance = Number.MAX_VALUE;
  let mostSimilarText = null;

  for (const dataEntry of dataset) {
    const distance = calculateEmbeddingDistance(
      inputEmbedding,
      dataEntry.embedding
    );

    if (distance < minDistance) {
      minDistance = distance;
      mostSimilarText = dataEntry;
    }
  }

  return mostSimilarText;
}
