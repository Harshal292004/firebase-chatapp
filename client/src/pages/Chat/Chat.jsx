import React from 'react';
import LeftSideBar from '../../component/LeftSideBar/LeftSideBar';
import RightSideBar from '../../component/RightSideBar/RightSideBar';
import ChatBox from '../../component/ChatBox/ChatBox';

const Chat = () => {
  return (
    <div className="min-h-screen bg-[#1A1A2E] flex items-center justify-center p-4">
      <div className='flex flex-row w-full max-w-6xl'>
        <LeftSideBar />
        <ChatBox />
        <RightSideBar />
      </div>
    </div>
  );
}

export default Chat;