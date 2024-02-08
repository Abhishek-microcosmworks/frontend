import { RegisterData } from '../../../db/model/index.js';

export const verifyEmail = async email => {
   try {
      const userEmail = await RegisterData.findOne({ email });

      if (userEmail === null) {
         return { error: true, message: 'Email not found' };
      } else {
         return { error: false, message: userEmail };
      }
   } catch (error) {
      console.error('Error:', error);
      return { error: true, message: 'Error while verifying email. Please Try Again.' };
   }
};