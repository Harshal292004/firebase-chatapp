import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
  apiKey: "AIzaSyAyvUQj88mxaThwuc_UzdwI9cMoPwl3QQY",
  authDomain: "chat-app-b3ae2.firebaseapp.com",
  projectId: "chat-app-b3ae2",
  storageBucket: "chat-app-b3ae2.firebasestorage.app",
  messagingSenderId: "723388917282",
  appId: "1:723388917282:web:614e2f50fb05805125cc7b",
  measurementId: "G-724FFXFJMY"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Signup function
const signup = async (username, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

   

    // Save user data in Firestore
    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      username: username.toLowerCase(),
      email,
      name: "",
      avatar: "",
      bio: "Hey, there! I am using Chat App",
      lastSeen: Date.now(),
    });

    // Initialize empty chats for the user
    await setDoc(doc(db, "chats", user.uid), {
      chatData: [],
    });

    toast.success("User signed up successfully!");
  } catch (error) {
    console.error("Signup Error:", error.message);
    const errorMsg = error.message.includes("email-already-in-use")
      ? "This email is already in use."
      : "An error occurred. Please try again.";
    toast.error(errorMsg);
  }
};


const login= async (email,password)=>{
  try{
    await signInWithEmailAndPassword(auth,email,password)
  }
  catch(error){
    console.error(error)
    toast.error(error.code)
  }
}



const logout= async ()=>{
  try{
  await signOut(auth)
  }
  catch(error){
    console.error(error)
    toast.error(error.code.split('/')[1].split('-').join(" "))
  }
}

const updateProfile = async (uid, userName, bio, profileImage) => {
  try {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, { username: userName, bio, avatar: profileImage }, { merge: true });
    console.log("Profile updated successfully");
  } catch (error) {
    console.error("Error updating profile:", error);
  }
};


export {signup,login,logout,auth,db,updateProfile};
