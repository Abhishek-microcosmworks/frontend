export function calculateEmbeddingDistance(embedding1, embedding2) {
  return Math.sqrt(
    embedding1.reduce(
      (sum, val, index) => sum + Math.pow(val - embedding2[index], 2),
      0
    )
  );
}
