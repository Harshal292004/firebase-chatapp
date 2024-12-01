import React, { useContext, useEffect, useState } from 'react';
import LeftSideBar from '../../component/LeftSideBar/LeftSideBar';
import RightSideBar from '../../component/RightSideBar/RightSideBar';
import ChatBox from '../../component/ChatBox/ChatBox';
import { AppContext } from '../../context/AppContext';

const Chat = () => {
  const {
    userData,chatsData
  }=useContext(AppContext)
  const [loading ,setLoading]=useState(true)

  useEffect(()=>{
    if(chatsData && userData){
      setLoading(false)
    }
  },[chatsData,userData])
  return (
    <div className="min-h-screen bg-[#1A1A2E] flex items-center justify-center p-4">

      <div className='flex flex-row w-full max-w-6xl'>
        {
          loading
          ?<p>Loading...</p>
          :<>
            <LeftSideBar />
            <ChatBox />
            <RightSideBar />
          </>
        }
       
      </div>
    </div>
  );
}

export default Chat;