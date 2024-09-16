import { addFeedback } from "../../src/lib/index.js";

export async function addBlogFeedback(req, res) {
  const email = req.body.email;
  const blogId = req.body.blogId;
  const feedbacktext = req.body.feedbackText;

  try {
    const feedbackObject = await addFeedback(email, blogId, feedbacktext);

    return res.status(200).json({ error: false, feedbackObject });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: true, message: error.message });
  }
}
