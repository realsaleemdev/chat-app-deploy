import { useEffect, useState } from "react";
import { Search, Users } from "lucide-react";
import { useChatStore } from "../store/useChatStore.js";
import { useAuthStore } from "../store/useAuthStore.js";

const AvatarPlaceholder = ({ name, size = 46 }) => (
  <div
    className="avatar-placeholder"
    style={{ width: size, height: size, fontSize: size * 0.4 }}
  >
    {name?.charAt(0).toUpperCase() || "?"}
  </div>
);

export default function Sidebar() {
  const { users, getUsers, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [search, setSearch] = useState("");
  const [onlineOnly, setOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filtered = users.filter((u) => {
    const matchSearch = u.fullname.toLowerCase().includes(search.toLowerCase());
    const matchOnline = onlineOnly ? onlineUsers.includes(u._id) : true;
    return matchSearch && matchOnline;
  });

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">
          <Users size={16} style={{ display: "inline", marginRight: 6, verticalAlign: "middle" }} />
          Contacts
          <span style={{ marginLeft: 8, fontSize: "0.75rem", color: "var(--accent)", fontWeight: 400 }}>
            {onlineUsers.length} online
          </span>
        </div>
        <div className="search-box">
          <Search className="search-icon" size={14} />
          <input
            id="search-users"
            className="search-input"
            type="text"
            placeholder="Search contacts…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="online-filter">
        <label htmlFor="online-only-toggle">
          <input
            id="online-only-toggle"
            type="checkbox"
            checked={onlineOnly}
            onChange={(e) => setOnlineOnly(e.target.checked)}
          />
          Show online only
        </label>
      </div>

      <div className="users-list">
        {isUsersLoading ? (
          <div className="sidebar-empty">
            <div className="spinner" />
            <span>Loading contacts…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="sidebar-empty">
            <Users size={32} style={{ opacity: 0.4 }} />
            <span>{onlineOnly ? "No online users right now" : "No contacts found"}</span>
          </div>
        ) : (
          filtered.map((user) => {
            const isOnline = onlineUsers.includes(user._id);
            const isActive = selectedUser?._id === user._id;
            return (
              <div
                key={user._id}
                id={`user-${user._id}`}
                className={`user-item ${isActive ? "active" : ""}`}
                onClick={() => setSelectedUser(user)}
              >
                <div className="avatar-wrap">
                  {user.profilePic ? (
                    <img src={user.profilePic} alt={user.fullname} className="avatar" />
                  ) : (
                    <AvatarPlaceholder name={user.fullname} />
                  )}
                  {isOnline && <span className="online-dot" />}
                </div>
                <div className="user-info">
                  <div className="user-name">{user.fullname}</div>
                  <div className={`user-status ${isOnline ? "online" : ""}`}>
                    {isOnline ? "● Online" : "○ Offline"}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
