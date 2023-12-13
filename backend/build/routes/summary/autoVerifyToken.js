import jwt from 'jsonwebtoken';
import { authenticationToken } from '../../db/model/index.js';

export const autoVerifyToken = async (req, res) => {
  let token;
  try {
    const { userToken } = req.body;
    token = userToken;
    // console.log('my token from frontend is', token);

    const currentTime = Math.floor(Date.now() / 1000);
    let decoded;
    decoded = jwt.verify(token, process.env.SECRET_KEY);
    // console.log('decoded is for auto', decoded);

    if (decoded.exp !== undefined && decoded.exp < currentTime) {

      return res.status(200).json({ expired: true, decoded, message: 'token auto expired' });
    } else {
      return res.status(400).json({ expired: false, decoded, newToken: token });
    }
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      // console.log('value of token i', token);
      const result = await authenticationToken.findOneAndUpdate({ token }, { isDeleted: true }, { new: true });

      if (result) {
        // console.log('db changes to true as auto expired');
        return res.status(200).json({ success: true });
      }
      return res.status(200).json({ expired: true, message: 'token expired' });
    }
  }
};