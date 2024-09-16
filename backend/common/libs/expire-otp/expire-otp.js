import { otpSchema } from "../../../db/model/index.js";

export async function expireOtp(email) {
  try {
    const otpResponse = await otpSchema.updateMany(
      { email },
      { $set: { isDeleted: true } },
      { new: true }
    );

    return { error: false, message: "The otp has been expired!" };
  } catch (error) {
    return { error: true, message: error.message };
  }
}
