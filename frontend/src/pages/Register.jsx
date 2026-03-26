import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await API.post("/auth/register", form);
      setSuccessMessage("User registered successfully. You can sign in now.");
      setTimeout(() => navigate("/"), 900);
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error?.response?.data?.message || "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/70 bg-white/65 shadow-[0_32px_80px_-28px_rgba(15,23,42,0.42)] backdrop-blur-xl lg:grid-cols-[0.95fr_1.05fr]">
        <div className="hidden bg-gradient-to-br from-emerald-700 via-teal-700 to-slate-900 px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-100/80">
              Team Access
            </p>
            <h1 className="mt-6 text-5xl font-semibold leading-tight">
              Create accounts with a polished admin experience.
            </h1>
            <p className="mt-6 max-w-md text-base text-emerald-50/80">
              Register employees, HR members, and administrators into the same
              workspace with a cleaner onboarding flow.
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-white/15 bg-white/10 p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-100/70">
              Included Roles
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <span className="rounded-full bg-white/12 px-4 py-2 text-sm">
                Employee
              </span>
              <span className="rounded-full bg-white/12 px-4 py-2 text-sm">
                HR
              </span>
              <span className="rounded-full bg-white/12 px-4 py-2 text-sm">
                Admin
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-6 py-10 sm:px-10">
          <form onSubmit={handleSubmit} className="w-full max-w-lg">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
              New account
            </p>
            <h2 className="mt-3 text-4xl font-semibold text-slate-900">
              Register user
            </h2>
            <p className="mt-3 text-sm text-slate-500">
              Add a new member and choose the right role for their access.
            </p>

            <div className="mt-8 grid gap-5">
              {errorMessage && (
                <div className="feedback-banner feedback-banner-error">
                  {errorMessage}
                </div>
              )}

              {successMessage && (
                <div className="feedback-banner feedback-banner-success">
                  {successMessage}
                </div>
              )}

              <div>
                <label className="label-text">Full name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter full name"
                  className="input-field"
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="label-text">Email address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  className="input-field"
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="label-text">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Create a secure password"
                  className="input-field"
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="label-text">Role</label>
                <select
                  name="role"
                  className="input-field"
                  onChange={handleChange}
                >
                  <option value="employee">Employee</option>
                  <option value="hr">HR</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <button disabled={loading} className="success-btn mt-8 w-full">
              {loading ? "Registering..." : "Register"}
            </button>

            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <button
                type="button"
                className="cursor-pointer font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4"
                onClick={() => navigate("/")}
              >
                Login
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
