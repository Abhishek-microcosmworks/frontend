import { blogsContent } from '../../../../db/model/index.js';

export async function saveBlogsContent(email, url, requestId, content, sections){

    try {
        const blog_content_data = await blogsContent.create({
            email: email,
            blogUrl: url,
            requestId: requestId,
            blogContent: content,
            sections: sections
        })

        return { error: false, data: blog_content_data };
    } catch (error) {
        console.log(error.message);
        return { error: true, message: error.message };
    }
}