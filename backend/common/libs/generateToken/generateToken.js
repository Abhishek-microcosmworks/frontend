import jwt from "jsonwebtoken";

export let expirationTime;
export const generateToken = (user) => {
  expirationTime = Math.floor(Date.now() / 1000) + 2 * 24 * 60 * 60;
  return jwt.sign(
    { email: user.email, exp: expirationTime },
    process.env.SECRET_KEY
  );
};
