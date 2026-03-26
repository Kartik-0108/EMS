import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Sidebar = () => {
  const { user } = useContext(AuthContext);

  const linkClass = ({ isActive }) =>
    isActive
      ? "block rounded-2xl bg-white/12 px-4 py-3 font-semibold text-white shadow-inner"
      : "block rounded-2xl px-4 py-3 text-slate-300 transition hover:bg-white/10 hover:text-white";

  return (
    <aside className="lg:fixed lg:inset-y-4 lg:left-4 lg:z-30 lg:w-64">
      <div className="m-4 flex overflow-hidden rounded-[2rem] border border-slate-700/70 bg-slate-950 text-white shadow-[0_28px_60px_-26px_rgba(15,23,42,0.65)] lg:m-0 lg:h-[calc(100vh-2rem)] lg:flex-col">
        <div className="border-b border-white/10 px-6 pb-6 pt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300/80">
            Workspace
          </p>
          <h2 className="mt-3 text-3xl font-semibold">EMS</h2>
          <p className="mt-2 text-sm text-slate-400">
            Manage people, attendance, and daily operations from one place.
          </p>
        </div>

        <nav className="px-4 py-6">
          <ul className="space-y-2">
            <li>
              <NavLink to="/dashboard" className={linkClass}>
                Dashboard
              </NavLink>
            </li>

            {(user?.role === "admin" || user?.role === "hr") && (
              <li>
                <NavLink to="/employees" className={linkClass}>
                  Employees
                </NavLink>
              </li>
            )}

            {user?.role === "admin" && (
              <li>
                <NavLink to="/add-employee" className={linkClass}>
                  Add Employee
                </NavLink>
              </li>
            )}

            <li>
              <NavLink to="/tasks" className={linkClass}>
                Tasks
              </NavLink>
            </li>

            {(user?.role === "admin" || user?.role === "hr") && (
              <li>
                <NavLink to="/add-task" className={linkClass}>
                  Assign Task
                </NavLink>
              </li>
            )}

            <li>
              <NavLink to="/attendance" className={linkClass}>
                Attendance
              </NavLink>
            </li>

            <li>
              <NavLink to="/profile" className={linkClass}>
                Profile
              </NavLink>
            </li>
          </ul>
        </nav>

       
      </div>
    </aside>
  );
};

export default Sidebar;
