import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import AuthShell from "../components/AuthShell";
import API from "../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      const { user, token } = res.data;

      login(user, token);
      navigate("/dashboard");
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          "Login failed. Check your email and password."
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in"
      description="Use your account to continue to the dashboard."
      asideTitle="A calmer way to manage your team."
      asideDescription="Track people, tasks, and attendance in one polished workspace built for speed and clarity."
      
    >
      <form onSubmit={handleSubmit} className="auth-form animate-rise">
        {errorMessage && (
          <div className="feedback-banner feedback-banner-error">
            {errorMessage}
          </div>
        )}

        <div>
          <label className="label-text">Email address</label>
          <input
            type="email"
            placeholder="name@company.com"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="label-text">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading} className="primary-btn mt-2 w-full">
          {loading ? "Signing in..." : "Login"}
        </button>

        <p className="text-center text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            className="cursor-pointer font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </p>
      </form>
    </AuthShell>
  );
};

export default Login;
