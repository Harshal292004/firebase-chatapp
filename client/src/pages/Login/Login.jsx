import React, { useContext, useState, useEffect } from 'react';
import { signup, login, auth } from '../../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
    const [currState, setCurrState] = useState("Sign Up");
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [termsAccepted, setTermsAccepted] = useState(false);
    
    const navigate = useNavigate();
    const { loadUserData } = useContext(AppContext);

    const checkAuthState = () => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    await loadUserData(user.uid);
                    navigate("/chat");
                } catch (error) {
                    toast.error("Failed to load user data");
                }
            }
        });
    };
    
    useEffect(() => {
        checkAuthState();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Input validation
        if (!email || !password) {
            toast.error("Please fill in all fields");
            return;
        }

        if (currState === "Sign Up" && !userName) {
            toast.error("Username is required for Sign Up");
            return;
        }

        if (!termsAccepted) {
            toast.error("Please accept the terms and conditions");
            return;
        }

        try {
            if (currState === "Sign Up") {
                const user = await signup(userName, email, password);
                if (user) {
                    await loadUserData(user.uid);
                    navigate("/chat");
                }
            } else {
                const user = await login(email, password);
                if (user) {
                    await loadUserData(user.uid);
                    navigate("/chat");
                }
            }
        } catch (error) {
            toast.error(error.message || "Authentication failed");
        }
    };

    return (
        <div className="min-h-screen bg-[#1A1A2E] flex items-center justify-center p-4">
            <form 
                onSubmit={handleSubmit}
                className="bg-[#16213E] rounded-xl shadow-lg p-8 w-full max-w-md"
            >
                <h2 className="text-3xl font-bold text-center text-white mb-6">
                    {currState}
                </h2>
                
                {currState === "Sign Up" && (
                    <input 
                        onChange={(e) => setUserName(e.target.value)}
                        value={userName}
                        type="text" 
                        placeholder='Username' 
                        className="w-full px-4 py-3 mb-4 bg-[#0F3460] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                )}
                
                <input 
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    value={email} 
                    placeholder='Email address' 
                    className="w-full px-4 py-3 mb-4 bg-[#0F3460] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
                
                <input 
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    value={password} 
                    placeholder='Password' 
                    className="w-full px-4 py-3 mb-4 bg-[#0F3460] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
                
                <button 
                    type='submit' 
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 mb-4"
                >
                    {currState === "Sign Up" ? "Sign Up" : "Login"}
                </button>
                
                <div className="flex items-center mb-4">
                    <input 
                        type="checkbox" 
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="mr-2 text-blue-600 bg-[#0F3460] border-gray-300 rounded focus:ring-blue-500"
                    />
                    <p className="text-gray-300 text-sm">
                        Agree to the terms of use and privacy policy
                    </p>
                </div>
                
                <div className="text-center">
                    <p className="text-gray-400">
                        {currState === "Sign Up" ? "Already have an account?" : "Don't have an account?"}
                        <span 
                            onClick={() => setCurrState(prevState => prevState === "Sign Up" ? "Login" : "Sign Up")}
                            className="text-blue-500 ml-2 cursor-pointer hover:underline"
                        >
                            Click here
                        </span>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default Login;