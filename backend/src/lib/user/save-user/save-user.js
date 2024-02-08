import { RegisterData } from '../../../../db/model/index.js';

export async function saveUser(name, email) {

  console.log(email, name)

    try {
      const data = {
        name: name,
        email: email,
        isDeleted: false,
      };
      const userData = await RegisterData.create(data);

      return { error: false, data: userData };
    } catch (error) {
      console.error('Error showing login:', error);
      return { error: true, message: error.message };
    }
  }