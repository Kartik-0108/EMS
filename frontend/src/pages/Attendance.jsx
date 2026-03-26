import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import SearchableSelect from "../components/SearchableSelect";
import API from "../services/api";

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchData = async () => {
    try {
      setLoadingData(true);
      setErrorMessage("");
      const empRes = await API.get("/employees");
      const attRes = await API.get("/attendance");

      setEmployees(empRes.data);
      setAttendance(attRes.data);
    } catch (error) {
      setErrorMessage("Couldn't load attendance details right now.");
      console.error(error);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const markAttendance = async (status) => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!selectedEmployee) {
      setErrorMessage("Select an employee first.");
      return;
    }

    try {
      setLoading(true);
      await API.post("/attendance", {
        employeeId: selectedEmployee,
        status,
      });

      setSuccessMessage(`Attendance marked as ${status}.`);
      setSelectedEmployee("");
      fetchData();
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Error marking attendance."
      );
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const employeeOptions = employees.map((emp) => ({
    value: emp._id,
    label: emp.name,
    meta: emp.email || emp.role,
  }));

  return (
    <Layout>
      <section className="mb-8">
        <h1 className="page-title">Attendance</h1>
        <p className="page-subtitle">
          Mark daily status and review the latest attendance records.
        </p>
      </section>

      <section className="panel relative z-20 mb-6 overflow-visible p-6 sm:p-8">
        {(errorMessage || successMessage) && (
          <div className="mb-4 space-y-3">
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
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-end">
          <div>
            <SearchableSelect
              label="Select employee"
              placeholder={
                loadingData
                  ? "Loading employees..."
                  : "Choose an employee to mark attendance for"
              }
              searchPlaceholder="Search by name, email, or role"
              options={employeeOptions}
              value={selectedEmployee}
              onChange={setSelectedEmployee}
              disabled={loadingData}
              emptyMessage="No employees match your search."
            />
          </div>

          <button
            disabled={loading || loadingData}
            onClick={() => markAttendance("Present")}
            className="success-btn"
          >
            Mark Present
          </button>

          <button
            disabled={loading || loadingData}
            onClick={() => markAttendance("Absent")}
            className="danger-btn"
          >
            Mark Absent
          </button>
        </div>
      </section>

      <section className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {loadingData ? (
                <tr>
                  <td colSpan="3" className="px-6 py-10 text-center text-slate-500">
                    Loading attendance records...
                  </td>
                </tr>
              ) : attendance.length > 0 ? (
                attendance.map((item) => (
                  <tr key={item._id}>
                    <td className="font-semibold text-slate-900">
                      {item.employeeId?.name || "Unknown"}
                    </td>
                    <td>
                      <span
                        className={
                          item.status === "Present"
                            ? "status-badge bg-emerald-100 text-emerald-700"
                            : "status-badge bg-rose-100 text-rose-700"
                        }
                      >
                        {item.status}
                      </span>
                    </td>
                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-10 text-center text-slate-500">
                    No attendance records found.
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

export default Attendance;
