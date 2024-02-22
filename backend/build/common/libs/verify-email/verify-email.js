import { RegisterData } from '../../../db/model/index.js';

export const verifyEmail = async (email, name) => {

   try {
      const userEmail = await RegisterData.findOneAndUpdate({ email }, { name: name }, { new: true });

      if (userEmail === null) {
         return { error: true, message: 'Email or Name is incorrect!' };
      } else {
         return { error: false, data: userEmail, message: 'Email already exist!' };
      }
   } catch (error) {
      console.error('Error:', error);
      return { error: true, message: 'Error while verifying email. Please Try Again.' };
   }
};