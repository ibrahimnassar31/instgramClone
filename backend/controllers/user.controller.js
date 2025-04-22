import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";
import { generateToken } from "../utils/jwt.js";
import { asyncHandler } from "../middlewares/ayncHandler.js";

export const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required", success: false });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: "Email already exists", success: false });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({ username, email, password: hashedPassword });

  res.status(201).json({ message: "Account created successfully", success: true });
});


export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required", success: false });
  }

  let user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials", success: false });
  }

  const token = generateToken({ userId: user._id });
    const populatedPosts = await Post.find({ _id: { $in: user.posts }, author: user._id });

  user = {
    _id: user._id,
    username: user.username,
    email: user.email,
    profilePicture: user.profilePicture,
    bio: user.bio,
    followers: user.followers,
    following: user.following,
    posts: populatedPosts
}

  res.cookie("token", token, { httpOnly: true, sameSite: "strict", maxAge: 86400000 }).json({
    message: `Welcome back ${user.username}`,
    success: true,
    user,
  });
});


export const logout = (_, res) => {
  res.cookie("token", "", { maxAge: 0 }).json({ message: "Logged out successfully", success: true });
};


export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).populate("posts bookmarks");
  if (!user) return res.status(404).json({ message: "User not found", success: false });

  res.status(200).json({ user, success: true });
});


export const editProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found", success: false });

  const { bio, gender } = req.body;
  const profilePicture = req.file;

  if (profilePicture) {
    const fileUri = getDataUri(profilePicture);
    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    user.profilePicture = cloudResponse.secure_url;
  }

  if (bio) user.bio = bio;
  if (gender) user.gender = gender;

  await user.save();
  res.status(200).json({ message: "Profile updated", success: true, user });
});


export const getSuggestedUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ _id: { $ne: req.id } }).select("-password");
  res.status(200).json({ success: true, users });
});


export const followOrUnfollow = asyncHandler(async (req, res) => {
  const currentUserId = req.id;
  const targetUserId = req.params.id;

  if (currentUserId === targetUserId) {
    return res.status(400).json({ message: "You can't follow/unfollow yourself", success: false });
  }

  const currentUser = await User.findById(currentUserId);
  const targetUser = await User.findById(targetUserId);
  if (!currentUser || !targetUser) {
    return res.status(404).json({ message: "User not found", success: false });
  }

  const isFollowing = currentUser.following.includes(targetUserId);

  if (isFollowing) {
    currentUser.following.pull(targetUserId);
    targetUser.followers.pull(currentUserId);
  } else {
    currentUser.following.push(targetUserId);
    targetUser.followers.push(currentUserId);
  }

  await Promise.all([currentUser.save(), targetUser.save()]);

  res.status(200).json({
    message: isFollowing ? "Unfollowed successfully" : "Followed successfully",
    success: true,
  });
});
