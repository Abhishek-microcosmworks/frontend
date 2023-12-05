import 'dotenv/config';

import {
  generateToken,
  expirationTime,
  sendOtpEmail,
  generateOtp,
  otpExpirationTime,
} from '../../common/index.js';

import {
  authenticationToken,
  // RegisterData,
  otpGeneration,
} from '../../db/model/index.js';

//    *********************** generating token*****************************

export const resendOtp = async (req, res) => {
  try {
    const { userEmail, otp } = req.body;
    const email = userEmail;

    console.log('resend otp  emaillll', email);
    console.log('my resend type otp', otp);

    const user = await otpGeneration.findOne({
      email,
      isDeleted: { $ne: true },
    });
    console.log('************Retrieved user:****************');
    await otpGeneration.updateMany(
      { email },
      { isDeleted: true },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const sendOTP = generateOtp();
    console.log('otp ressent is ', sendOTP);

    sendOtpEmail(email, sendOTP);
    console.log('regeneration otp', sendOTP);
    console.log('entered resnd otp, ', otp);
    await createOtpData(email, sendOTP);

    // console.log('generated Otp is ', sendOTP);

    if (otp === sendOTP) {
      const token = generateToken(user);

      // console.log('my token is', token);

      const userId = user._id;
      console.log('userID is :', userId);

      //         *************************user login in database***********************

      const tokenEntry = new authenticationToken({
        token,
        tokenExp: expirationTime,
        email: user.email,
        userId,
      });

      await tokenEntry.save();

      const currentTime = Math.floor(Date.now() / 1000);
      const otpExpirationTime = user.otpExp;
      console.log(currentTime);
      console.log(otpExpirationTime);

      if (currentTime > otpExpirationTime) {
        await otpGeneration.updateMany(
          { email },
          { isDeleted: true },
          { new: true },
        );
        if (!expiredUser) {
          console.log('User not found for expiration');
          return res.status(200).json({ success: true, otp });
        } else {
          console.log('OTP entry marked as deleted due to expiration');
          return res.status(401).json({ error: 'OTP expired' });
        }
      }

      return res.status(200).json({ success: true, token });
    } else {
      return res.status(401).json({ error: 'Invalid resend otp' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal some error' });
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
    console.log('****otp details********* :');
  } catch (error) {
    console.error('Error showing login:', error);
  }
}
