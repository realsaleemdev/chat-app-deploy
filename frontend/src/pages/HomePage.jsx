import { MessageSquare } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import ChatContainer from "../components/ChatContainer.jsx";
import { useChatStore } from "../store/useChatStore.js";

const NoChatSelected = () => (
  <div className="no-chat-selected">
    <div className="no-chat-icon">
      <MessageSquare size={36} />
    </div>
    <h3>Select a contact to start chatting</h3>
    <p>Choose someone from the left to begin your conversation 💬</p>
  </div>
);

export default function HomePage() {
  const { selectedUser } = useChatStore();

  return (
    <div className="app-layout">
      <Navbar />
      <div className={`main-content ${selectedUser ? "chat-active" : "sidebar-active"}`}>
        <Sidebar />
        {selectedUser ? <ChatContainer /> : <NoChatSelected />}
      </div>
    </div>
  );
}
