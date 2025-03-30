import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.io.js";

export const getAllUsers = async (req, res) => {
  try {
    const myId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: myId } }).select(
      "-password"
    );

    return res.status(200).json({
      success: true,
      message: "Fetched all filtered users",
      filteredUsers,
    });
  } catch (error) {
    console.log("Error in Fetching users", error);
    return res.status(500).json({
      success: false,
      message: "Internal Error in fetching user",
    });
  }
};

export const getMessages = async (req, res) => {
  const { id: userToChatId } = req.params;
  const myId = req.user._id;
  try {
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Fetched message successfully",
      messages,
    });
  } catch (error) {
    console.log("Error in Fetching messages", error);
    return res.status(500).json({
      success: false,
      message: "Internal Error in fetching messages ",
    });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const myId = req.user._id;

    let imageUrl;

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId: myId,
      receiverId: receiverId,
      text: text,
      image: imageUrl,
    });

    await newMessage.save();

    // todo: Realtime functionality with Socket.io goes hear.
    const receiverSocketId = getReceiverSocketId(receiverId);
    io.to(receiverSocketId).emit("newMessage", newMessage);

    return res.status(201).json({
      success: false,
      message: "Message sent successfully",
      newMessage,
    });
  } catch (error) {
    console.log("Error in Sending message", error);
    return res.status(500).json({
      success: false,
      message: "Internal Error in sending message ",
    });
  }
};
