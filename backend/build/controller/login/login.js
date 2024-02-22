import { generateOtp, sendOtpEmail, expireOtp } from '../../common/index.js';
import { verifyEmail } from '../../common/index.js';
import { saveOtp, saveUser } from '../../src/lib/index.js';

export const login = async (req, res, next) => {
  try {

    const { email, name } = req.body;

    const emailConfirmation = await verifyEmail(email, name);

    if (emailConfirmation.error === true && emailConfirmation.message === 'Email or Name is incorrect!') {

      const userData = await saveUser(name, email);
      if (userData.error === true) {
        return res.status(500).json("Internal server error!");
      } else {
        await expireOtp(email);
        const sendOTP = generateOtp();

        const otpData = await saveOtp(email, sendOTP);

        if (otpData.error === true) {
          return res.status(500).json({ message: otpData.message });
        } else {
          console.log(otpData);
          const mailerResponse = await sendOtpEmail(otpData.data);

          if (mailerResponse.error === true) {
            return res.status(500).json({ message: "Internal Server Error" });
          } else {
            next();
            return res.status(200).json({ message: "Otp has been sent to your email!" });
          }
        }
      }
    } else {
      await expireOtp(email);
      const sendOTP = generateOtp();

      const otpData = await saveOtp(email, sendOTP);

      if (otpData.error === true) {
        return res.status(500).json({ message: otpData.message });
      } else {
        console.log(otpData);
        const mailerResponse = await sendOtpEmail(otpData.data);

        if (mailerResponse.error === true) {
          return res.status(500).json({ message: "Internal Server Error" });
        } else {
          next();
          return res.status(200).json({ message: "Otp has been sent to your email!" });
        }
      }
    }
  } catch (error) {
    console.error('Error: ', error);
    return res.status(500).json({ message: error.message });
  }
};