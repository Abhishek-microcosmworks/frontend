import axios from 'axios';
import OpenAI from 'openai';

export const generateImage = async (req, res) => {

    const openai = new OpenAI();

console.log(req.body.prompt)
    try {
        const response = await openai.images.generate({
            model: 'dall-e-3',
            prompt: req.body.prompt,
            n : 1,
            size: '1024x1024'
        })
        
        res.status(200).send(response)
    } catch (error) {
       console.log(error)
       
       res.status(500).send(error.message)
    }

}