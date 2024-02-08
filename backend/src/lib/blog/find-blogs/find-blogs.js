import { blog } from '../../../../db/model/index.js';

export async function findBlogs(email){

   try {
    const blogs = await blog.find({ email })

   return { error: false, data: blogs }
   } catch (error) {
    console.log(error)
    return { error: true, message: 'Server error' }
   }
}