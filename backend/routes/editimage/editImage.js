import axios from 'axios';
import OpenAI from 'openai';
import fs from "fs";

export const editImage = async (req, res) => {

    const openai = new OpenAI();

console.log(req.body.prompt)
    try {
        const response = await openai.images.edit({
            image: fs.createReadStream(``),
            prompt: "change the red colour to teal",
          });
        
        res.status(200).send(response)
    } catch (error) {
       console.log(error)
       
       res.status(500).send(error.message)
    }
}