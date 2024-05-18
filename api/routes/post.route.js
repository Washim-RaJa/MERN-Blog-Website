import express from 'express'
import { verifyToken } from '../utils/verifyUser.js'
import { createPost, deletePosts, getPosts } from '../controllers/post.controller.js';

const router = express.Router();

router.post('/create', verifyToken, createPost);
router.get('/getposts', getPosts);
router.delete('/deletepost/:postId/:userId',verifyToken, deletePosts);

export default router;