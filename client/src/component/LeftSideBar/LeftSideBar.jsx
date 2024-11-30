import React, { useContext, useState } from 'react';
import { IoChatboxEllipses } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { FaUserEdit, FaSignOutAlt } from "react-icons/fa";
import { arrayUnion, collection, doc, query, serverTimestamp, updateDoc } from 'firebase/firestore';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
const LeftSideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {userData,chatsData}=useContext(AppContext) 
  const [user,setUser]=useState(null)
  const [showSearch,setShowSearch]=useState(false)
  const inputHandler=async (e)=>{
    try{
      e.preventDefault()
      const input=e.target.value;
      if(input){
        setShowSearch(true)
        const userRef=collection(db,'users')
        const q=query(userRef,where("username","==",input.toLowerCase()))
        const querySnap=await getDoc(q)
        if(!querySnap.empty && querySnap.docs[0].data().id !== userData.id){
          let userExist=false
          chatsData.map((user)=>{
            if(user.rId===querySnap.docs[0].data().id){
              userExist=true
            }
          })
          if(!userExist){
            console.log(querySnap.docs[0].data)
          setUser(querySnap.docs[0].data)
          }
          
        }
      }else{
        setUser(null)
        setShowSearch(false)
      }
    }
    catch(error){  
      console.log(error);
      
    }
  }

  const addChat=async()=>{
    const messageRef=collection(db,'messsage')
    const chatsRef=collection(db,"chats")
    try{
      const newMessageRef=doc(messageRef)
     
      await setDoc(newMessageRef,{
        createAt:serverTimestamp(),
        messages:[]
      })

      await updateDoc(doc(chatsRef,user.id),{
        chatsData:arrayUnion(
          {
            messageId:newMessageRef.id,
            lastMessage:"",
            rId:userData.id,
            updatedAt:Date.now(),
            messageSeen:true 
          }
        )
      })
      await updateDoc(doc(chatsRef,userData.id),{
        chatsData:arrayUnion(
          {
            messageId:newMessageRef.id,
            lastMessage:"",
            rId:user.id,
            updatedAt:Date.now(),
            messageSeen:true 
          }
        )
      })
    }catch(error){
      toast.error(error.message)
    }


  }

  const setChat=async (item)=>{
    console.log(item);
    

  }

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
      <div className='p-4 flex items-center bg-[#0F3460] m-4 rounded-lg'
      >
        <CiSearch className='text-gray-400 mr-2' />
        <input 
          onChange={inputHandler}
          type="text" 
          placeholder='Search chats...'
          className='bg-transparent text-white w-full focus:outline-none placeholder-gray-400' 
        />
      </div>
      <div className='list'>

        {
          showSearch && user
          ?<div className='' onClick={
            addChat
          }>
            <img src={user.avatar} alt="" />
            <p>{user.name}</p>
            <p>{user.bio}</p>
          </div>
          :chatsData.map(
            (item,index)=>(
              <div key={index} 
              onClick={()=>setChat(item)}
              className='friends'>
                <img src={item.userData.avatar} alt="" />
                <div>
                  <p>{item.userData.name}</p>
                  <p>{item.lastMessage}</p>
                </div>

              </div>
            )
          )
        }

      </div>
    </div>
  );
}

export default LeftSideBar;