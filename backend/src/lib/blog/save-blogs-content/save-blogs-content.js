import { blogsContent } from '../../../../db/model/index.js';

export async function saveBlogsContent(email, requestId, content){

    try {
        const blog_content_data = await blogsContent.create({
            email: email,
            requestId: requestId,
            blogContent: content.join('\n') 
        })

        return { error: false, data: blog_content_data };
    } catch (error) {
        console.log(error.message);
        return { error: true, message: error.message };
    }
}