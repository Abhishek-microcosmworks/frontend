import { otpSchema } from '../../../db/model/index.js';

export async function findOtp(email, otp) {

  const otpConfirmation = await otpSchema.findOne({
    email,
    otp,
    isDeleted: { $ne: true }
  });

  if (!otpConfirmation || otpConfirmation === null) {
    return { error: true, message: "Invalid otp. Please check your OTP" };
  } else {
    return { error: false, data: otpConfirmation };
  }
}