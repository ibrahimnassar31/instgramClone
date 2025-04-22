import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'Comment text is required'],
      trim: true,
      maxlength: [300, 'Comment must be less than 300 characters'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Comment author is required'],
      index: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: [true, 'Associated post is required'],
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Comment = mongoose.model('Comment', commentSchema);