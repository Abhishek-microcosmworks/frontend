import axios from 'axios';
import OpenAI from 'openai';

export const generateKeywords = async (req, res) => {
  const openai = new OpenAI();

  try {

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'system',
        content: req.body.blogContent
      }]
    });

    res.status(200).send(response);
  } catch (error) {
    console.log(error);

    res.status(500).send(error.message);
  }
};