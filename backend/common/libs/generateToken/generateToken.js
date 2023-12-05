import jwt from 'jsonwebtoken';

export let expirationTime;
export const generateToken = (user) => {
  // console.log('generate token is runnn');
  expirationTime = Math.floor(Date.now() / 1000) + 1200;
  // console.log('my user is', user);
  return jwt.sign(
    { email: user.email, exp: expirationTime },
    process.env.SECRET_KEY,
  );
};
