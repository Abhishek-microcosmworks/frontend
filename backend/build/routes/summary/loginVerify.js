import 'dotenv/config';

import { otpGeneration } from '../../db/model/index.js';

import { generateToken, expirationTime } from '../../common/index.js';

import { authenticationToken } from '../../db/model/index.js';

//    *********************** generating token*****************************

export const loginCredential = async (req, res) => {
  try {
    const { userEmail, otp } = req.body;
    const email = userEmail;

    console.log('mmmm emaillll', email);
    console.log('my type otp', otp);

    const user = await otpGeneration.findOne({
      email,
      isDeleted: { $ne: true }
    });

    if (!email) {
      return res.status(404).json({ error: 'User not found' });
    }

    const otpExpirationTime = user.otpExp;
    const currentTime = Math.floor(Date.now() / 1000);

    let sendOTP = user.otp;
    console.log('mysend otp is', sendOTP);

    if (currentTime > otpExpirationTime) {
      console.log('otp expired');
      await otpGeneration.updateMany({ email }, { isDeleted: true }, { new: true });
      return res.status(400).json({ message: 'OTP expired' });
    }

    if (otp === sendOTP) {
      const token = generateToken(user);

      const userId = user._id;
      console.log('userID is :', userId);

      const tokenEntry = new authenticationToken({
        token,
        tokenExp: expirationTime,
        email: user.email,
        userId
      });

      await tokenEntry.save();

      await otpGeneration.updateMany({ email, otp }, { isDeleted: true }, { new: true });
      return res.status(200).json({ success: true, token });
    } else {
      console.log('otp is incorrect');
      return res.status(400).json({ message: 'Incorrect OTP', otp });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};