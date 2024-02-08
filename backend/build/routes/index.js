import express from 'express';
import bodyParser from 'body-parser';
import { login, verifyOtp, register, resendOtp, editBlog, editImage, getContext, generateImage, generateKeywords, generateBlog, getImages, generateEmbeddings, logout, getHistory } from '../controller/index.js';
import { authenticateToken } from '../src/lib/index.js';

const router = express.Router();
router.use(bodyParser.json());

router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);
router.post('/logout', logout);
router.post('/resend-otp', resendOtp);

router.post('/history', authenticateToken, getHistory);
router.post('/article', authenticateToken, generateBlog);
router.post('/gen-image', authenticateToken, generateImage);
router.post('/edit-image', authenticateToken, editImage);
router.post('/gen-context', authenticateToken, getContext);
router.post('/blog/getImages', authenticateToken, getImages);
router.post('/blog/edit/blog', authenticateToken, editBlog);

export default router;