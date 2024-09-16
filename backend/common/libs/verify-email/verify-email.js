import { getUserByEmail } from "../find-user/index.js";

export const verifyEmail = async (email, name) => {
  try {
    const user = await getUserByEmail(email);

    if (user === null) {
      return { error: true, message: "Email or Name is incorrect!" };
    } else {
      return { error: false, user, message: "Email already exist!" };
    }
  } catch (error) {
    console.error("Error:", error);
    return {
      error: true,
      message: "Error while verifying email. Please Try Again.",
    };
  }
};
