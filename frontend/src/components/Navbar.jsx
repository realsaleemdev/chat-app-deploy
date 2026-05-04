import { useState, useRef, useEffect } from "react";
import { MessageSquare, LogOut, User, Camera, X, Settings, Edit2, Check, Trash2, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.js";

export default function Navbar() {
  const { authUser, logout, updateProfile, isUpdatingProfile, deleteAccount } = useAuthStore();
  const [showProfile, setShowProfile] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [bioText, setBioText] = useState("");
  const [nameText, setNameText] = useState("");
  const fileRef = useRef(null);

  useEffect(() => {
    if (authUser?.bio) setBioText(authUser.bio);
    if (authUser?.fullname) setNameText(authUser.fullname);
  }, [authUser?.bio, authUser?.fullname, showProfile]);

  const handleBioSave = () => {
    updateProfile({ bio: bioText });
    setIsEditingBio(false);
  };

  const handleNameSave = () => {
    if (nameText.trim()) updateProfile({ fullname: nameText.trim() });
    setIsEditingName(false);
  };

  const toggleOnlineStatus = () => {
    updateProfile({ showOnlineStatus: !authUser.showOnlineStatus });
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      deleteAccount();
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      updateProfile({ profilePic: reader.result });
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">
          <div className="navbar-brand-icon">
            <MessageSquare size={18} />
          </div>
          ChatApp
        </div>

        <div className="navbar-actions">
          <Link
            to="/settings"
            id="settings-btn"
            className="navbar-btn"
            title="Settings"
            style={{ textDecoration: "none" }}
          >
            <Settings size={16} />
            Settings
          </Link>

          <button
            id="profile-btn"
            className="navbar-btn"
            onClick={() => setShowProfile(true)}
            title="Profile"
          >
            <User size={16} />
            Profile
          </button>
          <button
            id="logout-btn"
            className="navbar-btn logout"
            onClick={logout}
            title="Logout"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </nav>

      {/* ── Profile Modal ── */}
      {showProfile && (
        <div className="profile-modal-overlay" onClick={() => setShowProfile(false)}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>My Profile</h3>
              <button className="icon-btn" onClick={() => setShowProfile(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="profile-avatar-area">
              <div style={{ position: "relative", cursor: "pointer" }} onClick={() => fileRef.current?.click()}>
                {authUser?.profilePic ? (
                  <img
                    src={authUser.profilePic}
                    alt="Profile"
                    className="profile-avatar-big"
                  />
                ) : (
                  <div className="profile-avatar-placeholder">
                    <User size={36} />
                  </div>
                )}
                <div style={{
                  position: "absolute", bottom: 4, right: 4,
                  background: "var(--accent)", borderRadius: "50%",
                  width: 26, height: 26, display: "flex", alignItems: "center",
                  justifyContent: "center", border: "2px solid var(--bg-secondary)"
                }}>
                  {isUpdatingProfile
                    ? <div className="spinner" style={{ width: 12, height: 12, borderWidth: 2 }} />
                    : <Camera size={13} color="white" />
                  }
                </div>
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatarChange} />
              
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {!isEditingName ? (
                  <>
                    <div className="profile-name">{authUser?.fullname}</div>
                    <button className="icon-btn" style={{ padding: 4 }} onClick={() => setIsEditingName(true)} title="Edit Name">
                      <Edit2 size={14} />
                    </button>
                  </>
                ) : (
                  <>
                    <input 
                      autoFocus
                      value={nameText}
                      onChange={(e) => setNameText(e.target.value)}
                      style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-primary)", background: "var(--bg-input)", border: "1px solid var(--accent)", padding: "0.2rem 0.5rem", borderRadius: "var(--radius-sm)", outline: "none", textAlign: "center", width: "180px" }}
                    />
                    <button className="icon-btn" style={{ padding: 4, color: "var(--accent)" }} onClick={handleNameSave} title="Save Name">
                      <Check size={16} />
                    </button>
                  </>
                )}
              </div>
              <div className="profile-email">{authUser?.email}</div>
              
              <div style={{ width: "100%", marginTop: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 500 }}>About</span>
                  {!isEditingBio ? (
                    <button className="icon-btn" style={{ padding: 4 }} onClick={() => setIsEditingBio(true)} title="Edit Bio">
                      <Edit2 size={14} />
                    </button>
                  ) : (
                    <button className="icon-btn" style={{ padding: 4, color: "var(--accent)" }} onClick={handleBioSave} title="Save Bio">
                      <Check size={16} />
                    </button>
                  )}
                </div>
                {!isEditingBio ? (
                  <div style={{ fontSize: "0.95rem", color: "var(--text-primary)", background: "var(--bg-input)", padding: "0.75rem", borderRadius: "var(--radius-sm)", minHeight: "40px" }}>
                    {authUser?.bio || "Hey there! I am using ChatApp."}
                  </div>
                ) : (
                  <textarea 
                    autoFocus
                    value={bioText}
                    onChange={(e) => setBioText(e.target.value)}
                    style={{ width: "100%", fontSize: "0.95rem", color: "var(--text-primary)", background: "var(--bg-primary)", border: "1px solid var(--accent)", padding: "0.75rem", borderRadius: "var(--radius-sm)", outline: "none", resize: "none", fontFamily: "inherit" }}
                    rows={2}
                    maxLength={100}
                  />
                )}
              </div>
            </div>

            <div style={{ background: "var(--bg-input)", borderRadius: "var(--radius-sm)", padding: "0.9rem 1rem", marginTop: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-primary)", fontWeight: 500 }}>Show Online Status</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Let others see when you are online</div>
                </div>
                <button 
                  onClick={toggleOnlineStatus}
                  style={{ background: authUser?.showOnlineStatus ? "var(--accent)" : "var(--bg-primary)", border: authUser?.showOnlineStatus ? "none" : "1px solid var(--border)", color: authUser?.showOnlineStatus ? "white" : "var(--text-muted)", borderRadius: "var(--radius-full)", padding: "0.4rem 0.8rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem" }}
                >
                  {authUser?.showOnlineStatus ? <Eye size={14} /> : <EyeOff size={14} />}
                  {authUser?.showOnlineStatus ? "Visible" : "Hidden"}
                </button>
              </div>
            </div>

            <div style={{ background: "var(--bg-input)", borderRadius: "var(--radius-sm)", padding: "0.9rem 1rem", marginTop: "1rem" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Member since</div>
              <div style={{ fontSize: "0.88rem", color: "var(--text-secondary)" }}>
                {authUser?.createdAt ? new Date(authUser.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—"}
              </div>
            </div>

            <button 
              onClick={handleDeleteAccount}
              style={{ width: "100%", marginTop: "1rem", background: "rgba(255,107,107,0.1)", color: "#ff6b6b", border: "1px solid rgba(255,107,107,0.2)", borderRadius: "var(--radius-sm)", padding: "0.75rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", fontSize: "0.9rem", fontWeight: 500 }}
            >
              <Trash2 size={16} />
              Delete Account
            </button>
          </div>
        </div>
      )}
    </>
  );
}
