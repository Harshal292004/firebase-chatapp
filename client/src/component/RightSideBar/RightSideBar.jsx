import React, { useContext, useEffect, useState } from 'react';
import { AiOutlineLogout } from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa";
import { logout } from "../../config/firebase";
import { useNavigate } from 'react-router-dom';
import {AppContext} from '../../context/AppContext'

const RightSideBar = () => {
  const navigate = useNavigate();
  const {chatUser,messages}=useContext(AppContext)
  const[msgImages,setMsgImages]=useState([])
  useEffect(
    ()=>{
      let tempVar=[]
      messages.map((msg)=>{
        if(msg.image){
          tempVar.push(msg.image)
        }
      })

      setMsgImages(tempVar)

    },[messages]
  )
  return chatUser ?(
    <div className='bg-[#16213E] text-white h-screen w-1/4 flex flex-col relative'>
      <div className='p-6 flex flex-col items-center border-b border-[#0F3460]'>
        <FaUserCircle className='text-6xl text-blue-500 mb-4' />
        <h2 className='text-xl font-semibold'>{chatUser.userData.avatar}</h2>
        <p className='text-gray-400'>{chatUser.userData.avatar}</p>
        <p className='text-gray-500'>{chatUser.userData.bio}</p>
      </div>
      <div>
        <p>Media</p>
        {msgImages.map(
          (url,index)=>{

            <img src={url} key={index} onClick={()=>window.open(url)} />

          }
        )}
      </div>
    </div>
  ):(
    <div className=''>
      <div className='flex-grow p-4'>
        <div 
          onClick={() => {
            navigate('/profile');
          }}
          className='bg-[#0F3460] rounded-lg p-4 mb-4 cursor-pointer hover:bg-blue-600/20 transition'
        >
          <p>Account Settings</p>
        </div>
        <div className='bg-[#0F3460] rounded-lg p-4 mb-4 cursor-pointer hover:bg-blue-600/20 transition'>
          <p>Privacy</p>
        </div>
      </div>
      <div className='absolute bottom-0 left-0 right-0 p-4'>
        <button 
          className='w-full bg-[#0F3460] text-white p-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-red-600/20 transition'
          onClick={() => {
            console.log('Logging out');
            logout();
          }}
        >
          <AiOutlineLogout className='text-xl' />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

export default RightSideBar;