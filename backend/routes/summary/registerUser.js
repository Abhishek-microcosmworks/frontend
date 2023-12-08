import { RegisterData, otpGeneration } from '../../db/model/index.js';
import {
  generateOtp,
  sendOtpEmail,
  otpExpirationTime,
} from '../../common/index.js';

generateOtp();

export let sendOTP;

export const getOtp = async (req, res) => {
  try {
    const { name, email } = req.body;
    const existingUser = await RegisterData.findOne({ email });

    if (!existingUser) {
      sendOTP = generateOtp();
      console.log('email is ', email);
      console.log('otp sent is ', sendOTP);

      sendOtpEmail(email, sendOTP);
      await createOtpData(email, sendOTP);
      await createRegisterData(name, email);
      res.status(200).json({ message: 'OTP sent successfully' });
    } else {
      return res.status(400).json({ error: 'User already exists' });
    }
  } catch (error) {
    console.error('kuch to gadbad hai ', error);
    res.status(500).json({ message: 'kuch to gadbad hai' });
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
    console.log('otp details :', OtpData);
  } catch (error) {
    console.error('Error showing login:', error);
  }
}

async function createRegisterData(name, email) {
  try {
    const data = {
      name: name,
      email: email,
      isDeleted: false,
    };
    const userData = await RegisterData.create(data);
  } catch (error) {
    console.error('Error showing login:', error);
  }
}
