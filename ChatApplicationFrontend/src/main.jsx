import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./config/AppRoutes.jsx";
import { Toaster } from "react-hot-toast";
import { ChatProvider } from "./context/ChatContext.jsx";

createRoot(document.getElementById("root")).render(
  <Router>
    <Toaster />
    <ChatProvider>
      <AppRoutes />
    </ChatProvider>
  </Router>
);