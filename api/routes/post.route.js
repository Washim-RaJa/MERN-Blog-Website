import express from 'express'
import { verifyToken } from '../utils/verifyUser.js'
import { createPost, deletePosts, getPosts, updatePosts } from '../controllers/post.controller.js';

const router = express.Router();

router.get('/getposts', getPosts);
router.post('/create', verifyToken, createPost);
router.put('/updatepost/:postId/:userId',verifyToken, updatePosts);
router.delete('/deletepost/:postId/:userId',verifyToken, deletePosts);

export default router;