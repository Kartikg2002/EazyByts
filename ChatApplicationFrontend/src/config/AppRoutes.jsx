import { Routes, Route } from "react-router-dom";
import App from "../App.jsx";
import ChatPage from "../components/ChatPage.jsx";
import JoinCreateChat from "../components/JoinCreateChat.jsx";
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/join" element={<JoinCreateChat />} />
      <Route path="/chat" element={<ChatPage />} />
    </Routes>
  );
}
