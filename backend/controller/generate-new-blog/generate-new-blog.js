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

  // const blog_array = urls.split(',')

  const blog_data = await getBlogData(urls, email, requestId)

  //await generateContext(blog_data);

  if(blog_data.error === true){
    res.status(500).json({ message: 'Error in extracting the data from the url.' })
    return
  }

  const client = new Pinecone({
    apiKey: `${process.env.PINECONE_API_KEY}`,
  });

  const vectorDimensions = 1536;

  const indexName = 'blog-index';

  //create index in pinecone
  const indexCreated = await createPineconeIndex(client, indexName, vectorDimensions)

  if(indexCreated.error === true){
    res.status(500).json({ message: 'Error while creating an index.' })
    return
  }

  const blogsContent = await generateSections(blog_data.data, email, requestId);

      if(blogsContent.error === true){
        return { error: true, message: blogsContent.message }
      }

  const updatedIndex = await updatePinecone(client, indexName, blogsContent.sectionsContent, email, requestId)

  if(updatedIndex.error === true){
    res.status(500).json({ message: updatedIndex.message })
    return
  }

  const introductionQuery = 'Introduction';
  
  const embeddings = await generateEmbeddings(blogsContent.data, indexName, email, requestId)

  if(embeddings.error === true){
    res.status(500).json({ message: embeddings.message })
    return
  }

  const searchedData = await searchQuery(embeddings.data, indexName, requestId);

  if(searchedData.error === true){
    res.status(500).json({ message: searchedData.message })
    return
  }

  // const newIntroduction = await generateIntroduction(introductionSearchedData.data);

  // if(newIntroduction.error === true){
  //   res.status(500).json({ message: newIntroduction.message })
  //   return
  // }

  // const conclusionQuery = 'Conclusion';

  // const conclusionQueryEmbedding = await generateEmbeddings(conclusionQuery)

  // if(conclusionQueryEmbedding.error === true){
  //   res.status(500).json({ message: introductionQueryEmbedding.message })
  //   return
  // }

  // const conclusionSearchedData = await searchQuery(conclusionQueryEmbedding.data, indexName);

  // if(conclusionSearchedData.error === true){
  //   res.status(500).json({ message: introductionSearchedData.message })
  //   return
  // }

  // const newConclusion = await generateConclusion(conclusionSearchedData.data);

  // if(newConclusion.error === true){
  //   res.status(500).json({ message: newConclusion.message })
  //   return
  // }
  
  // const newBlog = await generateNewBlog(newIntroduction.data, newConclusion.data)
  const newBlog = await generateNewBlog(searchedData.data)

  if(newBlog.error === true){
    res.status(500).json({ message: newBlog.message })
    return
  }

  const generatedBlog = await saveBlog(email, context, newBlog.data, requestId);
  
  if(generatedBlog.error === true){
    res.status(500).json({ message: generatedBlog.message })
    return
  }

   console.log('Blog is created.')
   res.status(200).json({ data: generatedBlog.data })
}
