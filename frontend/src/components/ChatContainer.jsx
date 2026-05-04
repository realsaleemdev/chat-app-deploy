import { useEffect, useRef, useState } from "react";
import { User, CheckCheck, ArrowLeft } from "lucide-react";
import { useChatStore } from "../store/useChatStore.js";
import { useAuthStore } from "../store/useAuthStore.js";
import MessageInput from "./MessageInput.jsx";

const formatTime = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const formatDateLabel = (dateStr) => {
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

// Lightbox for full image view
const ImageLightbox = ({ src, onClose }) => (
  <div
    style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 300, cursor: "zoom-out"
    }}
    onClick={onClose}
  >
    <img src={src} alt="Full view" style={{ maxWidth: "90vw", maxHeight: "90vh", borderRadius: 8, objectFit: "contain" }} />
  </div>
);

export default function ChatContainer() {
  const { messages, getMessages, isMessagesLoading, selectedUser, clearUnread } = useChatStore();
  const { authUser, onlineUsers } = useAuthStore();
  const bottomRef = useRef(null);
  const [lightboxImg, setLightboxImg] = useState(null);

  const isOnline = onlineUsers.includes(selectedUser?._id);

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
      clearUnread(selectedUser._id);
    }
  }, [selectedUser?._id, getMessages, clearUnread]);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Group messages by date for day labels
  const grouped = [];
  let lastDate = "";
  messages.forEach((msg) => {
    const dateLabel = formatDateLabel(msg.createdAt);
    if (dateLabel !== lastDate) {
      grouped.push({ type: "label", label: dateLabel, key: dateLabel + msg._id });
      lastDate = dateLabel;
    }
    grouped.push({ type: "message", msg });
  });

  return (
    <div className="chat-area">
      {/* Chat Header */}
      <div className="chat-header">
        <button 
          className="back-btn mobile-only" 
          onClick={() => useChatStore.getState().setSelectedUser(null)}
          title="Back"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="avatar-wrap">
          {selectedUser?.profilePic ? (
            <img src={selectedUser.profilePic} alt={selectedUser.fullname} className="avatar" />
          ) : (
            <div className="avatar-placeholder">
              {selectedUser?.fullname?.charAt(0).toUpperCase() || <User size={20} />}
            </div>
          )}
          {isOnline && <span className="online-dot" />}
        </div>
        <div className="chat-header-info">
          <div className="chat-header-name">{selectedUser?.fullname}</div>
          <div className={`chat-header-status ${isOnline ? "online" : ""}`}>
            {isOnline ? "Online" : "Offline"}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="messages-area" id="messages-area">
        {isMessagesLoading ? (
          <div style={{ display: "flex", justifyContent: "center", paddingTop: "2rem" }}>
            <div className="spinner" />
          </div>
        ) : messages.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, color: "var(--text-muted)", gap: "0.5rem", marginTop: "2rem" }}>
            <div style={{ fontSize: "2rem" }}>💬</div>
            <p style={{ fontSize: "0.88rem" }}>No messages yet. Say hi!</p>
          </div>
        ) : (
          grouped.map((item) => {
            if (item.type === "label") {
              return (
                <div key={item.key} style={{ display: "flex", justifyContent: "center" }}>
                  <span className="message-day-label">{item.label}</span>
                </div>
              );
            }

            const { msg } = item;
            const isSent = msg.senderId === authUser._id;

            return (
              <div key={msg._id} className={`message-row ${isSent ? "sent" : "received"}`}>
                {/* Avatar for received */}
                {!isSent && (
                  <div className="avatar-wrap" style={{ alignSelf: "flex-end", marginRight: 6 }}>
                    {selectedUser?.profilePic ? (
                      <img src={selectedUser.profilePic} alt="" className="avatar" style={{ width: 28, height: 28 }} />
                    ) : (
                      <div className="avatar-placeholder" style={{ width: 28, height: 28, fontSize: 12 }}>
                        {selectedUser?.fullname?.charAt(0)}
                      </div>
                    )}
                  </div>
                )}

                <div className="message-bubble">
                  {/* Image */}
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="Sent image"
                      className="message-image"
                      onClick={() => setLightboxImg(msg.image)}
                    />
                  )}
                  {/* Text */}
                  {msg.text && <p>{msg.text}</p>}
                  {/* Meta: time + ticks */}
                  <div className="message-meta">
                    <span>{formatTime(msg.createdAt)}</span>
                    {isSent && (
                      <span className="tick-icon" title="Delivered">
                        <CheckCheck size={14} color={msg.seen ? "#53bdeb" : "rgba(255,255,255,0.4)"} />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <MessageInput />

      {/* Lightbox */}
      {lightboxImg && <ImageLightbox src={lightboxImg} onClose={() => setLightboxImg(null)} />}
    </div>
  );
}
