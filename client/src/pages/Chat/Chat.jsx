import React from 'react'
import LeftSideBar from '../../component/LeftSideBar/LeftSideBar'
import RightSideBar from '../../component/RightSideBar/RightSideBar'
import ChatBox from '../../component/ChatBox/ChatBox'
const Chat = () => {
  return (
    <div className='flex flex-row justify-between '>
      <LeftSideBar></LeftSideBar>
      <ChatBox></ChatBox>
      <RightSideBar></RightSideBar>
    </div>
  )
}

export default Chat
