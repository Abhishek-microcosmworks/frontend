import { Pinecone } from '@pinecone-database/pinecone'

export async function searchById(id){
    try {
        const client = new Pinecone({
            apiKey: `${process.env.PINECONE_API_KEY}`,
          });
        
          const pinecoe_index = client.index(indexName);
        
        const fetchResult = await pinecoe_index.fetch(['id-1', 'id-2']);

        return { error: false, data: fetchResult }
    } catch (error) {
        console.log('Error',error)
        return { error: true, message: error.message }
    }
}