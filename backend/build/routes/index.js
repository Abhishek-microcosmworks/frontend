import express from 'express';
import bodyParser from 'body-parser';
import { login, verifyOtp, register, resendOtp, editBlog, editImage, generateImage, generateBlog, getImages, logout, getHistory, deleteBlog, addBlogFeedback, getBlogById } from '../controller/index.js';
import { authenticateToken, getBlogData } from '../src/lib/index.js';

const router = express.Router();
router.use(bodyParser.json());

router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);
router.post('/logout', logout);
router.post('/resend-otp', resendOtp);

router.post('/get-blogs', authenticateToken, getHistory);
router.post('/article', authenticateToken, generateBlog);
router.post('/get-blog', authenticateToken, getBlogById);
router.post('/gen-image', authenticateToken, generateImage);
router.post('/edit-image', authenticateToken, editImage);
router.post('/blog/getImages', authenticateToken, getImages);
router.post('/blog/edit/blog', authenticateToken, editBlog);
router.post('/blog/delete', authenticateToken, deleteBlog);
router.post('/blog/feedback', authenticateToken, addBlogFeedback);

export default router;