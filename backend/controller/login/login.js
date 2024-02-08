import {
  generateOtp,
  sendOtpEmail,
} from '../../common/index.js';
import { verifyEmail } from '../../common/index.js';
import { saveOtp } from '../../src/lib/index.js';

export const login = async (req, res, next) => {
  try {

    const { email } = req.body;
    
    const emailConfirmation = await verifyEmail(email);
    
    if(emailConfirmation.error === true){
      return res.status(404).json({ message: emailConfirmation.message });
    }else{
      const sendOTP = generateOtp();
      console.log('otp sent is ', sendOTP);
      
      const otpData = await saveOtp(email, sendOTP)
      
      if(otpData.error === true){
        return res.status(500).json({ message: otpData.message })
      }else{
        console.log(otpData)
        const mailerResponse = await sendOtpEmail(otpData.data);

        
        if(mailerResponse.error === true){
          return res.status(500).json({ message: "Internal Server Error" });
        }else{
          next()
          return res.status(200).json({ message: "Otp has been sent to your email!" });
        }
      }
    }
   } catch (error) {
    console.error('Error: ', error);
    return res.status(500).json({ message: error.message });
  }
};