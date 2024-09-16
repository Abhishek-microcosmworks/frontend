import { userSchema } from "../../../../db/model/index.js";

export async function saveUser(name, email) {
  try {
    const data = {
      name: name,
      email: email,
      isDeleted: false,
    };
    const userData = await userSchema.create(data);

    return { error: false, data: userData };
  } catch (error) {
    console.error("Error showing login:", error);
    return { error: true, message: error.message };
  }
}
