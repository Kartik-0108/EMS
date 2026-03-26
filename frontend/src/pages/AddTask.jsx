import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import SearchableSelect from "../components/SearchableSelect";
import API from "../services/api";

const AddTask = () => {
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
  });

  const fetchEmployees = async () => {
    try {
      setLoadingEmployees(true);
      setErrorMessage("");
      const res = await API.get("/employees");
      setEmployees(res.data);
    } catch (error) {
      setErrorMessage("Couldn't load employees right now.");
      console.error("Error fetching employees:", error);
    } finally {
      setLoadingEmployees(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!form.title || !form.assignedTo) {
      setErrorMessage("Title and employee are required.");
      return;
    }

    try {
      setSaving(true);
      await API.post("/tasks", form);
      setSuccessMessage("Task assigned successfully.");
      setForm({
        title: "",
        description: "",
        assignedTo: "",
      });
    } catch (error) {
      console.error("Error adding task:", error);
      setErrorMessage(
        error?.response?.data?.message || "Error assigning task."
      );
    } finally {
      setSaving(false);
    }
  };

  const employeeOptions = employees.map((emp) => ({
    value: emp._id,
    label: emp.name,
    meta: `${emp.role}${emp.email ? ` | ${emp.email}` : ""}`,
  }));

  return (
    <Layout>
      <section className="mb-8">
        <h1 className="page-title">Assign Task</h1>
        <p className="page-subtitle">
          Create a task, add context, and assign it to the right employee.
        </p>
      </section>

      <section className="panel relative z-20 max-w-3xl overflow-visible p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
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
            <label className="label-text">Task title</label>
            <input
              type="text"
              name="title"
              placeholder="Prepare payroll report"
              value={form.title}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div>
            <label className="label-text">Description</label>
            <textarea
              name="description"
              placeholder="Add the details employees should see before starting."
              value={form.description}
              onChange={handleChange}
              className="input-field min-h-[8rem]"
            />
          </div>

          <div>
            <SearchableSelect
              label="Assign to"
              placeholder={
                loadingEmployees
                  ? "Loading employees..."
                  : "Search and choose an employee"
              }
              searchPlaceholder="Search by name, role, or email"
              options={employeeOptions}
              value={form.assignedTo}
              onChange={(nextValue) =>
                setForm({ ...form, assignedTo: nextValue })
              }
              disabled={loadingEmployees}
              emptyMessage="No employees match your search."
            />
          </div>

          <button disabled={saving || loadingEmployees} className="primary-btn">
            {saving ? "Assigning..." : "Assign Task"}
          </button>
        </form>
      </section>
    </Layout>
  );
};

export default AddTask;
