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
      <section className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="page-title">Employees</h1>
          <p className="page-subtitle">
            Review team records, update details, and keep your roster current.
          </p>
        </div>

        {user?.role === "admin" && (
          <button
            onClick={() => navigate("/add-employee")}
            className="primary-btn"
          >
            Add Employee
          </button>
        )}
      </section>

      <section className="panel overflow-hidden">
        <div className="overflow-x-auto">
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
                          <div>
                            <p className="font-semibold text-slate-900">
                              {emp.name}
                            </p>
                          </div>
                        </td>
                        <td>{emp.email}</td>
                        <td>
                          <span className={roleBadgeClass(emp.role)}>
                            {emp.role}
                          </span>
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
      </section>
    </Layout>
  );
};

export default Employees;
