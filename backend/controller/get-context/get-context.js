import { generateContext } from '../../src/lib/index.js';

export const getContext = async (req, res) => {

    try {

      console.log(req.body.blogContent);
      // const res = await generateContext(req.body.blogContent)

      // console.log('content========',res) 
    } catch (error) {
      res.status(500).json({ error: true, message: error.message })
    }
}