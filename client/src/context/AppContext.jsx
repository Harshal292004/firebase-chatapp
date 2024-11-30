import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { createContext, useEffect, useRef, useState } from "react";
import { db } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const [userData, setUserData] = useState(null);
    const [chatData, setChatData] = useState(null);
    const navigate = useNavigate();

    const loadUserData = async (uid) => {
        try {
            const userRef = doc(db, 'users', uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const userData = userSnap.data();
                setUserData(userData);
                if (!userData.avatar || !userData.name) {
                    navigate("/profile");
                    toast.warning("Please complete your profile");
                } else {
                    navigate("/chat");
                }

                // Update last seen asynchronously without blocking
                updateDoc(userRef, { lastSeen: Date.now() }).catch(console.error);
            } else {
                toast.error("User profile not found");
                navigate("/");
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            toast.error("Failed to load user data");
            navigate("/");
        }
    };

    useEffect(()=>{
        if(userData){
            const chatRef=doc(db,'chats',userData.id)
            const unSub= onSnapshot(chatRef,async(res)=>{
                const chatItems=res.data().chatData()
                const tempData=[]

                for(const item of chatItems){
                    //recievers id 

                    const userRef=doc(db,'users',item.rId)
                    const userSnap=await getDoc(userRef)
                    const userData= userSnap.data()
                    tempData.push({...item,userData})
                }
                setChatData(tempData.sort((a,b)=>b.updatedAt-a.updatedAt))
            })

            return ()=>{
                unSub()
            }

        }
    },[userData])

    // Simplified last seen update
    const updateLastSeen = async () => {
        if (userData?.uid) {
            const userRef = doc(db, 'users', userData.uid);
            await updateDoc(userRef, { lastSeen: Date.now() });
        }
    };

    useEffect(() => {
        const intervalId = setInterval(updateLastSeen, 60000);
        return () => clearInterval(intervalId);
    }, [userData?.uid]);

    const value = {
        userData, 
        setUserData,
        chatData, 
        setChatData,
        loadUserData
    };
    
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;