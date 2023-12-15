import OpenAI from 'openai';

export const generateEmbeddings = async (req, res) => {

  const openai = new OpenAI();
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'system',
        content: `Please create a context using the blog keep it simple and precise not more then 20 words please make it a meaning full sentence for an ai image generation ${req.body.blogContent}`
      }]
    });

    res.status(200).send(response);
  } catch (error) {
    console.log(error);

    res.status(500).send(error.message);
  }
};