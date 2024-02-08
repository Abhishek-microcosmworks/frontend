import { RegisterData } from '../../db/model/index.js';
import { image_db } from '../../db/model/index.js';

import { verifyEmail } from '../../common/index.js';

export async function getImages(req, res) {
  const { email } = req.body;

  try {
    // Find user data
    const user = await verifyEmail(email);

    if (user.error === true) {
      return res.send({ error: true, message: user.message });
    }

    // Extract image IDs from userData
    const imageIds = userData.image_id.map(id => id);

    // Find images using image IDs
    const images = await image_db.find({ "_id": { $in: imageIds } });

    return res.status(200).send({ error: false, images });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).send({ error: true, message: "Internal Server Error" });
  }
}