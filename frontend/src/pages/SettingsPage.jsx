import { useThemeStore, THEMES } from "../store/useThemeStore.js";
import { Send } from "lucide-react";

const PREVIEW_MESSAGES = [
  { id: 1, text: "Hey, how are you doing?", isSent: false },
  { id: 2, text: "I'm doing great! Just checking out these new themes.", isSent: true },
];

export default function SettingsPage() {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="settings-page" style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto", height: "100vh", overflowY: "auto" }}>
      <h1 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "1.5rem" }}>Settings</h1>
      
      {/* Theme Section */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "1rem" }}>Theme</h2>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {THEMES.map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              style={{
                padding: "0.8rem 1.2rem",
                borderRadius: "var(--radius-md)",
                border: theme === t ? "2px solid var(--accent)" : "1px solid var(--border)",
                background: "var(--bg-panel)",
                color: "var(--text-primary)",
                cursor: "pointer",
                fontWeight: 500,
                textTransform: "capitalize",
                transition: "all 0.2s"
              }}
            >
              {t.replace("-", " ")}
            </button>
          ))}
        </div>
      </section>

      {/* Preview Section */}
      <section>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "1rem" }}>Preview</h2>
        <div className="preview-container" style={{
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          background: "var(--bg-primary)",
          boxShadow: "var(--shadow)"
        }}>
          
          {/* Mock Header */}
          <div className="chat-header" style={{ display: "flex", alignItems: "center", padding: "1rem", background: "var(--bg-panel)", borderBottom: "1px solid var(--border)" }}>
            <div className="avatar-placeholder" style={{ width: 40, height: 40, marginRight: 12 }}>J</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>John Doe</div>
              <div style={{ fontSize: "0.75rem", color: "#25d366" }}>Online</div>
            </div>
          </div>

          {/* Mock Messages */}
          <div className="messages-area" style={{ padding: "1.5rem", minHeight: "250px", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {PREVIEW_MESSAGES.map((msg) => (
              <div key={msg.id} className={`message-row ${msg.isSent ? "sent" : "received"}`}>
                <div className="message-bubble" style={{ 
                  padding: "0.75rem 1rem", 
                  borderRadius: "var(--radius-md)", 
                  maxWidth: "75%",
                  background: msg.isSent ? "var(--bg-message-out)" : "var(--bg-message-in)",
                  color: msg.isSent ? "#fff" : "var(--text-primary)",
                  borderBottomRightRadius: msg.isSent ? 4 : undefined,
                  borderBottomLeftRadius: !msg.isSent ? 4 : undefined,
                  boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
                }}>
                  <p style={{ margin: 0, fontSize: "0.9rem" }}>{msg.text}</p>
                  <div style={{ fontSize: "0.65rem", textAlign: "right", marginTop: 4, opacity: 0.7 }}>12:00 PM</div>
                </div>
              </div>
            ))}
          </div>

          {/* Mock Input */}
          <div className="message-input-area" style={{ padding: "1rem", background: "var(--bg-panel)", borderTop: "1px solid var(--border)", display: "flex", gap: "0.75rem" }}>
            <input 
              type="text" 
              className="message-input-box" 
              placeholder="Type a message..." 
              style={{ flex: 1 }} 
              readOnly 
            />
            <button className="send-btn" disabled>
              <Send size={18} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
