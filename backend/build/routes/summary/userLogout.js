import { authenticationToken } from '../../db/model/index.js';

export const userLogout = async (req, res) => {
  try {
    const { token } = req.body;
    console.log('token in logout', token);

    const result = await authenticationToken.findOneAndUpdate({ token }, { isDeleted: true }, { new: true });

    if (result) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(404).json({ success: false, message: 'Token not found' });
    }
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};