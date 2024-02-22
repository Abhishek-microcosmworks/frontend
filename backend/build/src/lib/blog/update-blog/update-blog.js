import { findBlog } from '../../../../common/index.js';

import { saveBlog } from '../save-blog/index.js';

export async function updatedBlog(email, context, responsefinalContent, id) {
    try {

        const prevBlog = await findBlog(id);

        if (prevBlog.error === false && prevBlog.message === 'Blog not found!') {
            return { error: false, message: prevBlog.message };
        }

        if (prevBlog.error === true) {
            return { error: true, message: prevBlog.message };
        }

        // Update the values of isActive and isDeleted
        prevBlog.isActive = true;
        prevBlog.isDeleted = true;

        // Save the changes to the existing blog
        await prevBlog.save();

        const updatedBlog = await saveBlog(email, context, responsefinalContent);

        if (updatedBlog.error === true) {
            return { error: true, message: updatedBlog.message };
        }

        return { error: false, data: updatedBlog };
    } catch (error) {
        console.error('Error showing blog:', error);

        return { error: true, message: error.message };
    }
}