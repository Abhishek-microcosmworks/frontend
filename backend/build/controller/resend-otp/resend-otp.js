import 'dotenv/config';

import { generateOtp, sendOtpEmail } from '../../common/index.js';
import { verifyEmail, expireOtp } from '../../common/index.js';
import { saveOtp } from '../../src/lib/index.js';

export const resendOtp = async (req, res) => {
  try {
    const { email, name } = req.body;

    const emailConfirmation = await verifyEmail(email, name);

    if (emailConfirmation.error === true) {
      return res.status(404).json({ message: emailConfirmation.message });
    } else {
      await expireOtp(email);
      const sendOTP = generateOtp();
      console.log('otp sent is ', sendOTP);

      const otpData = await saveOtp(email, sendOTP);

      if (otpData.error === true) {
        return res.status(500).json({ message: otpData.message });
      } else {
        const mailerResponse = await sendOtpEmail(otpData.data, name);

        if (mailerResponse.error === true) {
          return res.status(500).json({ message: "Internal Server Error" });
        } else {
          return res.status(200).json({ message: "Otp has been sent to your email!" });
        }
      }
    }
  } catch (error) {
    console.error('Error: ', error);
    return res.status(500).json({ message: error.message });
  }
};