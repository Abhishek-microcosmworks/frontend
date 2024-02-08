import 'dotenv/config';
import { Pinecone } from '@pinecone-database/pinecone';
import { 
  getBlogData,
  createPineconeIndex,
  updatePinecone,
  generateSections,
  generateEmbeddings,
  searchQuery,
  generateIntroduction,
  generateConclusion,
  generateNewBlog,
  saveBlog,
  generateContext
} from '../../src/lib/index.js';

export const generateBlog = async (req, res) => {
  const context = req.body.context;
  const urls = req.body.urls || [];

  const email = req.body.email;

  const requestId = req.body.requestId;

  const blog_array = urls.split(',')

  const blog_data = await getBlogData(blog_array, email, requestId)

  await generateContext(blog_data);

  if(blog_data.error === true){
    res.status(500).json({ message: 'Error in extracting the data from the url.' })
    return
  }

  const client = new Pinecone({
    apiKey: `${process.env.PINECONE_API_KEY}`,
  });

  const vectorDimensions = 1536;

  const indexName = 'test-index';

  //create index in pinecone
  const indexCreated = await createPineconeIndex(client, indexName, vectorDimensions)

  if(indexCreated.error === true){
    res.status(500).json({ message: 'Error while creating an index.' })
    return
  }

  const blogSections = await generateSections(blog_data)

  if(blogSections.error === true){
    res.status(500).json({ message: blogSections.message })
    return
  }

  const updatedIndex = await updatePinecone(client, indexName, blogSections.data, email, requestId)

  if(updatedIndex.error === true){
    res.status(500).json({ message: updatedIndex.message })
    return
  }

  const introductionQuery = 'Introduction';
  
  const introductionQueryEmbedding = await generateEmbeddings(introductionQuery)

  if(introductionQueryEmbedding.error === true){
    res.status(500).json({ message: introductionQueryEmbedding.message })
    return
  }

  const introductionSearchedData = await searchQuery(introductionQueryEmbedding.data, indexName, requestId);

  if(introductionSearchedData.error === true){
    res.status(500).json({ message: introductionSearchedData.message })
    return
  }

  const newIntroduction = await generateIntroduction(introductionSearchedData.data);

  if(newIntroduction.error === true){
    res.status(500).json({ message: newIntroduction.message })
    return
  }

  const conclusionQuery = 'Conclusion';

  const conclusionQueryEmbedding = await generateEmbeddings(conclusionQuery)

  if(conclusionQueryEmbedding.error === true){
    res.status(500).json({ message: introductionQueryEmbedding.message })
    return
  }

  const conclusionSearchedData = await searchQuery(conclusionQueryEmbedding.data, indexName);

  if(conclusionSearchedData.error === true){
    res.status(500).json({ message: introductionSearchedData.message })
    return
  }

  const newConclusion = await generateConclusion(conclusionSearchedData.data);

  if(newConclusion.error === true){
    res.status(500).json({ message: newConclusion.message })
    return
  }
  
  const newBlog = await generateNewBlog(newIntroduction.data, newConclusion.data)

  if(newBlog.error === true){
    res.status(500).json({ message: newBlog.message })
    return
  }

  const generatedBlog = await saveBlog(email, context, newBlog.data);
  
  if(generatedBlog.error === true){
    res.status(500).json({ message: generatedBlog.message })
    return
  }

   res.status(200).json({ data: generatedBlog.data })
}
