import { otpGeneration } from '../../../db/model/index.js';

export async function findOtp(email){

  const otpConfirmation = await otpGeneration.findOne({
    email,
    isDeleted: { $ne: true },
});

      if(!otpConfirmation){
        return { error: true, message: "Otp not found!" }
      }else{
        return { error: false, data: otpConfirmation }
      }
}