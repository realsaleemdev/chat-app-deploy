import { useState, useRef, useEffect } from "react";
import { MessageSquare, LogOut, User, Camera, X, Settings, Edit2, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.js";

export default function Navbar() {
  const { authUser, logout, updateProfile, isUpdatingProfile } = useAuthStore();
  const [showProfile, setShowProfile] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState("");
  const fileRef = useRef(null);

  useEffect(() => {
    if (authUser?.bio) setBioText(authUser.bio);
  }, [authUser?.bio, showProfile]);

  const handleBioSave = () => {
    updateProfile({ bio: bioText });
    setIsEditingBio(false);
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
              <div className="profile-name">{authUser?.fullname}</div>
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

            <div style={{ background: "var(--bg-input)", borderRadius: "var(--radius-sm)", padding: "0.9rem 1rem" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Member since</div>
              <div style={{ fontSize: "0.88rem", color: "var(--text-secondary)" }}>
                {authUser?.createdAt ? new Date(authUser.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—"}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
