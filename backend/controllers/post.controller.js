import sharp from "sharp";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import cloudinary from "../utils/cloudinary.js";
import { asyncHandler } from "../middlewares/ayncHandler.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

/**
 * @desc    Create a new post with optimized image upload
 * @route   POST /api/v1/posts
 * @access  Private
 */
export const addNewPost = asyncHandler(async (req, res) => {
  const userId = req.id;
  const { caption = '' } = req.body;
  const file = req.file;

  if (!file) {
    res.status(400);
    throw new Error('Image file is required');
  }

  // Optimize image using Sharp
  const optimizedBuffer = await sharp(file.buffer)
    .resize(800, 800, { fit: 'inside' })
    .jpeg({ quality: 80 })
    .toBuffer();

  // Upload to Cloudinary
  const dataUri = `data:image/jpeg;base64,${optimizedBuffer.toString('base64')}`;
  const uploadResult = await cloudinary.uploader.upload(dataUri, {
    folder: 'instagram_clone/posts',
    resource_type: 'image'
  });

  // Create post record
  const post = await Post.create({
    caption,
    image: uploadResult.secure_url,
    author: userId
  });

  // Link post to user
  await User.findByIdAndUpdate(userId, { $push: { posts: post._id } });

  const populatedPost = await post
    .populate({ path: 'author', select: 'username profilePicture' });

  res.status(201).json({
    success: true,
    message: 'Post created successfully',
    post: populatedPost
  });
});

/**
 * @desc    Get all posts (feed) sorted by newest first
 * @route   GET /api/v1/posts
 * @access  Public
 */
export const getAllPost = asyncHandler(async (req, res) => {
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .populate({ path: 'author', select: 'username profilePicture' })
    .populate({
      path: 'comments',
      options: { sort: { createdAt: -1 } },
      populate: { path: 'author', select: 'username profilePicture' }
    });

  res.status(200).json({ success: true, posts });
});

/**
 * @desc    Get posts created by the authenticated user
 * @route   GET /api/v1/posts/user
 * @access  Private
 */
export const getUserPosts = asyncHandler(async (req, res) => {
  const userId = req.id;
  const posts = await Post.find({ author: userId })
    .sort({ createdAt: -1 })
    .populate({ path: 'author', select: 'username profilePicture' })
    .populate({
      path: 'comments',
      options: { sort: { createdAt: -1 } },
      populate: { path: 'author', select: 'username profilePicture' }
    });

  res.status(200).json({ success: true, posts });
});

/**
 * @desc    Like or unlike a post (toggle)
 * @route   PATCH /api/v1/posts/:id/like
 * @access  Private
 */
export const toggleLike = asyncHandler(async (req, res) => {
  const userId = req.id;
  const postId = req.params.id;

  const post = await Post.findById(postId);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  const hasLiked = post.likes.includes(userId);
  if (hasLiked) {
    post.likes.pull(userId);
    await post.save();
    return res.status(200).json({ success: true, message: 'Post unliked' });
  }

  post.likes.addToSet(userId);
  await post.save();

  // Send real-time notification
  if (post.author.toString() !== userId) {
    const user = await User.findById(userId).select('username profilePicture');
    const notification = {
      type: 'like',
      userId,
      userDetails: user,
      postId,
      message: 'Your post was liked'
    };
    const receiverSocketId = getReceiverSocketId(post.author.toString());
    if (receiverSocketId) io.to(receiverSocketId).emit('notification', notification);
  }

  res.status(200).json({ success: true, message: 'Post liked' });
});

/**
 * @desc    Add a comment to a post
 * @route   POST /api/v1/posts/:id/comments
 * @access  Private
 */
export const addComment = asyncHandler(async (req, res) => {
  const userId = req.id;
  const postId = req.params.id;
  const { text } = req.body;

  if (!text) {
    res.status(400);
    throw new Error('Comment text is required');
  }

  const post = await Post.findById(postId);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  const comment = await Comment.create({ text, author: userId, post: postId });
  post.comments.push(comment._id);
  await post.save();

  const populatedComment = await comment.populate({ path: 'author', select: 'username profilePicture' });

  res.status(201).json({ success: true, message: 'Comment added', comment: populatedComment });
});

/**
 * @desc    Get comments for a post
 * @route   GET /api/v1/posts/:id/comments
 * @access  Public
 */
export const getComments = asyncHandler(async (req, res) => {
  const postId = req.params.id;

  const comments = await Comment.find({ post: postId })
    .sort({ createdAt: -1 })
    .populate('author', 'username profilePicture');

  res.status(200).json({ success: true, comments });
});

/**
 * @desc    Delete a post and its comments
 * @route   DELETE /api/v1/posts/:id
 * @access  Private
 */
export const deletePost = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const authorId = req.id;

  const post = await Post.findById(postId);
  if (!post) {
    res.status(404);
    throw   new Error('Post not found');
  }

  if (post.author.toString() !== authorId) {
    res.status(403);
    throw new Error('Unauthorized to delete this post');
  }

  await Post.findByIdAndDelete(postId);

   // remove the post id from the user's post
   let user = await User.findById(authorId);
   user.posts = user.posts.filter(id => id.toString() !== postId);
   await user.save();

  await Comment.deleteMany({ post: postId });

  res.status(200).json({ success: true, message: 'Post deleted' });
});

/**
 * @desc    Bookmark or remove bookmark for a post
 * @route   PATCH /api/v1/posts/:id/bookmark
 * @access  Private
 */
export const toggleBookmark = asyncHandler(async (req, res) => {
  const userId = req.id;
  const postId = req.params.id;

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const hasBookmarked = user.bookmarks.includes(postId);
  if (hasBookmarked) {
    user.bookmarks.pull(postId);
    await user.save();
    return res.status(200).json({ success: true, type: 'unsaved', message: 'Bookmark removed' });
  }

  user.bookmarks.addToSet(postId);
  await user.save();
  res.status(200).json({ success: true, type: 'saved', message: 'Post bookmarked' });
});
