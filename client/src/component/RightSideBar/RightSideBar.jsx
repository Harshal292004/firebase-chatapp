import React, { useContext, useEffect, useState } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { logOut } from "../../config/firebase";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

const RightSideBar = () => {
  const navigate = useNavigate();
  const { messages, chatUser } = useContext(AppContext);
  const [msgImages, setMsgImages] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state for messages

  // Extract image URLs from messages (useEffect is triggered when messages change)
  useEffect(() => {
    if (messages) {
      const extractedImages = messages
        .filter((msg) => msg.image) // Filter out messages with images
        .map((msg) => msg.image); // Extract image URLs
      setMsgImages(extractedImages); // Update state
      setLoading(false); // Set loading to false when messages are processed
    }
  }, [messages]); // Dependency array to trigger the effect when messages change

  // If no chatUser is selected, display account settings and logout
  if (!chatUser) {
    return (
      <div className="bg-[#16213E] text-white h-screen w-1/4 flex flex-col">
        <div className="flex-grow p-4">
          <div
            onClick={() => navigate("/profile")}
            className="bg-[#0F3460] rounded-lg p-4 mb-4 cursor-pointer hover:bg-blue-600/20 transition"
          >
            <p>Account Settings</p>
          </div>
          <div className="bg-[#0F3460] rounded-lg p-4 mb-4 cursor-pointer hover:bg-blue-600/20 transition">
            <p>Privacy</p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <button
            className="w-full bg-[#0F3460] text-white p-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-red-600/20 transition"
            onClick={() => {
              console.log("Logging out");
              logOut();
            }}
          >
            <AiOutlineLogout className="text-xl" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    );
  }

  // If a chatUser is selected, display user info and media
  return (
    <div className="bg-[#16213E] text-white h-screen w-1/4 flex flex-col relative">
      {/* Display Chat User Info */}
      <div className="p-6 flex flex-col items-center border-b border-[#0F3460]">
        <h2 className="text-xl font-semibold">
          {chatUser.name || "Loading..."}
        </h2>
        <p className="text-gray-400">{chatUser.avatar || "No Avatar"}</p>
        <p className="text-gray-500">{chatUser.bio || "No Bio available"}</p>
      </div>

      {/* Display Media */}
      <div className="p-6">
        <p className="text-lg font-semibold">Media</p>
        <div className="grid grid-cols-3 gap-4">
          {loading ? (
            <p className="text-gray-400">Loading media...</p>
          ) : msgImages.length > 0 ? (
            msgImages.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Media ${index}`}
                className="cursor-pointer rounded-lg hover:opacity-80"
                onClick={() => window.open(url, "_blank")}
              />
            ))
          ) : (
            <p className="text-gray-400">No media available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RightSideBar;
