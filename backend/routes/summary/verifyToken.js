import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
  try {
    const { userToken } = req.body;

    if (!userToken) {
      console.log('Token is missing');
      return res.status(400).json({ expired: true, message: 'login required' });
    }

    let decoded;
    try {
      decoded = jwt.verify(userToken, process.env.SECRET_KEY);
    } catch (error) {
      // console.error('Error verifying token:', error.message);

      return res
        .status(500)
        .json({ expired: true, message: 'Token verification error' });
    }

    const currentTime = Math.floor(Date.now() / 1000);

    if (decoded.exp !== undefined && decoded.exp < currentTime) {
      console.log('Token expired');
      return res
        .status(401)
        .json({ expired: true, decoded, message: 'token expired' });
    } else {
      req.decoded = decoded;
      next();

      return res
        .status(200)
        .json({ expired: false, decoded, newToken: userToken });
    }
  } catch (error) {
    console.error('Unexpected error:', error.message);
    return res.status(500).json({ expired: true, message: 'Unexpected error' });
  }
};
