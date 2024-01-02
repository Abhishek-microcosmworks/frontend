// Function to calculate the distance between two embeddings
export function calculateEmbeddingDistance(embedding1, embedding2) {
    // Replace this with an appropriate distance metric based on your requirements
    // For example, you can use Euclidean distance or cosine similarity
    // Here, I'm using Euclidean distance as a simple example
    return Math.sqrt(embedding1.reduce((sum, val, index) => sum + Math.pow(val - embedding2[index], 2), 0));
}