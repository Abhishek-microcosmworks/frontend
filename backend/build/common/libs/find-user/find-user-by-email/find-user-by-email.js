import { userSchema } from "../../../../db/model/index.js";

export async function getUserByEmail(email) {
  try {
    const user = await userSchema.findOne({ email: email });

    return user;
  } catch (error) {
    console.log(error.message);

    return error;
  }
}