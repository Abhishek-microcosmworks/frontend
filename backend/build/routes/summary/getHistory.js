import { authenticationToken } from '../../db/model/index.js';
import { blog } from '../../db/model/index.js';

export const getHistory = async (req, res) => {
  try {
    const { email } = req.body;
    console.log('history email is ', email);
    const userEmail = await authenticationToken.findOne({ email });
    if (userEmail) {
      // const userId = userEmail.userId;
      // console.log('userID is :', userId);
      const history = await blog.find({ email: email });
      const historyDetailsArray = [];
      history.forEach(entry => {
        const historyDetails = entry.finalContent;
        console.log('Final content:', historyDetails);
        historyDetailsArray.push(historyDetails);
      });
      res.status(200).json({ historyDetails: historyDetailsArray });
    }
  } catch (error) {
    console.error('Error in history:', error);
  }
};