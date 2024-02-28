import { deleteBlogById } from '../../src/lib/index.js';

export const deleteBlog = async (req, res) => {
 const id = req.body.id;
  try
  {
    const deleteResult = await deleteBlogById(id);
    
    if (deleteResult.error === true)
    {
      return res.status(500).json({ error: true, message: deleteResult.message });
    }
    
      return res.status(200).json({ error: false, message:  deleteResult.message });
  } catch (error) {
  console.error(error);
  return res.status(500).json({ error: true, message: error.message});
 }
};