import {
  generateOtp,
  sendOtpEmail,
  otpExpirationTime,
} from '../../common/index.js';
import { RegisterData, otpGeneration } from '../../db/model/index.js';

// export let sendOTP;

export const verifyOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await RegisterData.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Email not found!' });
    }
    if (user) {
      // console.log("hiuj", user)
      const sendOTP = generateOtp();
      // console.log('email', email);
      console.log('otp sent is ', sendOTP);

      sendOtpEmail(email, sendOTP);

      await createOtpData(email, sendOTP);
      return res.status(200).json({ message: 'OTP sent successfully' });
    } else {
      return res.status(404).json({ message: 'user is not registerd' });
    }
  } catch (error) {
    console.error('Error: ', error);
    return res.status(500).json({ message: error.message });
  }
};

async function createOtpData(email, sendOTP) {
  try {
    const data = {
      email: email,
      otp: sendOTP,
      otpExp: otpExpirationTime,
      isDeleted: false,
    };
    const OtpData = await otpGeneration.create(data);
    console.log('****otp details********* :',OtpData);
  } catch (error) {
    console.error('Error showing login:', error);
  }
}
