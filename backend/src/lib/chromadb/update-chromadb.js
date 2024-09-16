import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import sbd from "sbd";
import { ChromaClient } from "chromadb";

export const updateChromaDB = async (
  client, 
  collectionName,
  blogsSection, 
  email, 
  requestId 
) => {
  try {
    //ChromaDB client instance
    const collection = await client;

    for (const blog of blogsSection) {
      // 2. Process each document in the scrappedContent
      const text = blog;

      // Use sbd library to split the text into sentences
      const sentences = sbd.sentences(text);

      // 3. Create RecursiveCharacterTextSplitter instance
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
      });

      // 4. Split text into chunks (documents)
      const chunks = await textSplitter.createDocuments(sentences);

      console.log(
        `Calling OpenAI's Embedding endpoint for documents with ${chunks.length} text chunks ...`
      );

      // 5. Create OpenAI embeddings for documents
      const embeddingsArrays = await new OpenAIEmbeddings().embedDocuments(
        chunks.map((chunk) => chunk.pageContent.replace(/\n/g, " "))
      );

      console.log("Finished embedding documents");
      console.log(
        `Creating ${chunks.length} vectors array with id, values, and metadata...`
      );

      // 6. Add vectors to ChromaDB
      const ids = [];
      const metadatas = [];
      const embeddings = [];

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const vectorId = `${email}_document_${Date.now()}_${i}`;
        
        ids.push(vectorId);
        embeddings.push(embeddingsArrays[i]);
        metadatas.push({ ...chunk.metadata,
          loc: JSON.stringify(chunk.metadata.loc),
          pageContent: chunk.pageContent,
          txtPath: vectorId,
          requestId: requestId,
          email: email,
        });
      }

      // 7. Upsert into Chroma collection
      await collection.add({
        ids,
        embeddings,
        metadatas,
      });

      console.log(
        `ChromaDB collection updated with ${chunks.length} vectors for document ${email}`
      );
      return { error: false, message: "The data has been added to ChromaDB." };
    }
  } catch (error) {
    console.log("Error updating ChromaDB index:", error);
    return { error: true, message: "Error while updating the data in ChromaDB." };
  }
};
