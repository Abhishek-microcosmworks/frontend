import { blog } from '../../../../db/model/index.js';

export async function saveBlog(email, title, blogData) {

    try {
        const blog_data = await blog.create({
            email: email,
            title: title,
            finalContent: blogData
        });

        return { error: false, data: blog_data };
    } catch (error) {
        console.log(error.message);
        return { error: true, message: error.message };
    }
}