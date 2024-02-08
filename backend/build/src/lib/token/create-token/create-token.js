import jwt from 'jsonwebtoken';

export const createToken = user => {

  return jwt.sign({ email: user.email }, process.env.SECRET_KEY);
};