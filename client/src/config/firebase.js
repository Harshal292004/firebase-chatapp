import { 
  updateProfile,
  createUserWithEmailAndPassword, 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { initializeApp } from "firebase/app";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAyvUQj88mxaThwuc_UzdwI9cMoPwl3QQY",
  authDomain: "chat-app-b3ae2.firebaseapp.com",
  projectId: "chat-app-b3ae2",
  storageBucket: "chat-app-b3ae2.firebasestorage.app",
  messagingSenderId: "723388917282",
  appId: "1:723388917282:web:614e2f50fb05805125cc7b",
  measurementId: "G-724FFXFJMY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const DEFAULT_AVATAR = "https://ik.imagekit.io/7iqy97dse/default.png?updatedAt=1732947137159";
const DEFAULT_BIO = "Hey, there! I am using Chat App";

/**
 * Sign up a new user
 */
const signUp = async (userName, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    console.log(user)
    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      userName: userName.toLowerCase(),
      email,
      name: "",
      avatar: DEFAULT_AVATAR,
      bio: DEFAULT_BIO,
      lastSeen: Date.now(),
    });

    await setDoc(doc(db, "chats", user.uid), { chatsData: [] });

    toast.success("User signed up successfully!");
    return user.uid
  } catch (error) {
    const errorMsg = error.message.includes("email-already-in-use")
      ? "This email is already in use."
      : "An error occurred. Please try again.";
    toast.error(errorMsg);
  }
};

/**
 * Log in an existing user
 */
const logIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    toast.success("Logged in successfully!");
    
    return user.uid; // Return the user's unique ID
  } catch (error) {
    const errorMsg = error.code.includes("user-not-found")
      ? "User not found. Please check your email."
      : "An error occurred. Please try again.";
    toast.error(errorMsg);
    
    return null; // Return null if login fails
  }
};

/**
 * Log out the current user
 */
const logOut = async () => {
  try {
    await signOut(auth);
    toast.success("Logged out successfully!");
  } catch (error) {
    toast.error(`Logout failed: ${error.message}`);
  }
};

/**
 * Update user profile
 */
const updateUserProfile = async (id, userName, bio, profileImage) => {
  try {
    await updateProfile(auth.currentUser, {
      displayName: userName,
      photoURL: profileImage,
    });

    const userRef = doc(db, "users", id);
    await setDoc(
      userRef,
      { userName: userName.toLowerCase(), bio, avatar: profileImage, lastSeen: Date.now() },
      { merge: true }
    );

    toast.success("Profile updated successfully!");
  } catch (error) {
    toast.error("Failed to update profile. Please try again.");
  }
};

export { signUp, logIn, logOut, auth, db, updateUserProfile };
