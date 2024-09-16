import { blogSchema } from '../../../db/model/index.js';

export async function findBlog(id){
    try {
        const blogData = await blogSchema.findById(id);

        if(blogData){
            return { error: false, data: blogData }
        }

        return { error: false, message: 'Blog not found!' }
    } catch (error) {
        return { error: true, message: 'Error while searching for the blog' }
    }
}