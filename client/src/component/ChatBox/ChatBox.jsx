import React, { useContext, useEffect, useState } from 'react';
import { FaUserCircle } from "react-icons/fa";
import { GrGallery } from "react-icons/gr";
import { IoIosSend } from "react-icons/io";
import { FaSmile } from "react-icons/fa";
import { AppContext } from '../../context/AppContext';
import { arrayUnion, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { toast } from 'react-toastify';

const ChatBox = () => {
  const {userData,messagesId,chatUser,messages,setMessages}=useContext(AppContext)
  const [input,setInput]= useState("")
  const sendMessage=async ()=>{
    try{
      if(input && messagesId){
        await updateDoc(doc(db,'messages',messagesId),{
          messages:arrayUnion(
            {
              sId:userData.id,
              text:input,
              createdAt:new Date()
            }
          )
        })
        const userIDs=[chatUser.rId,userData.id]
        userIDs.forEach(async(id)=>{
          const userChatsRef=doc(db,'chats',id);
          const userChatsSnapShot=await getDoc(userChatsRef)
          if(userChatsSnapShot.exsist()){
            const userChatData=userChatsSnapShot.data()
            const chatIndex =userChatData.chatsData.findIndex((c)=>c.messageId=== messagesId)
            userChatData.chatsData[chatIndex].lastMessage=input.slice(0,30)  
            userChatData.chatsData[chatIndex].updatedAt=Date.now()
            if(userChatData.chatsData[chatIndex].rId===userData.id){
              userChatData.chatsData[chatIndex].messageSeen=false
            }
            await updateDoc(
              userChatsRef,{
                chatsData : userChatData.chatsData
              }
            )
          }
        })
      }
    }catch(error){
      toast.error(error.message)
    }
  }
  useEffect(()=>{
    if(messagesId){
      const unSub= onSnapshot(doc(db,'messages',messagesId),(res)=>{
        setMessages()
      })
    }
  },[messagesId])

  return chatUser?(

    <div className='bg-[#16213E] text-white h-screen w-1/2 flex flex-col'>
      <header className='p-6 flex flex-row items-center border-b border-[#0F3460]'>
        <FaUserCircle className='text-6xl text-blue-500 mr-4' />
        <img src={chatUser.userData.avatar} alt="" />
        <div>
          <h2 className='text-xl font-semibold'>{chatUser.userData.name}</h2>
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
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Type a message...'
            className='flex-grow bg-transparent text-white focus:outline-none placeholder-gray-400 px-2'
          />
          <IoIosSend 
            className='text-blue-500 cursor-pointer hover:text-blue-400 text-2xl'
            onClick={sendMessage}
          />
        </div>
      </div>
    </div>
  ):<div className=''>
    <img src="" alt="" />
    <p>Apparently you are the only one stupid guy using this app ,this shows your loneliness </p>
  </div>
}

export default ChatBox;