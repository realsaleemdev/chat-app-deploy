import { useState } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Mail, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore.js";

export default function SignupPage() {
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ fullname: "", email: "", password: "" });
  const { signup, isSigningUp } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(form);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <MessageSquare size={24} />
          </div>
          <h1>Chat<span>App</span></h1>
        </div>
        <p className="auth-subtitle">Create your account and start chatting 🚀</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <div className="input-wrapper">
              <User className="input-icon" size={16} />
              <input
                id="signup-fullname"
                className="form-input"
                type="text"
                placeholder="Your name"
                value={form.fullname}
                onChange={(e) => setForm({ ...form, fullname: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={16} />
              <input
                id="signup-email"
                className="form-input"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={16} />
              <input
                id="signup-password"
                className="form-input"
                type={showPass ? "text" : "password"}
                placeholder="At least 6 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <button
                type="button"
                className="icon-btn"
                style={{ position: "absolute", right: "0.5rem" }}
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            id="signup-btn"
            type="submit"
            className="btn-primary"
            disabled={isSigningUp}
          >
            {isSigningUp ? (
              <><Loader2 size={18} className="spinner-inline" /> Creating account…</>
            ) : "Create Account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
