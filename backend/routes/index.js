import express from 'express';
import bodyParser from 'body-parser';
import {
  registerCredential,
  loginCredential,
  verifyOtp,
  blogGeneration,
  getHistory,
  verifyToken,
  getOtp,
  userLogout,
  autoVerifyToken,
  resendOtp,
} from './summary/index.js';
import { generateImage } from './generateImages/index.js';
import { generateKeywords } from './generateKeywords/index.js';
import { editImage } from './editimage/index.js';
import { generateContext } from './generateContext/index.js';
import { getImages } from './getImages/index.js';

const router = express.Router();
router.use(bodyParser.json());

router.post('/article', blogGeneration);
router.post('/register', registerCredential);
router.post('/login', loginCredential);
router.post('/send-otp', getOtp);
router.post('/verify-login', verifyOtp);
router.post('/history', getHistory);
router.post('/verify-token', verifyToken);
router.post('/autoverify-token', autoVerifyToken);
router.post('/logout', userLogout);
router.post('/resend-otp', resendOtp);
router.post('/gen-image', generateImage);
router.post('/gen-keywords',generateKeywords);
router.post('/edit-image',editImage);
router.post('/gen-context', generateContext);
router.post('/blog/getImages', getImages);

export default router;