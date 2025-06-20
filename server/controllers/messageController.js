// Delete a message (only sender)
export const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const message = await Message.findById(id);
        if (!message) return res.json({ success: false, message: "Message not found" });
        if (String(message.senderId) !== String(userId)) {
            return res.json({ success: false, message: "Not authorized to delete this message" });
        }
        await Message.findByIdAndDelete(id);
        // Notify both sender and receiver in real time
        const receiverId = String(message.receiverId);
        const senderSocketId = userSocketMap[String(userId)];
        const receiverSocketId = userSocketMap[receiverId];
        if (senderSocketId) io.to(senderSocketId).emit("messageDeleted", { _id: id });
        if (receiverSocketId) io.to(receiverSocketId).emit("messageDeleted", { _id: id });
        res.json({ success: true, message: "Message deleted" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Update a message (only sender, only text)
export const updateMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;
        const userId = req.user._id;
        const message = await Message.findById(id);
        if (!message) return res.json({ success: false, message: "Message not found" });
        if (String(message.senderId) !== String(userId)) {
            return res.json({ success: false, message: "Not authorized to update this message" });
        }
        message.text = text;
        await message.save();
        // Notify both sender and receiver in real time
        const receiverId = String(message.receiverId);
        const senderSocketId = userSocketMap[String(userId)];
        const receiverSocketId = userSocketMap[receiverId];
        if (senderSocketId) io.to(senderSocketId).emit("messageUpdated", { ...message.toObject() });
        if (receiverSocketId) io.to(receiverSocketId).emit("messageUpdated", { ...message.toObject() });
        res.json({ success: true, message: "Message updated", updatedMessage: message });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}
import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js"
import { io, userSocketMap } from "../server.js";


// Get all users except the logged in user
export const getUsersForSidebar = async (req, res)=>{
    try {
        const userId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne: userId}}).select("-password");

        // Count number of messages not seen
        const unseenMessages = {}
        const promises = filteredUsers.map(async (user)=>{
            const messages = await Message.find({senderId: user._id, receiverId: userId, seen: false})
            if(messages.length > 0){
                unseenMessages[user._id] = messages.length;
            }
        })
        await Promise.all(promises);
        res.json({success: true, users: filteredUsers, unseenMessages})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Get all messages for selected user
export const getMessages = async (req, res) =>{
    try {
        const { id: selectedUserId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                {senderId: myId, receiverId: selectedUserId},
                {senderId: selectedUserId, receiverId: myId},
            ]
        })
        await Message.updateMany({senderId: selectedUserId, receiverId: myId}, {seen: true});

        res.json({success: true, messages})


    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// api to mark message as seen using message id
export const markMessageAsSeen = async (req, res)=>{
    try {
        const { id } = req.params;
        await Message.findByIdAndUpdate(id, {seen: true})
        res.json({success: true})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Send message to selected user
export const sendMessage = async (req, res) =>{
    try {
        const {text, image} = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })

        // Emit the new message to the receiver's socket
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }

        res.json({success: true, newMessage});

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}