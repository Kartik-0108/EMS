import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
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
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/70 bg-white/65 shadow-[0_32px_80px_-28px_rgba(15,23,42,0.42)] backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr]">
        <div className="hidden bg-slate-950 px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300/80">
              Employee Management System
            </p>
            <h1 className="mt-6 text-5xl font-semibold leading-tight">
              Run your team with calm, clear control.
            </h1>
            <p className="mt-6 max-w-md text-base text-slate-300">
              Track employees, attendance, and tasks in a workspace designed to
              feel organized from the first click.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-slate-400">Modules</p>
              <p className="mt-2 text-2xl font-semibold">3</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-slate-400">Views</p>
              <p className="mt-2 text-2xl font-semibold">7</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-slate-400">Focus</p>
              <p className="mt-2 text-2xl font-semibold">People</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-6 py-10 sm:px-10">
          <form onSubmit={handleSubmit} className="w-full max-w-md">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
              Welcome back
            </p>
            <h2 className="mt-3 text-4xl font-semibold text-slate-900">
              Sign in
            </h2>
            <p className="mt-3 text-sm text-slate-500">
              Use your account to continue to the dashboard.
            </p>

            <div className="mt-8 space-y-5">
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
            </div>

            <button disabled={loading} className="primary-btn mt-8 w-full">
              {loading ? "Signing in..." : "Login"}
            </button>

            <p className="mt-6 text-center text-sm text-slate-500">
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
        </div>
      </div>
    </div>
  );
};

export default Login;
