/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import ChatIcon from "../assets/chat.png";
import { createRoom, joinRoom } from "../services/RoomService";
import toast from "react-hot-toast";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router-dom";
import { isTokenExpired } from "../services/LoginService";

export default function JoinCreateChat() {
  // State for inputs and error messages
  const [formData, setFormData] = useState({
    name: "",
    roomId: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  //for Storing Values
  const {
    roomId,
    currentUser,
    connected,
    setRoomId,
    setCurrentUser,
    setConnected,
  } = useChatContext();

  //check is login or not
  useEffect(() => {
    const token = localStorage.getItem("token");
    async function isLogin() {
      try {
        if (!token || (await isTokenExpired(token))) {
          toast.error("Please Login First !!!");
          navigate("/");
        }
      } catch (error) {
        console.log(error);
      }
    }
    isLogin();
  }, []);

  //form validation
  function validateForm() {
    if (!formData.name || !formData.roomId) {
      setError("Both Fields Are Required!!!");
      return;
    }
  }

  // Combined input handler
  const handleChange = (event) => {
    const { id, value } = event.target; // Destructure id and value
    setFormData((prevData) => ({
      ...prevData,
      [id]: value, // Update the corresponding field
    }));
    setError(""); // Clear error when user starts typing
  };

  // Submit handlers
  async function handleJoinRoom() {
    validateForm();
    // Add your logic to join the room
    try {
      const response = await joinRoom(formData.roomId);
      toast.success("joined...");
      setCurrentUser(formData.name);
      setRoomId(response.roomId);
      setConnected(true);
      navigate("/chat");
    } catch (error) {
      console.error(error);
      if (error.status == 400) {
        toast.error("Room Not Found !!!");
      } else {
        toast("Error in Joining Room");
      }
    }
  }

  async function handleCreateRoom() {
    validateForm();
    // Add your logic to create the room
    try {
      const response = await createRoom(formData.roomId);
      toast.success("Room Created Successfully");
      setCurrentUser(formData.name);
      setRoomId(response.roomId);
      setConnected(true);
      //forward to chat page
      navigate("/chat");
    } catch (error) {
      console.error(error);
      if (error.status == 400) {
        toast.error("Room Already Exist !!!");
      } else {
        toast("Error in Creating Room");
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="border p-10 dark:border-gray-700 w-full flex flex-col gap-4 max-w-md rounded dark:bg-gray-900 shadow">
        <div>
          <img src={ChatIcon} alt="Chat Icon" className="w-24 mx-auto" />
        </div>
        <h1 className="text-2xl font-semibold text-center">
          Join Room / Create Room
        </h1>
        {/* Error Message */}
        {error && (
          <div className="text-red-700 bg-red-100 border border-red-400 rounded p-3 text-center font-medium">
            {error}
          </div>
        )}
        {/* Name Input */}
        <div>
          <label htmlFor="name" className="block font-medium mb-2">
            Your Name
          </label>
          <input
            type="text"
            id="name"
            placeholder="Enter the name"
            value={formData.name}
            onChange={handleChange}
            className="w-full dark:bg-gray-600 px-4 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue"
          />
        </div>
        {/* Room ID Input */}
        <div>
          <label htmlFor="roomId" className="block font-medium mb-2">
            Room Id / New Room Id
          </label>
          <input
            type="text"
            id="roomId"
            placeholder="Enter the room id"
            value={formData.roomId}
            onChange={handleChange}
            className="w-full dark:bg-gray-600 px-4 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue"
          />
        </div>
        {/* Buttons */}
        <div className="flex flex-wrap justify-between gap-4 mt-4">
          <button
            onClick={handleJoinRoom}
            className="flex-1 min-w-[100px] px-4 py-2 text-center dark:bg-blue-500 hover:dark:bg-blue-800 rounded-lg"
          >
            JOIN
          </button>
          <button
            onClick={handleCreateRoom}
            className="flex-1 min-w-[100px] px-4 py-2 text-center dark:bg-green-500 hover:dark:bg-green-800 rounded-lg"
          >
            CREATE
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              toast.success("Logout Successful");
              navigate("/");
            }}
            className="flex-1 min-w-[100px] px-4 py-2 text-center dark:bg-red-500 hover:dark:bg-red-800 rounded-lg"
          >
            LOGOUT
          </button>
        </div>
      </div>
    </div>
  );
}
