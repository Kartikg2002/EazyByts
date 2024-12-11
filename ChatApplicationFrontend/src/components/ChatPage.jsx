/* eslint-disable react-hooks/exhaustive-deps */
import { MdSend } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import ChatImg from "../assets/chat.png";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import toast from "react-hot-toast";
import { getMessages } from "../services/RoomService";
import { timeAgo } from "../config/helper";
import { isTokenExpired } from "../services/LoginService";

export default function ChatPage() {
  const {
    roomId,
    currentUser,
    connected,
    setRoomId,
    setCurrentUser,
    setConnected,
  } = useChatContext();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatBoxRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);
  const token = localStorage.getItem("token");

  // Check if logged in
  useEffect(() => {
    async function isLogin() {
      try {
        if (!token || (await isTokenExpired(token))) {
          navigate("/");
        }
      } catch (error) {
        console.log(error);
      }
    }
    isLogin();
  }, []);

  useEffect(() => {
    if (!connected) {
      navigate("/join");
    }
  }, [roomId, currentUser, connected]);

  // Scroll Down
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scroll({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // Load initial messages
  useEffect(() => {
    async function loadMessage() {
      try {
        const messages = await getMessages(roomId);
        setMessages(messages);
      } catch (error) {
        console.log(error);
      }
    }
    if (connected) {
      loadMessage();
    }
  }, [connected, roomId]);

  // WebSocket Connection
  useEffect(() => {
    const connectWebSocket = () => {
      const sock = new SockJS(
        `http://localhost:9906/chat?token=${token}`,
        null,
        {
          transports: ["xhr-streaming", "xhr-polling"],
        }
      );

      const client = Stomp.over(sock);

      client.connect(
        {},
        () => {
          setStompClient(client);
          toast.success("Connected to WebSocket");
          client.subscribe(`/topic/room/${roomId}`, (message) => {
            const newMessage = JSON.parse(message.body);
            setMessages((prevMessages) => [...prevMessages, newMessage]);
          });
        },
        (error) => {
          console.error("WebSocket connection error:", error);
          toast.error("WebSocket connection failed!");
        }
      );
    };

    if (connected) {
      connectWebSocket();
    }
  }, [roomId, connected]);

  // Send Message
  async function sendMessage() {
    if (stompClient && connected && input.trim()) {
      const message = {
        sender: currentUser,
        content: input,
        roomId: roomId,
      };
      stompClient.send(
        `/app/sendMessage/${roomId}`,
        {},
        JSON.stringify(message)
      );
      setInput("");
    }
  }

  // Logout and disconnect WebSocket
  const handleLogout = () => {
    if (stompClient) {
      stompClient.disconnect();
    }
    setConnected(false);
    setRoomId("");
    setCurrentUser("");
    navigate("/join");
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="dark:border-gray-700 shadow py-4 px-6 fixed w-full dark:bg-gray-900 flex flex-wrap justify-between items-center z-10">
        <h1 className="text-sm sm:text-base font-semibold">
          Room: <span className="text-gray-400">{roomId}</span>
        </h1>
        <h1 className="text-sm sm:text-base font-semibold">
          User: <span className="text-gray-400">{currentUser}</span>
        </h1>
        <button
          onClick={handleLogout}
          className="dark:bg-red-500 dark:hover:bg-red-700 px-3 py-2 rounded-lg text-sm"
        >
          Leave Room
        </button>
      </header>
      <main
        ref={chatBoxRef}
        className="pt-20 px-4 sm:px-10 border w-full sm:w-full dark:bg-slate-600 mx-auto h-screen py-20 overflow-auto"
      >
        <div className="message_container">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender === currentUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`my-2 p-3 rounded max-w-xs sm:max-w-md w-auto ${
                  message.sender === currentUser
                    ? "bg-green-800"
                    : "bg-gray-800"
                }`}
              >
                <div className="flex items-start gap-2">
                  <img
                    className="h-8 w-8 sm:h-10 sm:w-10 rounded-full"
                    src={ChatImg}
                    alt=""
                  />
                  <div>
                    <p className="text-xs sm:text-sm font-bold">
                      {message.sender}
                    </p>
                    <p className="text-sm sm:text-base break-words">
                      {message.content}
                    </p>
                    <p className="text-xs text-gray-400">
                      {timeAgo(message.timestamp)}
                    </p>
                    {/* Display file name if available */}
                    {message.file && (
                      <p className="text-xs text-gray-400 mt-1">
                        File: {message.file.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <div className="absolute bottom-4 w-full flex justify-center items-center px-2 sm:px-4">
        <div className="h-full flex items-center justify-between gap-2 px-4 sm:px-6 py-2 border dark:bg-gray-900 rounded-lg w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
          {/* Input field with selected file */}
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                sendMessage();
              }
            }}
            type="text"
            placeholder="Enter Your Message"
            className="flex-grow dark:border-gray-600 dark:bg-gray-800 rounded-full px-4 py-2 focus:outline-none text-sm sm:text-base"
          />
          <button
            onClick={() => sendMessage()}
            className="flex-shrink-0 dark:bg-green-600 hover:dark:bg-green-700 h-10 w-10 flex justify-center items-center rounded-full"
          >
            <MdSend size="20" />
          </button>
        </div>
      </div>
    </div>
  );
}
