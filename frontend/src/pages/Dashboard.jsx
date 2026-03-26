import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../services/api";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setErrorMessage("");
        const empRes = await API.get("/employees");
        const attRes = await API.get("/attendance");

        setEmployees(empRes.data);
        setAttendance(attRes.data);
      } catch (error) {
        setErrorMessage("Dashboard data couldn't be loaded.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const today = new Date();
  const todayLabel = today.toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const isSameDay = (dateString) => {
    const date = new Date(dateString);

    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const roleData = [
    {
      role: "Employee",
      count: employees.filter((e) => e.role === "employee").length,
    },
    {
      role: "HR",
      count: employees.filter((e) => e.role === "hr").length,
    },
  ];

  const present = attendance.filter((a) => a.status === "Present").length;
  const absent = attendance.filter((a) => a.status === "Absent").length;

  const attendanceData = [
    { name: "Present", value: present },
    { name: "Absent", value: absent },
  ];

  const todaysAttendance = attendance.filter((item) => isSameDay(item.createdAt));
  const todaysPresent = todaysAttendance.filter(
    (item) => item.status === "Present"
  ).length;
  const todaysAbsent = todaysAttendance.filter(
    (item) => item.status === "Absent"
  ).length;

  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const monthlyAttendance = attendance.filter((item) => {
    const date = new Date(item.createdAt);
    return (
      date.getMonth() === currentMonth &&
      date.getFullYear() === currentYear
    );
  });

  const monthlyPresent = monthlyAttendance.filter(
    (a) => a.status === "Present"
  ).length;

  const monthlyAbsent = monthlyAttendance.filter(
    (a) => a.status === "Absent"
  ).length;

  const dailyData = {};

  monthlyAttendance.forEach((item) => {
    const day = new Date(item.createdAt).getDate();

    if (!dailyData[day]) {
      dailyData[day] = 0;
    }

    if (item.status === "Present") {
      dailyData[day] += 1;
    }
  });

  const chartData = Object.keys(dailyData).map((day) => ({
    day,
    present: dailyData[day],
  }));

  return (
    <Layout>
      <section className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="page-title">Dashboard Overview</h1>
          <p className="page-subtitle">
            A cleaner snapshot of workforce distribution and attendance trends.
          </p>
        </div>

        <div className="panel-soft px-5 py-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
            Today
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{todayLabel}</p>
        </div>
      </section>

      {errorMessage && (
        <section className="mb-6">
          <div className="feedback-banner feedback-banner-error">
            {errorMessage}
          </div>
        </section>
      )}

      <section className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="stat-card">
          <p className="text-sm font-medium text-slate-500">Total employees</p>
          <p className="mt-4 text-4xl font-semibold text-slate-900">
            {loading ? "--" : employees.length}
          </p>
        </div>
        <div className="stat-card">
          <p className="text-sm font-medium text-slate-500">Present today</p>
          <p className="mt-4 text-4xl font-semibold text-emerald-600">
            {loading ? "--" : todaysPresent}
          </p>
        </div>
        <div className="stat-card">
          <p className="text-sm font-medium text-slate-500">Absent today</p>
          <p className="mt-4 text-4xl font-semibold text-rose-600">
            {loading ? "--" : todaysAbsent}
          </p>
        </div>
        <div className="stat-card">
          <p className="text-sm font-medium text-slate-500">Marked today</p>
          <p className="mt-4 text-4xl font-semibold text-slate-900">
            {loading ? "--" : todaysAttendance.length}
          </p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="panel p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-slate-900">
              Employees by Role
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Distribution of employee and HR records in the system.
            </p>
          </div>

          <div className="h-[280px] w-full">
            {loading ? (
              <div className="empty-state">Loading employee distribution...</div>
            ) : employees.length === 0 ? (
              <div className="empty-state">No employees available yet.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={roleData}>
                  <XAxis dataKey="role" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0f172a" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="panel p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-slate-900">
              Attendance Split
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Present versus absent records from the latest attendance data.
            </p>
          </div>

          <div className="h-[280px] w-full">
            {loading ? (
              <div className="empty-state">Loading attendance summary...</div>
            ) : attendance.length === 0 ? (
              <div className="empty-state">No attendance records available yet.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={attendanceData}
                    dataKey="value"
                    outerRadius={88}
                    label
                  >
                    <Cell fill="#059669" />
                    <Cell fill="#e11d48" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="panel p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-slate-900">
              Today&apos;s Attendance
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Live status for the current date.
            </p>
          </div>

          {loading ? (
            <div className="empty-state">Loading today&apos;s attendance...</div>
          ) : todaysAttendance.length === 0 ? (
            <div className="empty-state">
              No attendance has been marked for today yet.
            </div>
          ) : (
            <div className="space-y-3">
              {todaysAttendance.slice(0, 6).map((item) => (
                <div
                  key={item._id}
                  className="panel-soft flex items-center justify-between px-4 py-4"
                >
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
              ))}
            </div>
          )}
        </div>

        <div className="panel p-6 sm:p-8">
          <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">
                Monthly Attendance Report
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Daily present counts for the current month, alongside monthly
                totals.
              </p>
            </div>

            <div className="flex gap-3">
              <div className="panel-soft px-4 py-3">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                  Present
                </p>
                <p className="mt-1 text-lg font-semibold text-emerald-600">
                  {loading ? "--" : monthlyPresent}
                </p>
              </div>
              <div className="panel-soft px-4 py-3">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                  Absent
                </p>
                <p className="mt-1 text-lg font-semibold text-rose-600">
                  {loading ? "--" : monthlyAbsent}
                </p>
              </div>
            </div>
          </div>

          <div className="h-[300px] w-full">
            {loading ? (
              <div className="empty-state">Loading monthly report...</div>
            ) : chartData.length === 0 ? (
              <div className="empty-state">
                No present records have been added for this month yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="day" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Bar dataKey="present" fill="#0f766e" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Dashboard;
