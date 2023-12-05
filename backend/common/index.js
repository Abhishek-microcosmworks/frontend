import { generateOtp, otpExpirationTime } from './libs/generateOtp/index.js';
import { sendOtpEmail } from './libs/emailConfig/index.js';
import {
  generateToken,
  expirationTime,
} from './libs/generateToken/generateToken.js';

export { generateOtp, sendOtpEmail, generateToken, expirationTime , otpExpirationTime};
