import { feedbackSchema } from "../../../../db/model/index.js";

export async function addFeedback(email, blogId, feedbackText) {
  try {

    const newFeedback = {
      email,
      blogId,
      feedback_text: feedbackText
    };

    const feedbackObject = await feedbackSchema.create(newFeedback);

    return feedbackObject;
  } catch (error) {
    console.log(error.message);
  }
}