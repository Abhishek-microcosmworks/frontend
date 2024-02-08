import { otpGeneration } from '../../../db/model/index.js';

export async function expireOtp(email) {

  try {
    const otpResponse = await otpGeneration.updateMany({ email }, { isDeleted: true }, { new: true });

    console.log('otp-response=====', otpResponse);

    return { error: false, message: 'The otp has been expired!' };
  } catch (error) {
    return { error: true, message: error.message };
  }
}