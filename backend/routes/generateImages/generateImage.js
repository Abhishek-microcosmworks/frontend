import axios from 'axios';
import OpenAI from 'openai';
import {uploadImage} from '../../src/lib/aws_upload/index.js';
import {image_db} from '../../db/model/index.js';
import { RegisterData } from '../../db/model/index.js';

export const generateImage = async (req, res) => {

    console.log(req.body.prompt);

    const openai = new OpenAI();
    try {
        const response = await openai.images.generate({
            model: 'dall-e-3',
            prompt: req.body.prompt,
            n : 1,
            size: '1024x1024'
        });

        console.log(response.data[0].url)
        const image_url = await uploadImage(response.data[0].url)

        console.log(image_url);

        const db_data = await image_db.create({
            image_url: image_url,
            context: req.body.prompt
          });
        
          console.log(req.body.email);
        const user = await RegisterData.findOne({ email: req.body.email });
        console.log(user)

        if (user) {
            // Check if user.image_id is defined before using push
            if (user.image_id) {
                user.image_id.push(db_data._id);
            } else {
                // If image_id is not defined, create a new array with the _id
                user.image_id = [db_data._id];
            }
        
            // Save the updated user document
            await user.save();
        } else {
            console.log('User not found');
        }
        
        res.status(200).send(response)
    } catch (error) {
       console.log(error)
       
       res.status(500).send(error.message)
    }

}