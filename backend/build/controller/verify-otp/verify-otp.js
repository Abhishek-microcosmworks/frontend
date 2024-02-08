import 'dotenv/config';

import { otpGeneration } from '../../db/model/index.js';

//import { generateToken, expirationTime } from '../../common/index.js';

import { createToken, saveToken } from '../../src/lib/index.js';

import { authenticationToken } from '../../db/model/index.js';

import { verifyEmail } from '../../common/index.js';

import { findOtp } from '../../common/index.js';

import { expireOtp } from '../../common/libs/expire-otp/index.js';

//    *********************** generating token*****************************

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const emailConfirmation = await verifyEmail(email);

    if (emailConfirmation.error === true) {
      res.status(404).json({ message: 'Email not found!' });
    }

    const otpResponse = await findOtp(email);

    if (otpResponse.error === true) {
      res.status(403).json({ error: true, message: otpResponse.message });
    }

    const currentTime = Math.floor(Date.now() / 1000);

    if (currentTime > otpResponse.data.otpExp) {
      const otpRes = await expireOtp(email);

      if (otpRes.error === true) {
        return res.status(400).json({ error: true, message: otpRes.message });
      } else {
        return res.status(400).json({ message: 'OTP expired.' });
      }
    }
    if (otp === otpResponse.data.otp) {
      const token = await createToken(otpResponse.data);

      const authToken = await saveToken(token, otpResponse.data.email, otpResponse.data._id);

      if (authToken.error === true) {
        res.status(401).json({ message: 'Internal Server Error' });
      }
      await expireOtp(email);
      return res.status(200).json({ error: true, data: authToken });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};