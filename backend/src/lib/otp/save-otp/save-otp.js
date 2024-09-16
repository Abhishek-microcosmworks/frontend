import { otpSchema } from '../../../../db/model/index.js';

export async function saveOtp(email, sendOTP) {

  const otpExpirationTimeInSeconds = 600;

    try {
      const data = {
        email: email,
        otp: sendOTP,
        otpExp: Math.floor(Date.now() / 1000) + otpExpirationTimeInSeconds,
        isDeleted: false,
      };
      const otpData = await otpSchema.create(data);
     
      return { error: false , data: otpData}
    } catch (error) {
      console.error('Error showing login:', error);
      return { error: true , message: error.message}
    }
  }