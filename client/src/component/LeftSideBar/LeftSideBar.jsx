import React, { useContext, useState } from 'react';
import { IoChatboxEllipses } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { FaUserEdit, FaSignOutAlt } from "react-icons/fa";
import { arrayUnion, collection, doc, query, serverTimestamp, updateDoc, where, getDocs, setDoc } from 'firebase/firestore';
import { AppContext } from '../../context/AppContext';
import { db } from '../../config/firebase'; // Ensure db is imported
import { toast } from 'react-toastify';

const LeftSideBar = () => {
  console.log("--------------------------------------------------");
  console.log("LeftSideBar Component Rendered");

  const [isOpen, setIsOpen] = useState(false);
  const { 

    userData,
    setUserData,
    chatsData,
    setChatsData,
    loadUserData,
    messagesId,
    setMessagesId,
    messages,
    setMessages,
    chatUser,
    setChatUser,
   } = useContext(AppContext);

  const [user, setUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  const inputHandler = async (e) => {
    try {
      e.preventDefault();
      const input = e.target.value.trim();

      console.log(`Search input received: "${input}"`);
      
      if (input) {
        setShowSearch(true);
        console.log("Initiating search...");

        const userRef = collection(db, 'users');
        const q = query(userRef, where("userName", "==", input.toLowerCase()));

        const querySnap = await getDocs(q);

        if (!querySnap.empty) {
          const foundUser = querySnap.docs[0].data();
          if (foundUser.id !== userData.id) {
            setUser(foundUser);
          } else {
            setUser(null); // Don't show current user in search results
          }
        } else {
          setUser(null);
        }
      } else {
        setShowSearch(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Error while handling the search input:", error);
    }
  };

  const addChat = async () => {
    if (!user) return;
    const messageRef = collection(db, 'messages');
    const chatsRef = collection(db, "chats");
    try {
      const newMessageRef = doc(messageRef);
      await setDoc(newMessageRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      // Add the new message reference to both users' chats
      await updateDoc(doc(chatsRef, user.id), {
        chatsData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "Start a conversation",
          sId: userData.id,
          updatedAt: Date.now(),
          messageSeen: true,
        })
      });

      await updateDoc(doc(chatsRef, userData.id), {
        chatsData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "Start a conversation",
          rId: user.id,
          updatedAt: Date.now(),
          messageSeen: true,
        })
      });

      setMessagesId(newMessageRef.id);
      setChatUser(user);
      setChatsData((prevChatsData)=>prevChatsData.push(user))
      toast.success('Chat started successfully!');
    } catch (error) {
      console.error("Error while adding a new chat:", error);
      toast.error("Error starting a new chat.");
    }
  };



  return (
    <div className='bg-[#16213E] text-white h-screen w-1/4 flex flex-col'>
      <header className='relative flex flex-row items-center h-28 justify-between p-4 border-b border-[#0F3460]'>
        <div className='flex items-center space-x-2'>
          <IoChatboxEllipses className='text-2xl text-blue-500' />
          <span className='text-xl font-bold'>ChatApp</span>
        </div>
        <button
          className="text-gray-400 hover:text-white focus:outline-none"
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
        <div className={`absolute top-full right-0 w-48 bg-[#0F3460] rounded-b-lg shadow-lg transition-all duration-300 ${isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 invisible'} overflow-hidden z-10`}>
          {[{ icon: <FaUserEdit />, text: 'Edit Profile' }, { icon: <FaSignOutAlt />, text: 'Logout' }].map((item, index) => (
            <div key={index} className='flex items-center space-x-2 px-4 py-3 hover:bg-blue-600/20 cursor-pointer'>
              {item.icon}
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </header>
      <div className='p-4 flex items-center bg-[#0F3460] m-4 rounded-lg'>
        <CiSearch className='text-gray-400 mr-2' />
        <input
          onChange={inputHandler}
          type="text"
          placeholder='Search chats...'
          className='bg-transparent text-white w-full focus:outline-none placeholder-gray-400'
        />
      </div>
      <div className='list'>
        {showSearch && user ? (
          <div className='search-result' onClick={addChat}>
            <div className='flex flex-row space-x-3 items-center cursor-pointer border border-blue-50 rounded-md outline-offset-1'>
              <img className='w-10 h-10' src={user.avatar} alt="User Avatar" />
              <div className='flex flex-col'>
                <p>{user.name ? user.name : "@" + user.userName}</p>
                <p className='text-gray-400'>{user.bio.slice(0, 10)}..</p>
              </div>
            </div>
          </div>
        ) : (
          chatsData && chatsData.length > 0 ? (
            chatsData.map((item, index) => (
              <div key={index}  className='friends flex items-center cursor-pointer p-3 border-b border-gray-700 hover:bg-[#0F3460]'>
                <img src={item.userData.avatar} alt="User Avatar" className="w-12 h-12 rounded-full mr-3" />
                <div className='flex flex-col'>
                  <p>{item.userData.name ? item.userData.name : item.userData.userName}</p>
                  <p className='text-gray-400 text-sm'>{item.lastMessage}</p>
                </div>
              </div>
            ))
          ) : (
            <div className='p-4 text-center text-gray-400'>No Chats Available</div>
          )
        )}
      </div>
    </div>
  );
};

export default LeftSideBar;
