import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { db } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AppContext = createContext();

const USERS_COLLECTION = "users";
const CHATS_COLLECTION = "chats";

const AppContextProvider = (props) => {
  //userData stores the logged in  user's detail(single object)
  //chatsData  stores the list of the users the logged in user is in contact with userdata,updatedAt ,rid,sid
  //messageId stores the id of the currently selected chat ,used to fetch the messages for that specific chat 
  //messages contains the list of messages for the currently active chat ,fetched based on the messageId
  //chatUser stores the data of the currently selected
  const [userData, setUserData] = useState(null);
  const [chatsData, setChatsData] = useState(null);
  const [messageId, setMessageId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatUser, setChatUser] = useState(null);
  const navigate = useNavigate();

  // Load User Data and Update Last Seen
  const loadUserData = async (uid) => {
    console.log(`Loading user data for UID: ${uid}`);
    try {
      const userRef = doc(db, USERS_COLLECTION, uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const fetchedUserData = userSnap.data();
        
        console.log(`Fetched user data:`, fetchedUserData);
        console.log(`Fetched User data object keys: ${Object.keys(fetchedUserData)}`);

        setUserData(fetchedUserData);

        // Update last seen asynchronously
        await updateDoc(userRef, { lastSeen: Date.now() });
        console.log("Last seen updated");

        navigate("/chat");
      } else {
        console.log("User profile not found");
        toast.error("User profile not found");
        navigate("/");
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      toast.error("Failed to load user data");
      navigate("/");
    }
  };

  // Listen for Changes in Chat Data
  useEffect(() => {
    if (userData) {
      console.log("User data loaded, setting up chat listener");
      const chatsRef = doc(db, CHATS_COLLECTION, userData.id);
      console.log(`Chats Reference: ${chatsRef}`);
      const unsubscribe = onSnapshot(chatsRef, async (snapshot) => {
        const chatDataArray  = snapshot.data()?.chatsData || [];
        //chatDataArray 
        //[{ 
        //  "rid":"recieversid",
        //  "sid":"sendersid",
        //  "updatedAt":""
        //}]
        const processedChats = await Promise.all(
          chatDataArray.map(async (item) => {
            const userRef = doc(db, USERS_COLLECTION, item.rid);
            const userSnap = await getDoc(userRef);

            const userData = userSnap.exists() ? userSnap.data() : null;
            console.log(`Fetched user data for chat item: ${userData}`)

          })
        );
        
        console.log(`Processed chats:`, processedChats);
        // Sort chats by updatedAt (latest first)
        setChatsData(processedChats.sort((a, b) => b.updatedAt - a.updatedAt));
        console.log(`Sorted Chats Data:`, chatsData);
      });

      return () => unsubscribe();
    } else {
      console.log("No user data available, skipping chat listener setup");
    }
  }, [userData]);

  // Periodic Last Seen Updates
  const updateLastSeen = async () => {
    if (userData?.id) {
      console.log(`Updating last seen for user: ${userData.id}`);
      try {
        const userRef = doc(db, USERS_COLLECTION, userData.id);
        await updateDoc(userRef, { lastSeen: Date.now() });
        console.log("Last seen successfully updated");
      } catch (error) {
        console.error("Error updating last seen:", error);
      }
    } else {
      console.log("No user data available to update last seen");
    }
  };

  useEffect(() => {
    const intervalId = setInterval(updateLastSeen, 60000); // Update every 60 seconds
    console.log("Started last seen update interval");
    return () => {
      console.log("Clearing last seen update interval");
      clearInterval(intervalId);
    };
  }, [userData?.id]);

  // Context Value
  const value = {
    userData,
    setUserData,
    chatsData,
    setChatsData,
    loadUserData,
    messageId,
    setMessageId,
    messages,
    setMessages,
    chatUser,
    setChatUser,
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};

export default AppContextProvider;
