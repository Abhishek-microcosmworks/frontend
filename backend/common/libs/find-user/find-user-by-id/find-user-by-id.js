import { userSchema } from "../../../../db/model/index.js";

export async function getUserById(id) {
  try {
    const user = await userSchema.findById(id);

    return user;
  } catch (error) {
    console.log(error.message);

    return error;
  }
}
