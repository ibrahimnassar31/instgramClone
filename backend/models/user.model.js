import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;


const GENDERS = ['male', 'female'];

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [20, 'Username must be at most 20 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters']
    },
    profilePicture: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      default: '',
      maxlength: [150, 'Bio must be less than 150 characters']
    },
    gender: {
      type: String,
      enum: {
        values: GENDERS,
        message: 'Gender must be either male or female'
      }
    },
    followers: [
      {
        type: Types.ObjectId,
        ref: 'User'
      }
    ],
    following: [
      {
        type: Types.ObjectId,
        ref: 'User'
      }
    ],
    posts: [
      {
        type: Types.ObjectId,
        ref: 'Post'
      }
    ],
    bookmarks: [
      {
        type: Types.ObjectId,
        ref: 'Post'
      }
    ]
  },
  {
    timestamps: true,
  }
);


export const User = model('User', userSchema);
