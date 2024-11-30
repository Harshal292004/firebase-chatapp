import React from 'react';
import { AiOutlineLogout } from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa";
import { logout } from "../../config/firebase";
import { useNavigate } from 'react-router-dom';

const RightSideBar = () => {
  const navigate = useNavigate();
  return (
    <div className='bg-[#16213E] text-white h-screen w-1/4 flex flex-col relative'>
      <div className='p-6 flex flex-col items-center border-b border-[#0F3460]'>
        <FaUserCircle className='text-6xl text-blue-500 mb-4' />
        <h2 className='text-xl font-semibold'>John Doe</h2>
        <p className='text-gray-400'>@johndoe</p>
      </div>
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
  );
}

export default RightSideBar;