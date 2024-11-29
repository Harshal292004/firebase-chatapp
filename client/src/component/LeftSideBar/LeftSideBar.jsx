import React, { useState } from 'react';
import { IoChatboxEllipses } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { FaUserEdit, FaSignOutAlt } from "react-icons/fa";


const LeftSideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className='bg-[#16213E] text-white h-screen w-80 flex flex-col'>
        <header className='relative flex flex-row items-center justify-between p-4 border-b border-[#0F3460]'>
            <div className='flex items-center space-x-2'>
                <IoChatboxEllipses className='text-2xl text-blue-500' />
                <span className='text-xl font-bold'>ChatApp</span>
            </div>
            
            <button
                className="md:hidden text-gray-400 hover:text-white focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
                    />
                </svg>
            </button>
            
            <div 
                className={`absolute top-full right-0 w-48 bg-[#0F3460] rounded-b-lg shadow-lg 
                transition-all duration-300 ${isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 invisible'} 
                overflow-hidden z-10`}
            >
                {[
                    { icon: <FaUserEdit />, text: 'Edit Profile' },
                    { icon: <FaSignOutAlt />, text: 'Logout' }
                ].map((item, index) => (
                    <div 
                        key={index}
                        className='flex items-center space-x-2 px-4 py-3 hover:bg-blue-600/20 cursor-pointer'
                        onClick={() => {}}
                    >
                        {item.icon}
                        <span>{item.text}</span>
                    </div>
                ))}
            </div>
        </header>
        
        <div className='p-4 flex items-center bg-[#0F3460] m-4 rounded-lg'>
            <CiSearch className='text-gray-400 mr-2' />
            <input 
                type="text" 
                placeholder='Search chats...'
                className='bg-transparent text-white w-full focus:outline-none placeholder-gray-400' 
            />
        </div>
    </div>
  );
}

export default LeftSideBar;