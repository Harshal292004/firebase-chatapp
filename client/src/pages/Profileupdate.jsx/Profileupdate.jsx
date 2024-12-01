import React, { useContext, useState, useEffect } from "react";
import { auth, updateUserProfile } from "../../config/firebase";
import { FaRegUserCircle } from "react-icons/fa";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";

const DEFAULT_AVATAR = "https://ik.imagekit.io/7iqy97dse/default.png?updatedAt=1732947137159";
const API_BASE_URL = "http://localhost:5000"; // Move this to an environment config

const ProfileUpdate = () => {
  const { userData, loadUserData } = useContext(AppContext);
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState(DEFAULT_AVATAR);
  const [previewImage, setPreviewImage] = useState(DEFAULT_AVATAR);

  // Check and handle user authentication state
  const handleAuthState = () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        await loadUserData(user.uid); // Fixed `user.id` to `user.uid`
      } else {
        navigate("/");
      }
    });
  };

  useEffect(() => {
    handleAuthState();
  }, []);

  useEffect(() => {
    if (userData) {
      setUserName(userData.userName || "");
      setBio(userData.bio || "");
      setProfileImage(userData.avatar || DEFAULT_AVATAR);
      setPreviewImage(userData.avatar || DEFAULT_AVATAR);
    }
  }, [userData]);

  const handleFileChange = async (e) => {
    const avatarFile = e.target.files[0];
    if (avatarFile) {
      if (!["image/jpeg", "image/png", "image/jpg"].includes(avatarFile.type)) {
        toast.error("Only JPG and PNG files are allowed.");
        return;
      }

      try {
        const formData = new FormData();
        formData.append("avatar", avatarFile);

        const response = await fetch(`${API_BASE_URL}/upload`, {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Image upload failed");
        }
        setProfileImage(data.url);
        setPreviewImage(data.url);
        toast.success("Image uploaded successfully!");
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userName.trim()) {
      toast.error("Username is required.");
      return;
    }

    try {
      await updateUserProfile(userData.id, userName, bio, profileImage);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1A2E] flex items-center justify-center p-4">
      <div className="bg-[#16213E] rounded-xl shadow-lg flex items-center p-8 w-full max-w-4xl">
        {/* Profile Image Section */}
        <div className="flex flex-col items-center justify-center w-1/3 relative">
          <div className="relative">
            <div className="rounded-full overflow-hidden w-40 h-40 mb-4 border-2 border-gray-600">
              <img
                src={previewImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            <label
              htmlFor="profileImage"
              className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition duration-300 flex items-center justify-center"
              style={{ width: "48px", height: "48px" }}
            >
              <FaRegUserCircle size={24} />
            </label>
          </div>

          <input
            type="file"
            id="profileImage"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <p className="text-gray-400 text-sm mt-2">Upload Profile Image</p>
        </div>

        {/* Profile Form Section */}
        <form onSubmit={handleSubmit} className="flex-1 pl-8">
          <h2 className="text-2xl font-bold text-white mb-6">Profile Details</h2>

          <div className="mb-6">
            <label htmlFor="userName" className="text-gray-400 block mb-1">
              Username
            </label>
            <input
              type="text"
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your username"
              className="w-full px-4 py-3 bg-[#0F3460] text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="bio" className="text-gray-400 block mb-1">
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write something about yourself"
              className="w-full px-4 py-3 bg-[#0F3460] text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileUpdate;
