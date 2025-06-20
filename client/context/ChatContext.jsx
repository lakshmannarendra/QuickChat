import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";


export const ChatContext = createContext();

export const ChatProvider = ({ children })=>{

    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null)
    const [unseenMessages, setUnseenMessages] = useState({})

    const {socket, axios} = useContext(AuthContext);

    // function to get all users for sidebar
    const getUsers = async () =>{
        try {
            const { data } = await axios.get("/api/messages/users");
            if (data.success) {
                setUsers(data.users)
                setUnseenMessages(data.unseenMessages)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // function to get messages for selected user
    const getMessages = async (userId)=>{
        try {
            const { data } = await axios.get(`/api/messages/${userId}`);
            if (data.success){
                setMessages(data.messages)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // function to send message to selected user
    const sendMessage = async (messageData)=>{
        try {
            const {data} = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
            if(data.success){
                setMessages((prevMessages)=>[...prevMessages, data.newMessage])
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // function to subscribe to messages for selected user
    const subscribeToMessages = async () =>{
        if(!socket) return;

        socket.on("newMessage", (newMessage)=>{
            if(selectedUser && newMessage.senderId === selectedUser._id){
                newMessage.seen = true;
                setMessages((prevMessages)=> [...prevMessages, newMessage]);
                axios.put(`/api/messages/mark/${newMessage._id}`);
            }else{
                setUnseenMessages((prevUnseenMessages)=>({
                    ...prevUnseenMessages, [newMessage.senderId] : prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId] + 1 : 1
                }))
            }
        })
    }

    // function to unsubscribe from messages
    const unsubscribeFromMessages = ()=>{
        if(socket) socket.off("newMessage");
    }


    // Listen for real-time message updates and deletions
    useEffect(() => {
        if (!socket) return;
        const handleMessageDeleted = ({ _id }) => {
            setMessages((prev) => prev.filter((msg) => msg._id !== _id));
        };
        const handleMessageUpdated = (updatedMsg) => {
            setMessages((prev) => prev.map((msg) => msg._id === updatedMsg._id ? { ...msg, ...updatedMsg } : msg));
        };
        socket.on("messageDeleted", handleMessageDeleted);
        socket.on("messageUpdated", handleMessageUpdated);
        return () => {
            socket.off("messageDeleted", handleMessageDeleted);
            socket.off("messageUpdated", handleMessageUpdated);
        };
    }, [socket]);

    useEffect(()=>{
        subscribeToMessages();
        return ()=> unsubscribeFromMessages();
    },[socket, selectedUser])


    // Delete a message
    const deleteMessage = async (messageId) => {
        try {
            const { data } = await axios.delete(`/api/messages/${messageId}`);
            if (data.success) {
                setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
                toast.success('Message deleted');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Update a message
    const updateMessage = async (messageId, newText) => {
        try {
            const { data } = await axios.put(`/api/messages/${messageId}`, { text: newText });
            if (data.success) {
                setMessages((prev) => prev.map((msg) => msg._id === messageId ? { ...msg, text: data.updatedMessage.text } : msg));
                toast.success('Message updated');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const value = {
        messages, setMessages, users, selectedUser, getUsers, getMessages, sendMessage, setSelectedUser, unseenMessages, setUnseenMessages,
        deleteMessage, updateMessage
    }

    return (
    <ChatContext.Provider value={value}>
            { children }
    </ChatContext.Provider>
    )
}