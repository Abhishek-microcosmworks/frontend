import { verifyEmail } from "../../common/index.js";
import { findBlogs } from "../../src/lib/index.js";

export const getHistory = async (req, res) => {
  try {
    const { email } = req.body;

    const emailConfirmation = await verifyEmail(email);

    if (emailConfirmation.error === true) {
      return res.status(404).json({ message: emailConfirmation.message });
    }

    const blogs = await findBlogs(email);

    if (blogs.error === true) {
      return res.status(500).json({ message: blogs.message });
    }

    return res.status(200).json({ error: false, data: blogs.data });
  } catch (error) {
    console.error("Error in history:", error);
    res.status(500).json({ message: "Server Error" });
  }
};