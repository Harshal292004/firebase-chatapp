import { doc, getDoc, onSnapshot, updateDoc, collection } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { db } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AppContext = createContext();

const USERS_COLLECTION = "users";
const CHATS_COLLECTION = "chats";
const MESSAGES_COLLECTION = "messages";

const AppContextProvider = (props) => {
  // State Variables
  const [userData, setUserData] = useState(null);
  const [messageId, setMessageId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatsData, setChatsData] = useState([]);
  const [chatUser, setChatUser] = useState(null);

  const navigate = useNavigate();


  useEffect(() => {
    console.log("userData updated:", userData);
  }, [userData]);




  /**
   * Utility: Fetch a document from Firestore
   * @param {string} collectionName - Firestore collection name
   * @param {string} id - Document ID
   * @returns {object|null} Document data or null if not found
   */
  const fetchDocument = async (collectionName, id) => {
    try {
      const ref = doc(db, collectionName, id);
      const snap = await getDoc(ref);
      return snap.exists() ? snap.data() : null;
    } catch (error) {
      console.error(`Error fetching document from ${collectionName}:`, error);
      return null;
    }
  };

  /**
   * Load Logged-In User's Data and Update `lastSeen`
   * @param {string} id - User ID
   */
  const loadUserData = async (id) => {
    console.log(`Loading user data for UID: ${id}`); // Verify the ID being passed
    try {
      const fetchedUserData = await fetchDocument(USERS_COLLECTION, id);
      
      console.log("Fetched User Data:", fetchedUserData); // Log the exact data returned
      
      const keys=Object.keys(fetchedUserData)
      const ConstructedObject={
        "id":fetchedUserData[id],
        "userName":fetchedUserData[userName],
        "email":fetchedUserData[email],
        "name":fetchedUserData[name],
        "avatar":fetchedUserData[avatar],
        "bio":fetchedUserData[bio],
        "lastSeen":fetchedUserData[lastSeen]
      }
      console.log(typeof(keys))
      console.log(`keys : ${keys}`)
      if (ConstructedObject) {
        setUserData(ConstructedObject);
        console.log("User Data after setting:", userData); // This might be async, so might not reflect immediately
      } else {
        console.warn("No user data found for the given ID");
      }
  
      updateLastSeen();
  
    } catch (error) {
      console.error("Error loading user data:", error);
      toast.error("Failed to load user data.");
      navigate("/");
    }
  };


  /**
   * Real-Time Listener for `chatsData` (friends list)
   */
  useEffect(() => {
    if (!userData?.id) return;

    console.log("Setting up listener for `chatsData` (friends list).");
    const chatsRef = doc(db, CHATS_COLLECTION, userData.id);

    const unsubscribe = onSnapshot(
      chatsRef,
      (snapshot) => {
        const chatDataArray = snapshot.data()?.chatsData || [];
        console.log("ChatsData updated:", chatDataArray);

        // Sort by the most recent `updatedAt` value
        setChatsData(chatDataArray.sort((a, b) => b.updatedAt - a.updatedAt));
      },
      (error) => {
        console.error("Error in chatsData listener:", error);
        toast.error("Failed to load chats data.");
      }
    );

    return () => {
      console.log("Cleaning up `chatsData` listener.");
      unsubscribe();
    };
  }, [userData]);

  /**
   * Real-Time Listener for `messages` (active chat)
   */
  useEffect(() => {
    if (!messageId) return;

    console.log(`Setting up listener for messages with messageId: ${messageId}`);
    const messagesRef = collection(db, MESSAGES_COLLECTION, messageId, "chat");

    const unsubscribe = onSnapshot(
      messagesRef,
      (snapshot) => {
        const newMessages = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        console.log("Messages updated:", newMessages);

        setMessages(newMessages);
      },
      (error) => {
        console.error("Error in messages listener:", error);
        toast.error("Failed to load messages.");
      }
    );

    return () => {
      console.log("Cleaning up `messages` listener.");
      unsubscribe();
    };
  }, [messageId]);

  /**
   * Update the user's `lastSeen` field in Firestore
   */
  const updateLastSeen = async () => {
    if (!userData?.id) {
      console.warn("No user data available to update last seen.");
      return;
    }

    try {
      const userRef = doc(db, USERS_COLLECTION, userData.id);
      await updateDoc(userRef, { lastSeen: Date.now() });
      console.log("Last seen successfully updated.");
    } catch (error) {
      console.error("Error updating last seen:", error);
    }
  };

  /**
   * Periodically Update `lastSeen` Every 60 Seconds
   */
  useEffect(() => {
    const intervalId = setInterval(updateLastSeen, 60000); // Update every 60 seconds
    console.log("Started last seen update interval.");
    return () => {
      console.log("Clearing last seen update interval.");
      clearInterval(intervalId);
    };
  }, [userData]);

  /**
   * Context Value: Exposes state variables and functions to the app
   */
  const value = {
    userData,
    setUserData,
    loadUserData,
    chatsData,
    setChatsData,
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
