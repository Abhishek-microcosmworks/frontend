import { generateToken, expirationTime } from '../../common/index.js';
import {
  // RegisterData,
  otpGeneration,
  authenticationToken,
} from '../../db/model/index.js';

export const registerCredential = async (req, res) => {
  const { userEmail, otp } = req.body;
  // const user = await RegisterData.findOne({ email });
  let email = userEmail;
  console.log('my otp is', otp);
  console.log('my email for registration is', email);

  try {
    const user = await otpGeneration.findOne({
      email,
      isDeleted: { $ne: true },
    });
    const otpExpirationTime = user.otpExp;
    const currentTime = Math.floor(Date.now() / 1000);

    console.log(currentTime);
    console.log(otpExpirationTime);
    console.log('my user ', user);
    let sendOTP = user.otp;

    console.log('mysend otp is', sendOTP);

    if (currentTime > otpExpirationTime) {
      console.log('otp expired');
      await otpGeneration.updateMany(
        { email },
        { isDeleted: true },
        { new: true },
      );
      return res.status(400).json({ error: 'OTP expired' });
    }

    console.log('register sendotp value', sendOTP);
    if (sendOTP === otp) {
      const token = generateToken(user);

      const tokenEntry = new authenticationToken({
        token,
        tokenExp: expirationTime,
        email: user.email,
        userId: user._id,
      });

      await tokenEntry.save();
      await otpGeneration.updateMany(
        { email },
        { isDeleted: true },
        { new: true },
      );

      return res.status(200).json({ success: true, token });
    } else {
      return res.status(400).json({ error: 'Incorrect OTP' });
    }
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
