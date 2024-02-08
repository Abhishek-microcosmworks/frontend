import { authenticationToken } from '../../../../db/model/index.js';

export async function authenticateToken(req, res, next) {
  // Extract the token from the request headers
  const token = req.headers['authorization'];

  // Check if the token is present
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Token not provided' });
  }

  try {
    // Retrieve the user based on the token from your database
    const userToken = await authenticationToken.findOne({ token });
    

    // Check if the user or token is not found
    if (!userToken || userToken.isDeleted) {

      await authenticationToken.updateOne({ token }, { isDeleted: true });

      return res.status(401).json({ error: 'Unauthorized: Invalid user or token' });
    }


      // Check if the token has expired
      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (userToken.exp <= currentTimestamp) {

        const newExpiration = Math.floor(Date.now() / 1000) + 2 * 24 * 60 * 60;

        await authenticationToken.updateOne({ token }, { tokenExp: newExpiration })

        return res.status(401).json({ error: 'Unauthorized: Token has expired' });
      }

      // Call the next middleware function in the stack
      next();
  } catch (error) {
    console.error('Error accessing database:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
