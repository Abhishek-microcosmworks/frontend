export async function createPineconeIndex(client, indexName, vectorDimension) {

  try {
    // 1. Initiate index existence check
    // 2. Get list of existing indexes
    const existingIndexes = await client.listIndexes();

    const indexExists = existingIndexes.indexes.some(index => index.name === indexName);

    if (indexExists) {
      console.log('Index already exist:', indexName);
      return { error: false, message: 'Index already exist:', indexName };
    } else {
      // Do something, such as create the index
      await client.createIndex({
        name: indexName,
        dimension: vectorDimension,
        metric: 'cosine',
        spec: {
          serverless: {
            cloud: 'aws',
            region: 'us-west-2'
          }
        }
      });

      // 5. Wait for index initialization
      await new Promise(resolve => setTimeout(resolve, timeout));
      return { error: false, message: 'Index has been created!' };
    }
  } catch (error) {
    return { error: true, message: 'Error happned while creating an index.' };
  }
};