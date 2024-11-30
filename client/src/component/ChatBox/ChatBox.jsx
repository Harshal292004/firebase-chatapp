import React, { useState } from 'react';
import { FaUserCircle } from "react-icons/fa";
import { GrGallery } from "react-icons/gr";
import { IoIosSend } from "react-icons/io";
import { FaSmile } from "react-icons/fa";

const ChatBox = () => {
  const [message, setMessage] = useState('');

  const messages = [
    { id: 1, text: 'Hello there!', sent: true },
    { id: 2, text: 'Hi, how are you?', sent: false },
    { id: 3, text: 'I\'m doing great, thanks for asking!', sent: true },
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  return (
    <div className='bg-[#16213E] text-white h-screen w-1/2 flex flex-col'>
      <header className='p-6 flex flex-row items-center border-b border-[#0F3460]'>
        <FaUserCircle className='text-6xl text-blue-500 mr-4' />
        <div>
          <h2 className='text-xl font-semibold'>John Doe</h2>
          <p className='text-sm text-gray-400'>Online</p>
        </div>
      </header>
      <main className='flex-grow overflow-y-auto p-4 space-y-4'>
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.sent ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[70%] p-3 rounded-lg 
              ${msg.sent 
                ? 'bg-blue-600 text-white' 
                : 'bg-[#0F3460] text-white'}`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </main>
      <div className='p-4 border-t border-[#0F3460] bg-[#0F3460]'> 
        <div className='flex items-center space-x-3 bg-[#16213E] rounded-lg p-2'>
          <FaSmile className='text-gray-400 cursor-pointer hover:text-blue-500' />
          <GrGallery className='text-gray-400 cursor-pointer hover:text-blue-500' />
          <input 
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder='Type a message...'
            className='flex-grow bg-transparent text-white focus:outline-none placeholder-gray-400 px-2'
          />
          <IoIosSend 
            onClick={handleSendMessage}
            className='text-blue-500 cursor-pointer hover:text-blue-400 text-2xl'
          />
        </div>
      </div>
    </div>
  );
}

export default ChatBox;