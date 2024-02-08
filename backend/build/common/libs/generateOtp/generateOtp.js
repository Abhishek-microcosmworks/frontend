export let otpExpirationTime;
export const generateOtp = () => {
  otpExpirationTime = Math.floor(Date.now() / 1000) + 1000000000;
  return Math.floor(100000 + Math.random() * 900000).toString();
};