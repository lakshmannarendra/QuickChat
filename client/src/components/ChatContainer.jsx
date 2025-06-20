import React, { useContext, useEffect, useRef, useState } from 'react'
import Picker from 'emoji-picker-react';
import assets, { AI_USER, messagesDummyData } from '../assets/assets'
import { formatMessageTime } from '../lib/utils'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const ChatContainer = () => {
    const { messages, setMessages, selectedUser, setSelectedUser, sendMessage, getMessages, deleteMessage, updateMessage } = useContext(ChatContext)
    const { authUser, onlineUsers, axios } = useContext(AuthContext)

    const scrollEnd = useRef()

    const [input, setInput] = useState('');
    const [showPicker, setShowPicker] = useState(false);
    const [editId, setEditId] = useState(null);
    const [editText, setEditText] = useState('');

    // Handle sending a message
    const handleSendMessage = async (e) => {
        if (e) e.preventDefault();
        if (input.trim() === "") return null;
        const isAIChat = selectedUser._id === AI_USER._id;

        if (isAIChat) {
            // 1. Add user's message to UI (frontend only)
            const userMsg = {
                _id: Date.now().toString(),
                senderId: authUser._id,
                receiverId: AI_USER._id,
                text: input.trim(),
                createdAt: new Date().toISOString(),
            };
            // Directly update messages in context
            // You may need to expose setMessages from ChatContext or manage a local state for AI chat
            // For now, let's assume you can do:
            setMessages(prev => [...prev, userMsg]);
            setInput("");

            try {
                // 2. Prepare conversation for AI API
                const aiMessages = [
                    ...messages.map(m => ({
                        role: m.senderId === AI_USER._id ? "assistant" : "user",
                        content: m.text || "",
                    })),
                    { role: "user", content: userMsg.text }
                ];
                // 3. Call backend AI endpoint
                const { data } = await axios.post("/api/ai/generate", { messages: aiMessages });
                if (data.success) {
                    // 4. Add AI reply to UI (frontend only)
                    const aiMsg = {
                        _id: (Date.now() + 1).toString(),
                        senderId: AI_USER._id,
                        receiverId: authUser._id,
                        text: data.reply,
                        createdAt: new Date().toISOString(),
                    };
                    setMessages(prev => [...prev, aiMsg]);
                } else {
                    toast.error(data.message || "AI failed to reply");
                }
            } catch (err) {
                toast.error("AI error: " + (err?.response?.data?.message || err.message));
            }
        } else {
            // Normal user-to-user message (backend)
            await sendMessage({ text: input.trim() });
            setInput("");
        }
    }

    // Handle editing a message
    const handleEditMessage = (msg) => {
        setEditId(msg._id);
        setEditText(msg.text);
    };

    const handleEditSave = async (msgId) => {
        if (editText.trim() === "") return;
        await updateMessage(msgId, editText.trim());
        setEditId(null);
        setEditText("");
    };

    // Handle emoji click
    const handleEmojiClick = (emojiData, event) => {
        setInput(prev => prev + emojiData.emoji);
        setShowPicker(false);
    }

    // Handle sending an image
    const handleSendImage = async (e) =>{
        const file = e.target.files[0];
        if(!file || !file.type.startsWith("image/")){
            toast.error("select an image file")
            return;
        }
        const reader = new FileReader();

        reader.onloadend = async ()=>{
            await sendMessage({image: reader.result})
            e.target.value = ""
        }
        reader.readAsDataURL(file)
    }

    useEffect(()=>{
        if(selectedUser){
            getMessages(selectedUser._id)
        }
    },[selectedUser])

    useEffect(()=>{
        if(scrollEnd.current && messages){
            scrollEnd.current.scrollIntoView({ behavior: "smooth"})
        }
    },[messages])

  return selectedUser ? (
    <div className='h-full overflow-scroll relative backdrop-blur-lg'>
      {/* ------- header ------- */}
      <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
        <img src={selectedUser.profilePic || assets.avatar_icon} alt="" className="w-8 rounded-full"/>
        <p className='flex-1 text-lg text-white flex items-center gap-2'>
            {selectedUser.fullName}
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
        </p>
        <img onClick={()=> setSelectedUser(null)} src={assets.arrow_icon} alt="" className='md:hidden max-w-7'/>
        <img src={assets.help_icon} alt="" className='max-md:hidden max-w-5'/>
      </div>
      {/* ------- chat area ------- */}
      <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6'>
        {messages.map((msg, index)=>{
            // If chatting with AI, AI's messages are left, user's are right
            const isAIChat = selectedUser._id === AI_USER._id;
            const isAIMessage = isAIChat && msg.senderId === AI_USER._id;
            const isOwn = (!isAIChat && msg.senderId === authUser._id) || (isAIChat && !isAIMessage);

            return (
            <div key={index} className={`flex items-end gap-2 justify-end ${isOwn ? '' : 'flex-row-reverse'}`}>
                {msg.image ? (
                    <img src={msg.image} alt="" className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8'/>
                ) : (
                    editId === msg._id && isOwn ? (
                        <div className="flex flex-col mb-8">
                            <input
                                className="p-2 max-w-[200px] md:text-sm font-light rounded-lg break-all bg-violet-500/30 text-white border border-violet-400 outline-none mb-1"
                                value={editText}
                                onChange={e => setEditText(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') handleEditSave(msg._id); }}
                                autoFocus
                            />
                            <div className="flex gap-2">
                                <button onClick={() => handleEditSave(msg._id)} className="text-xs text-green-400">Save</button>
                                <button onClick={() => { setEditId(null); setEditText(''); }} className="text-xs text-gray-400">Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 mb-8">
                            <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg break-all bg-violet-500/30 text-white ${isOwn ? 'rounded-br-none' : 'rounded-bl-none'}`}>{msg.text}</p>
                            {isOwn && (
                                <div className="flex flex-col gap-1 ml-2 self-start">
                                    <button onClick={() => handleEditMessage(msg)} title="Edit" className="text-xs text-blue-400 bg-transparent hover:scale-110">✏️</button>
                                    <button onClick={() => deleteMessage(msg._id)} title="Delete" className="text-xs text-red-400 bg-transparent hover:scale-110">🗑️</button>
                                </div>
                            )}
                        </div>
                    )
                )}
                <div className="text-center text-xs">
                    <img src={
                        isAIChat
                        ? (isAIMessage ? AI_USER.profilePic : authUser?.profilePic || assets.avatar_icon)
                        : (msg.senderId === authUser._id ? authUser?.profilePic || assets.avatar_icon : selectedUser?.profilePic || assets.avatar_icon)
                    } alt="" className='w-7 rounded-full' />
                    <p className='text-gray-500'>
                        {msg.updatedAt && msg.updatedAt !== msg.createdAt
                            ? `updated at ${formatMessageTime(msg.updatedAt)}`
                            : `sent at ${formatMessageTime(msg.createdAt)}`
                        }
                    </p>
                </div>
            </div>
        )})}
        <div ref={scrollEnd}></div>
      </div>

{/* ------- bottom area ------- */}
    <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3'>
        <div className='flex-1 flex items-center bg-gray-100/12 px-3 rounded-full relative'>
            {/* Emoji Picker Button */}
            <button type="button" onClick={() => setShowPicker(val => !val)} className="mr-2 text-xl cursor-pointer bg-transparent border-none outline-none">😊</button>
            {/* Emoji Picker */}
            {showPicker && (
                <div className="absolute bottom-16 left-0 z-50">
                    <Picker onEmojiClick={handleEmojiClick} theme="auto" />
                </div>
            )}
            <input onChange={(e)=> setInput(e.target.value)} value={input} onKeyDown={(e)=> e.key === "Enter" ? handleSendMessage(e) : null} type="text" placeholder="Send a message" 
            className='flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400'/>
            <input onChange={handleSendImage} type="file" id='image' accept='image/png, image/jpeg' hidden/>
            <label htmlFor="image">
                <img src={assets.gallery_icon} alt="" className="w-5 mr-2 cursor-pointer"/>
            </label>
        </div>
        <img onClick={handleSendMessage} src={assets.send_button} alt="" className="w-7 cursor-pointer" />
    </div>


    </div>
  ) : (
    <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
        <img src={assets.logo_icon} className='max-w-16' alt="" />
        <p className='text-lg font-medium text-white'>Chat anytime, anywhere</p>
    </div>
  )
}

export default ChatContainer
