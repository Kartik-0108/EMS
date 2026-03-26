import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import AuthShell from "../components/AuthShell";

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
    <AuthShell
      showAside={false}
      eyebrow="New account"
      title="Create account"
      description="Add a teammate with the right role and keep onboarding fast."
      asideTitle="Simple account setup for every role."
      asideDescription="Register employees, HR members, and admins with a cleaner form and a more polished first impression."
      asideStats={[
        { label: "Employee", value: "Ready" },
        { label: "HR", value: "Ready" },
        { label: "Admin", value: "Ready" },
      ]}
    >
      <form onSubmit={handleSubmit} className="auth-form animate-rise">
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
            placeholder="Create a password"
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

        <button disabled={loading} className="primary-btn mt-2 w-full">
          {loading ? "Creating..." : "Create account"}
        </button>

        <p className="text-center text-sm text-slate-500">
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
    </AuthShell>
  );
};

export default Register;
