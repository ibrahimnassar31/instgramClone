import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sender is required'],
      index: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Receiver is required'],
      index: true,
    },
    message: {
      type: String,
      required: [true, 'Message content is required'],
      trim: true,
      maxlength: [1000, 'Message must not exceed 1000 characters'],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// Optional compound index for better querying between sender-receiver pairs
messageSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 });

export const Message = mongoose.model('Message', messageSchema);