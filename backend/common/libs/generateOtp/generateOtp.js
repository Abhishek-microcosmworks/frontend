export let otpExpirationTime;
export const generateOtp = () => {
  // console.log('generate otp is runnn');
  otpExpirationTime = Math.floor(Date.now() / 1000) + 30;
  return Math.floor(100000 + Math.random() * 900000).toString();
};
