import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const AddEmployee = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "employee",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      await API.post("/employees", form);
      navigate("/employees");
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error?.response?.data?.message || "Failed to add employee."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="hero-banner animate-rise">
        <p className="hero-kicker">New team member</p>
        <h1 className="page-title">Add Employee</h1>
        <p className="hero-copy">
          Create a new employee record with the right team role.
        </p>
      </section>

      <section className="panel animate-rise-delay-1 mt-6 max-w-2xl p-6 sm:p-8">
        <div className="mb-6">
          <p className="hero-kicker">Employee details</p>
          <p className="mt-2 text-sm text-slate-500">
            Add the basics first. You can refine team data later from the employee list.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMessage && (
            <div className="feedback-banner feedback-banner-error">
              {errorMessage}
            </div>
          )}

          <div>
            <label className="label-text">Full name</label>
            <input
              type="text"
              placeholder="Enter employee name"
              className="input-field"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="label-text">Email address</label>
            <input
              type="email"
              placeholder="name@company.com"
              className="input-field"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="label-text">Role</label>
            <select
              className="input-field"
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="employee">Employee</option>
              <option value="hr">HR</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading} className="primary-btn w-full sm:w-auto">
              {loading ? "Adding..." : "Add Employee"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/employees")}
              className="secondary-btn w-full sm:w-auto"
            >
              Back
            </button>
          </div>
        </form>
      </section>
    </>
  );
};

export default AddEmployee;
