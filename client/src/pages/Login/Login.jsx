import React, { useContext, useState, useEffect } from 'react';
import { signUp, logIn, auth } from '../../config/firebase';
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
    const [loading, setLoading] = useState(false); // Add a loading state for better UX
    
    const navigate = useNavigate();
    const { loadUserData } = useContext(AppContext);

    const checkAuthState = () => {
        console.log("Checking auth state...");
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    console.log(`User authenticated: ${JSON.stringify(user)}`);
                    console.log(`User UID: ${user.uid}`);
                    await loadUserData(user.uid);
                    navigate("/chat");
                } catch (error) {
                    console.error("Failed to load user data:", error);
                    toast.error("Failed to load user data");
                }
            } else {
                console.log("No user authenticated");
            }
        });
    };
    
    useEffect(() => {
        console.log("Initializing auth state check...");
        checkAuthState();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading to true when submitting the form
        console.log("Form submitted, starting validation...");

        // Input validation
        if (!email || !password) {
            console.log("Validation failed: Missing email or password");
            toast.error("Please fill in all fields");
            setLoading(false); // Reset loading when validation fails
            return;
        }

        if (currState === "Sign Up" && !userName) {
            console.log("Validation failed: Missing username for signup");
            toast.error("Username is required for Sign Up");
            setLoading(false);
            return;
        }

        if (!termsAccepted) {
            console.log("Validation failed: Terms not accepted");
            toast.error("Please accept the terms and conditions");
            setLoading(false);
            return;
        }

        try {
            console.log(`Processing ${currState === "Sign Up" ? "Sign Up" : "Login"}...`);
            if (currState === "Sign Up") {
                const user = await signUp(userName, email, password);
                console.log(`User signed up: ${user ? user.uid : 'No user returned'}`);
                if (user) {
                    await loadUserData(user.uid);
                    navigate("/chat");
                }
            } else {
                const user = await logIn(email, password);
                console.log(`User logged in: ${user ? user.uid : 'No user returned'}`);
                if (user) {
                    await loadUserData(user.uid);
                    navigate("/chat");
                }
            }
        } catch (error) {
            console.error("Authentication error:", error);
            toast.error(error.message || "Authentication failed");
        } finally {
            console.log("Authentication process complete");
            setLoading(false); // Reset loading once authentication is done
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
                    disabled={loading} // Disable button while loading
                >
                    {loading ? "Processing..." : currState === "Sign Up" ? "Sign Up" : "Login"}
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
