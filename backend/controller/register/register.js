import { verifyEmail, generateOtp, sendOtpEmail } from '../../common/index.js';
import { saveUser, saveOtp } from '../../src/lib/index.js';

export const register = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await verifyEmail(email);

    if (user.error === false) {
       return res.status(400).json({ error: 'Email already exists' });
    }

      const userData = await saveUser(name, email);

      if(userData.error === true){
        res.status(500).json("Internal server error!");
      }
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

  } catch (error) {
    console.error('error', error);
    res.status(500).json({ message: 'Internal Sever Error' });
  }
};