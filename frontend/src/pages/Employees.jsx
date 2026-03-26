import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";

const Employees = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [employees, setEmployees] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const fetchEmployees = async () => {
    const res = await API.get("/employees");
    setEmployees(res.data);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this employee?")) return;

    await API.delete(`/employees/${id}`);
    fetchEmployees();
  };

  const startEdit = (emp) => {
    setEditingId(emp._id);
    setEditForm(emp);
  };

  const handleUpdate = async () => {
    await API.put(`/employees/${editingId}`, editForm);
    setEditingId(null);
    fetchEmployees();
  };

  const roleBadgeClass = (role) => {
    if (role === "admin") return "status-badge bg-slate-900/90 text-white";
    if (role === "hr") return "status-badge bg-cyan-100 text-cyan-700";
    return "status-badge bg-emerald-100 text-emerald-700";
  };

  return (
    <Layout>
      <section className="hero-banner animate-rise">
        <div className="section-header mb-0">
          <div>
            <p className="hero-kicker">Team directory</p>
            <h1 className="page-title">Employees</h1>
            <p className="hero-copy">
              Review team records, update details, and keep your roster current.
            </p>
          </div>

          <div className="hero-metrics">
            <span className="metric-chip">Total: {employees.length}</span>
            <span className="metric-chip">
              HR: {employees.filter((emp) => emp.role === "hr").length}
            </span>
            <span className="metric-chip">
              Employees: {employees.filter((emp) => emp.role === "employee").length}
            </span>
          </div>
        </div>

        {user?.role === "admin" && (
          <button
            onClick={() => navigate("/add-employee")}
            className="primary-btn mt-6"
          >
            Add Employee
          </button>
        )}
      </section>

      <section className="panel animate-rise-delay-1 mt-6 overflow-hidden">
        <div className="hidden overflow-x-auto md:block">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                {user?.role === "admin" && <th>Actions</th>}
              </tr>
            </thead>

            <tbody>
              {employees.length > 0 ? (
                employees.map((emp) => (
                  <tr key={emp._id}>
                    {editingId === emp._id ? (
                      <>
                        <td>
                          <input
                            value={editForm.name}
                            onChange={(e) =>
                              setEditForm({ ...editForm, name: e.target.value })
                            }
                            className="input-field"
                          />
                        </td>
                        <td>
                          <input
                            value={editForm.email}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                email: e.target.value,
                              })
                            }
                            className="input-field"
                          />
                        </td>
                        <td>
                          <select
                            value={editForm.role}
                            onChange={(e) =>
                              setEditForm({ ...editForm, role: e.target.value })
                            }
                            className="input-field"
                          >
                            <option value="employee">Employee</option>
                            <option value="hr">HR</option>
                          </select>
                        </td>
                        <td>
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={handleUpdate}
                              className="success-btn px-4 py-2"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="secondary-btn px-4 py-2"
                            >
                              Cancel
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>
                          <p className="font-semibold text-slate-900">{emp.name}</p>
                        </td>
                        <td>{emp.email}</td>
                        <td>
                          <span className={roleBadgeClass(emp.role)}>{emp.role}</span>
                        </td>

                        {user?.role === "admin" && (
                          <td>
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() => startEdit(emp)}
                                className="secondary-btn px-4 py-2"
                              >
                                Edit
                              </button>

                              <button
                                onClick={() => handleDelete(emp._id)}
                                className="danger-btn px-4 py-2"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        )}
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={user?.role === "admin" ? 4 : 3}
                    className="px-6 py-10 text-center text-slate-500"
                  >
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 p-4 md:hidden">
          {employees.length > 0 ? (
            employees.map((emp) => (
              <article key={emp._id} className="panel-soft px-4 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">{emp.name}</p>
                    <p className="mt-1 break-all text-sm text-slate-500">{emp.email}</p>
                  </div>
                  <span className={roleBadgeClass(emp.role)}>{emp.role}</span>
                </div>

                {user?.role === "admin" && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => startEdit(emp)}
                      className="secondary-btn px-4 py-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(emp._id)}
                      className="danger-btn px-4 py-2"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </article>
            ))
          ) : (
            <div className="empty-state py-10">No employees found.</div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Employees;
