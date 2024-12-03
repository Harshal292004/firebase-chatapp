import React, { useContext, useEffect, useState } from 'react';
import LeftSideBar from '../../component/LeftSideBar/LeftSideBar';
import RightSideBar from '../../component/RightSideBar/RightSideBar';
import ChatBox from '../../component/ChatBox/ChatBox';
import { AppContext } from '../../context/AppContext';

const Chat = () => {
  const { userData } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set loading based on userData
    setLoading(!userData);
  }, [userData]);

  // If still loading, show a full-screen loader
  if (loading) {
    return (
      <div className="min-h-screen bg-[#1A1A2E] text-white flex items-center justify-center">
        <p>Loading ..... </p>
      </div>
    );
  }

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