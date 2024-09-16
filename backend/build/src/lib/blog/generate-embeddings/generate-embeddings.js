import Openai from "openai";

export async function generateEmbeddings(content) {
  try {
    const openai = new Openai();
    let embeddings = [];

    for (const section of content) {
      const response = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: section.sections
      });
      embeddings.push(response.data[0].embedding);
    }

    return { error: false, data: embeddings };
  } catch (error) {
    console.log(error);
    return {
      error: true,
      message: "Error happened while generating embeddings"
    };
  }
}