import Post from "../models/post.model.js"
import { errorHandler } from "../utils/error.js"

export const createPost = async (req, res, next)=> {

    if (!req.user.isAdmin) {
        return next(errorHandler(403, 'You are not allowed to create a post'))
    }
    if (!req.body.title || !req.body.content) {
        return next(errorHandler(400, 'Please fill all the required fields'))
    }

    const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '') // replacing anything that's not a number or letter with -
    const newPost = new Post({
        ...req.body,
        slug,
        userId: req.user.id
    });
    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost)
    } catch (error) {
        next(error)
    }
}

export const getPosts = async (req, res, next)=> {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === 'asc' ? 1 : -1;
        const posts = await Post.find({
            
            ...(req.query.userId && { userId: req.query.userId }),          // if req.query has a userId then serach by userId
            ...(req.query.category && { category: req.query.category }),    // if req.query has a category then serach by category
            ...(req.query.slug && { slug: req.query.slug }),                // if req.query has a slug then serach by slug
            ...(req.query.postId && { _id: req.query.postId }),             // if req.query has a postId then serach by postId
            
            ...(req.query.searchTerm && {   // it will search in both title & content by the given searchTerm
                $or: [ // It allows searching in both title & content
                    { title: { $regex: req.query.searchTerm, $options: 'i' } }, // $regex search inside the title & i means case insensitive
                    { content: { $regex: req.query.searchTerm, $options: 'i' } }
                ],
            }),
        }).sort({ updatedAt: sortDirection})
          .skip(startIndex)
          .limit(limit);

        const totalPosts = await Post.countDocuments();

        const now = new Date();

        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1 , now.getDate());
        const lastMonthPosts = await Post.countDocuments({
            createdAt: { $gte: oneMonthAgo }
        });

        res.status(200).json({
            posts,
            totalPosts,
            lastMonthPosts
        });
        
    } catch (error) {
        next(error)
    }
}


export const deletePosts = async (req, res, next)=>{
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'You are not allowed to delete this post'))
    }
    try {
        await Post.findByIdAndDelete(req.params.postId);
        res.status(200).json('The post has been deleted')
    } catch (error) {
        next(error)
    }
}