import React, { useEffect, useMemo, useState } from "react";
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

  const attendanceSummary = useMemo(() => {
    const today = new Date();
    const isToday = (dateString) => {
      const date = new Date(dateString);

      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    };

    const todaysRecords = attendance.filter((item) => isToday(item.createdAt));

    return {
      total: attendance.length,
      today: todaysRecords.length,
      present: todaysRecords.filter((item) => item.status === "Present").length,
      absent: todaysRecords.filter((item) => item.status === "Absent").length,
    };
  }, [attendance]);

  return (
    <>
      <section className="hero-banner animate-rise">
        <div className="section-header mb-0">
          <div>
            <p className="hero-kicker">Attendance desk</p>
            <h1 className="page-title">Attendance</h1>
            <p className="hero-copy">
              Mark daily status, monitor today&apos;s check-ins, and review the
              latest attendance records.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-2">
            <div className="panel-soft px-4 py-4">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                Total records
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {loadingData ? "--" : attendanceSummary.total}
              </p>
            </div>
            <div className="panel-soft px-4 py-4">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                Today
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {loadingData ? "--" : attendanceSummary.today}
              </p>
            </div>
            <div className="panel-soft px-4 py-4">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                Present
              </p>
              <p className="mt-2 text-2xl font-semibold text-emerald-600">
                {loadingData ? "--" : attendanceSummary.present}
              </p>
            </div>
            <div className="panel-soft px-4 py-4">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                Absent
              </p>
              <p className="mt-2 text-2xl font-semibold text-rose-600">
                {loadingData ? "--" : attendanceSummary.absent}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="panel animate-rise relative z-20 mb-6 mt-6 overflow-visible p-6 sm:p-8">
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

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto_auto] xl:items-end">
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
            className="success-btn w-full xl:w-auto"
          >
            Mark Present
          </button>

          <button
            disabled={loading || loadingData}
            onClick={() => markAttendance("Absent")}
            className="danger-btn w-full xl:w-auto"
          >
            Mark Absent
          </button>
        </div>
      </section>

      <section className="panel animate-rise-delay-1 overflow-hidden">
        <div className="border-b border-slate-200/80 px-6 py-5">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="hero-kicker">Recent records</p>
              <h2 className="text-2xl font-semibold text-slate-900">
                Attendance log
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Recent attendance records across the team.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
              Showing {loadingData ? "..." : attendance.length} records
            </div>
          </div>
        </div>

        <div className="hidden overflow-x-auto md:block">
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

        <div className="space-y-3 p-4 md:hidden">
          {loadingData ? (
            <div className="empty-state py-10">Loading attendance records...</div>
          ) : attendance.length > 0 ? (
            attendance.map((item) => (
              <article key={item._id} className="panel-soft px-4 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">
                      {item.employeeId?.name || "Unknown"}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {item.employeeId?.email || "No email available"}
                    </p>
                  </div>
                  <span
                    className={
                      item.status === "Present"
                        ? "status-badge bg-emerald-100 text-emerald-700"
                        : "status-badge bg-rose-100 text-rose-700"
                    }
                  >
                    {item.status}
                  </span>
                </div>
                <p className="mt-4 text-sm text-slate-500">
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </article>
            ))
          ) : (
            <div className="empty-state py-10">No attendance records found.</div>
          )}
        </div>
      </section>
    </>
  );
};

export default Attendance;
