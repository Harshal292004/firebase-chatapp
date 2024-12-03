import React, { useContext, useEffect, useRef, useState } from 'react';
import { FaUserCircle } from "react-icons/fa";
import { GrGallery } from "react-icons/gr";
import { IoIosSend } from "react-icons/io";
import { FaSmile } from "react-icons/fa";
import { AppContext } from '../../context/AppContext';
import { arrayUnion, doc, onSnapshot, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { toast } from 'react-toastify';

const API_BASE_URL = "http://localhost:5000"; // Store this in a config file for production

const ChatBox = () => {
  const { userData, messages, setMessages, chatUser, messageId } = useContext(AppContext);
  const [input, setInput] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const messagesEndRef = useRef(null); // Reference to the end of the messages container

  // Fetching messages from Firebase
  useEffect(() => {
    if (messageId) {
      const unSub = onSnapshot(doc(db, 'messages', messageId), (res) => {
        setMessages(res.data().messages.reverse());
      });

      return () => unSub();
    }
  }, [messageId, setMessages]);

  // Scroll to the bottom of the message container whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message function
  const sendMessage = async () => {
    if (!input && !fileUrl) return toast.error("Please enter a message or upload a file.");

    try {
      if (messageId) {
        const messageData = {
          rId: chatUser.id,
          sId: userData.id,
          text: input,
          fileUrl,
          createdAt: new Date(),
        };

        // Update the messages collection with the new message
        await updateDoc(doc(db, 'messages', messageId), {
          messages: arrayUnion(messageData),
        });

        // Update the chat for both users
        await updateUserChats(messageData);
      }

      // Clear input after sending
      setInput("");
      setFileUrl("");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Update chat data for both users
  const updateUserChats = async (messageData) => {
    const userIDs = [chatUser.id, userData.id];

    for (const id of userIDs) {
      const userChatsRef = doc(db, 'chats', id);
      const userChatsSnapShot = await getDoc(userChatsRef);

      if (userChatsSnapShot.exists()) {
        const userChatData = userChatsSnapShot.data();
        const chatIndex = userChatData.chatsData.findIndex((chat) => chat.messageId === messageId);

        if (chatIndex !== -1) {
          userChatData.chatsData[chatIndex].lastMessage = messageData.text.slice(0, 30);
          userChatData.chatsData[chatIndex].updatedAt = Date.now();
          if (userChatData.chatsData[chatIndex].rId === userData.id) {
            userChatData.chatsData[chatIndex].messageSeen = false;
          }

          await updateDoc(userChatsRef, {
            chatsData: userChatData.chatsData,
          });
        }
      }
    }
  };

  // Convert timestamp to readable format
  const convertTimestamp = (timestamp) => {
    let date = timestamp.toDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const adjustedHour = hour % 12 || 12; // Convert hour to 12-hour format
    return `${adjustedHour}:${minute < 10 ? '0' : ''}${minute} ${suffix}`;
  };

  // Handle file upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (file && messageId) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch(`${API_BASE_URL}/upload`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error("File upload failed");

        const data = await response.json();
        setFileUrl(data.url);
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  // Handle input change
  const handleInputChange = (e) => setInput(e.target.value);

  return chatUser ? (
    <div className="bg-[#16213E] text-white h-screen w-1/2 flex flex-col">
      {/* Header with User info */}
      <header className="p-6 flex items-center border-b border-[#0F3460]">
        <FaUserCircle className="text-6xl text-blue-500 mr-4" />
        <img
          src={chatUser.userData.avatar || "/default-avatar.png"} // Fallback for missing avatar
          alt={chatUser.userData.name}
          className="rounded-full w-12 h-12"
        />
        <div>
          <h2 className="text-xl font-semibold">{chatUser.userData.name}</h2>
          <p className="text-sm text-gray-400">Online</p>
        </div>
      </header>

      {/* Messages Display */}
      <main className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.createdAt}
            className={`flex ${msg.sId === userData.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${msg.sId === userData.id ? 'bg-blue-600 text-white' : 'bg-[#0F3460] text-white'}`}
            >
              {msg.text}
              {msg.fileUrl && <img src={msg.fileUrl} alt="file" className="mt-2 max-w-full rounded-lg" />}
              <div className="text-xs text-gray-400 mt-1">{convertTimestamp(msg.createdAt)}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* Scrolls to the bottom */}
      </main>

      {/* Message Input Footer */}
      <footer className="p-4 border-t border-[#0F3460] bg-[#0F3460]">
        <div className="flex items-center space-x-3 bg-[#16213E] rounded-lg p-2">
          <FaSmile className="text-gray-400 cursor-pointer hover:text-blue-500" />
          <label htmlFor="file-upload" className="cursor-pointer">
            <GrGallery className="text-gray-400 cursor-pointer hover:text-blue-500" />
          </label>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="flex-grow bg-transparent text-white focus:outline-none placeholder-gray-400 px-2"
          />
          <IoIosSend className="text-blue-500 cursor-pointer hover:text-blue-400 text-2xl" onClick={sendMessage} />
        </div>
      </footer>
    </div>
  ) : (
    <div className="text-center text-white p-10">
      <img src="/empty-chat.png" alt="No user" className="w-24 h-24" />
      <p>Apparently, you are the only one using this app... showing your loneliness.</p>
    </div>
  );
};

export default ChatBox;
