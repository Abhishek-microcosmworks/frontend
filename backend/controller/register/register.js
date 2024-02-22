import { verifyEmail, generateOtp, sendOtpEmail, expireOtp } from '../../common/index.js';
import { saveUser, saveOtp } from '../../src/lib/index.js';

export const register = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await verifyEmail(email,name);

    if (user.error === true || user.message === 'Email or Name is incorrect!') {

      const userData = await saveUser(name, email);

      if(userData.error === true){
        res.status(500).json("Internal server error!");
      }

      await expireOtp(email);
        const sendOTP = generateOtp();
        
        const otpData = await saveOtp(email, sendOTP)
        
        if(otpData.error === true){
          return res.status(500).json({ message: otpData.message })
        }else{

          const mailerResponse = await sendOtpEmail(otpData.data);
       
          if(mailerResponse.error === true){
            return res.status(500).json({ message: "Internal Server Error" });
          }else{
            return res.status(200).json({ message: "Otp has been sent to your email!" });
          }
        }
    }else{
        await expireOtp(email);
        const sendOTP = await  generateOtp();

        const otpData = await saveOtp(email, sendOTP)

        if(otpData.error === true){
            res.status(403).json("Unauthorised!");
        }
        const mailerResponse = await sendOtpEmail(otpData.data);

        if(mailerResponse.error === true){
          return res.status(500).json({ message: "Internal Server Error" });
        }

          return res.status(200).json({ message: "Otp has been sent to your email!" });
    }
    
  } catch (error) {
    console.error('error', error);
    res.status(500).json({ message: 'Internal Sever Error' });
  }
};