import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import sbd from "sbd";

export const updatePinecone = async (
  client,
  indexName,
  blogsSection,
  email,
  requestId
) => {
  try {
    for (const blog of blogsSection) {
      // 1. Retrieve Pinecone index
      const index = client.Index(indexName);

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

      // 6. Create and upsert vectors in batches of 100
      const batchSize = 100;
      let batch = [];

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];

        // Store vector data without requestId
        // const vector = {
        //   id: `document_${Date.now()}_${i}`,
        //   values: embeddingsArrays[i],
        //   metadata: {
        //     ...chunk.metadata,
        //     loc: JSON.stringify(chunk.metadata.loc),
        //     pageContent: chunk.pageContent,
        //     txtPath: `document_${Date.now()}_${i}`,
        //   },
        // };

        const vector = {
          id: `${email}_document_${Date.now()}_${i}`,
          values: embeddingsArrays[i],
          metadata: Object.assign(
            {},
            chunk.metadata,
            { loc: JSON.stringify(chunk.metadata.loc) },
            { pageContent: chunk.pageContent },
            { txtPath: `${email}_document_${Date.now()}_${i}` },
            { requestId: requestId },
            { email: email }
          ),
        };

        batch = [...batch, vector];

        // When batch is full or it's the last item, upsert the vectors
        if (batch.length === batchSize || i === chunks.length - 1) {
          await index.upsert(batch);

          // Empty the batch
          batch = [];
        }
      }

      // 7. Log the number of vectors updated
      console.log(
        `Pinecone index updated with ${
          chunks.length
        } vectors for document ${101}`
      );
      return { error: false, message: "The date has been added in the index" };
    }
  } catch (error) {
    console.log("update pinecone index:", error);

    return { error: true, message: "Error while updating the data in index." };
  }
};
