import React, { useContext, useState, useEffect } from "react";
import AppContext from '../../context/AppContext';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, serverTimestamp, arrayUnion } from "firebase/firestore"; 
import { toast } from "react-toastify";
import { IoChatboxEllipses } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { FaUserEdit, FaSignOutAlt } from "react-icons/fa";
import { logOut } from "../../config/firebase";
import { useNavigate } from "react-router-dom";

const LeftSideBar = () => {
  const {
    userData,
    chatsData,
    setChatsData,
    setMessagesId,
    setChatUser,
  } = useContext(AppContext);

  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [loadedUsers, setLoadedUsers] = useState({});
  const navigate = useNavigate();

  if (!userData) {
    return (
      <div>
        <p>Loading user data...</p>
      </div>
    );
  }

  const loadUser = async (id) => {
    // If user is already loaded, return cached version
    if (loadedUsers[id]) return loadedUsers[id];

    try {
      const userRef = doc(db, "users", id);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const fetchedUserData = userSnap.data();
        // Cache the loaded user
        setLoadedUsers(prev => ({ ...prev, [id]: fetchedUserData }));
        return fetchedUserData;
      } else {
        toast.error("User profile not found");
        return null;
      }
    } catch (error) {
      console.error("Failed to load user data", error);
      toast.error("Failed to load user data");
      return null;
    }
  };

  const inputHandler = async (e) => {
    try {
      e.preventDefault();
      const input = e.target.value.trim();

      if (input) {
        setShowSearch(true);
        const userRef = collection(db, "users");
        const q = query(userRef, where("userName", "==", input.toLowerCase()));

        const querySnap = await getDocs(q);

        // Handle search results
        if (!querySnap.empty) {
          const foundUser = querySnap.docs[0].data();
          if (foundUser.id !== userData.id) {
            setUser(foundUser);
          } else {
            setUser(null);
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

    try {
      const messageRef = collection(db, "messages");
      const chatsRef = collection(db, "chats");

      // Create a new message document
      const newMessageRef = doc(messageRef);
      await setDoc(newMessageRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      const chatData = {
        messageId: newMessageRef.id,
        lastMessage: "",
        rId: userData.id,
        updatedAt: Date.now(),
        rUserData: userData,
      };

      // Update chat list for both users
      await updateDoc(doc(chatsRef, user.id), {
        chatsData: arrayUnion(chatData),
      });

      await updateDoc(doc(chatsRef, userData.id), {
        chatsData: arrayUnion({
          ...chatData,
          rId: user.id,
          rUserData: user,
        }),
      });

      setMessagesId(newMessageRef.id);
      setChatUser(user);
      setChatsData((prevChatsData) => [...prevChatsData, user]);
      toast.success("Chat started successfully!");
    } catch (error) {
      console.error("Error while adding a new chat:", error);
      toast.error("Error starting a new chat.");
    }
  };

  const selectUserToChatWith = (selectedUser) => {
    setChatUser(selectedUser);
  };

  return (
    <div className="bg-[#16213E] text-white h-screen w-1/4 flex flex-col">
      {/* Header Section */}
      <header className="relative flex items-center h-28 justify-between p-4 border-b border-[#0F3460]">
        <div className="flex items-center space-x-2">
          <IoChatboxEllipses className="text-2xl text-blue-500" />
          <span className="text-xl font-bold">ChatApp</span>
        </div>
        <button
          className="text-gray-400 hover:text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                isOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>

        {/* Dropdown Menu */}
        <div
          className={`absolute top-full right-0 w-48 bg-[#0F3460] rounded-b-lg shadow-lg transition-all duration-300 ${isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0 invisible"}`}
        >
          {[{ icon: <FaUserEdit />, text: "Edit Profile", function: () => navigate("/profile") }, { icon: <FaSignOutAlt />, text: "Logout", function: logOut }].map((item, index) => (
            <div
              key={index}
              onClick={item.function}
              className="flex items-center space-x-2 px-4 py-3 hover:bg-blue-600/20 cursor-pointer"
            >
              {item.icon}
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </header>

      {/* Search Bar */}
      <div className="p-4 flex items-center bg-[#0F3460] m-4 rounded-lg">
        <CiSearch className="text-gray-400 mr-2" />
        <input
          onChange={inputHandler}
          type="text"
          placeholder="Search chats..."
          className="bg-transparent text-white w-full focus:outline-none placeholder-gray-400"
        />
      </div>

      {/* Chat List */}
      <div className="list">
        {showSearch && user ? (
          <div className="search-result" onClick={addChat}>
            <img src={user.avatar} alt={user.userName} className="w-12 h-12 rounded-full mr-3" />
            <div className="flex flex-col">
              <p>{user.name || user.userName || "Loading..."}</p>
            </div>
          </div>
        ) : chatsData && chatsData.length > 0 ? (
          chatsData.map((item, index) => {
            const updatedUser = loadUser(item.rId);
            return updatedUser ? (
              <div 
                key={index}
                className="friends"
                onClick={() => selectUserToChatWith(updatedUser)}
              >
                <img src={updatedUser.avatar} alt={updatedUser.userName} className="w-12 h-12 rounded-full mr-3" />
                <div className="flex flex-col">
                  <p>{updatedUser.name || updatedUser.userName || "Loading..."}</p>
                  <p className="text-gray-400 text-sm">{item.lastMessage}</p>
                </div>
              </div>
            ) : null;
          })
        ) : (
          <div className="p-4 text-center text-gray-400">No Chats Available</div>
        )}
      </div>
    </div>
  );
};

export default LeftSideBar;
