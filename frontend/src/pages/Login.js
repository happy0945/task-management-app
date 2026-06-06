import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) 
      errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      errs.email = "Enter a valid email";
    if (!form.password) 
      errs.password = "Password is required";
    return errs;
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name])
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) return setErrors(errs);

    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      login(res.data.user, res.data.token);
      toast.success(`Welcome back, ${res.data.user.name.split(" ")[0]}! 👋`);
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-hero">
        <div className="auth-hero-logo">
          Task<span>Flow</span>
        </div>
        <p className="auth-hero-tagline">
          Your tasks, organized and under control
        </p>
        <div className="auth-hero-features">
          {[
            { icon: "⚡", text: "Lightning fast task management" },
            { icon: "🎯", text: "Priority-based organization" },
            { icon: "🔔", text: "Track completed vs pending tasks" },
            { icon: "📱", text: "Fully responsive design" },
          ].map((f, i) => (
            <div className="auth-hero-feature" key={i}>
              <div className="auth-hero-feature-icon">{f.icon}</div>
              <span>{f.text}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="auth-form-side">
        <div className="auth-card">
          <h1>Welcome back</h1>
          <p>Sign in to continue to your dashboard</p>
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                name="email"
                type="email"
                className={`form-input ${errors.email ? "error" : ""}`}
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoFocus
              />
              {errors.email && (
                <div className="form-error">⚠ {errors.email}</div>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                name="password"
                type="password"
                className={`form-input ${errors.password ? "error" : ""}`}
                placeholder="Your password"
                value={form.password}
                onChange={handleChange}
              />
              {errors.password && (
                <div className="form-error">⚠ {errors.password}</div>
              )}
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" />
                  Signing in...
                </>
              ) : (
                "Sign In →"
              )}
            </button>
          </form>
          <div className="auth-link">
            Don't have an account? <Link to="/register">Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
