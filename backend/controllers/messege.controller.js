import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

/**
 * @desc    Send a new message to a user
 * @route   POST /api/v1/messages/send/:receiverId
 * @access  Private
 */
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.receiverId;
    const { textMessage: message } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message text is required' });
    }

    // Step 1: Find or create the conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    // Step 2: Create and save the new message
    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
    });

    conversation.messages.push(newMessage._id);
    await Promise.all([conversation.save(), newMessage.save()]);

    // Step 3: Emit real-time event via Socket.io
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      newMessage,
    });
  } catch (error) {
    console.error("Error in sendMessage:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
};

/**
 * @desc    Get all messages between two users
 * @route   GET /api/v1/messages/all/:userId
 * @access  Private
 */
export const getMessage = async (req, res) => {
    try {
      const senderId = req.id;
      const receiverId = req.params.userId;
  
      const conversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] },
      }).populate({
        path: "messages",
        options: { sort: { createdAt: 1 } }, // Oldest to newest
      });
  
      if (!conversation) {
        return res.status(200).json({ success: true, messages: [] });
      }
  
      return res.status(200).json({
        success: true,
        messages: conversation.messages,
      });
    } catch (error) {
      console.error("Error in getMessage:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to get messages",
      });
    }
  };
  