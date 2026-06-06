import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) 
      errs.name = "Name is required";
    else if (form.name.trim().length < 2)
      errs.name = "Name must be at least 2 characters";
    if (!form.email.trim()) 
      errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      errs.email = "Enter a valid email";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 6)
      errs.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword)
      errs.confirmPassword = "Passwords do not match";
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
      const res = await api.post("/auth/register", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      login(res.data.user, res.data.token);
      toast.success("Welcome to TaskFlow! 🎉");
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      toast.error(msg);
      if (msg.toLowerCase().includes("email")) setErrors({ email: msg });
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
          Organize your work, elevate your productivity
        </p>
        <div className="auth-hero-features">
          {[
            { icon: "✅", text: "Create & manage tasks effortlessly" },
            { icon: "🔍", text: "Search and filter with ease" },
            { icon: "🔒", text: "Secure JWT authentication" },
            { icon: "📊", text: "Track your progress at a glance" },
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
          <h1>Create account</h1>
          <p>Start managing your tasks today — it's free</p>
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                name="name"
                type="text"
                className={`form-input ${errors.name ? "error" : ""}`}
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                autoFocus
              />
              {errors.name && <div className="form-error">⚠ {errors.name}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                name="email"
                type="email"
                className={`form-input ${errors.email ? "error" : ""}`}
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
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
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
              />
              {errors.password && (
                <div className="form-error">⚠ {errors.password}</div>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                name="confirmPassword"
                type="password"
                className={`form-input ${errors.confirmPassword ? "error" : ""}`}
                placeholder="Repeat your password"
                value={form.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <div className="form-error">⚠ {errors.confirmPassword}</div>
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
                  Creating account...
                </>
              ) : (
                "Create Account →"
              )}
            </button>
          </form>
          <div className="auth-link">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
