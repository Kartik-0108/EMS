import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Sidebar = () => {
  const { user } = useContext(AuthContext);

  const linkClass = ({ isActive }) =>
    isActive
      ? "block rounded-2xl border border-white/15 bg-white/16 px-4 py-3 font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_18px_40px_-28px_rgba(15,23,42,0.8)] backdrop-blur-xl"
      : "block rounded-2xl border border-transparent px-4 py-3 text-slate-200 transition hover:border-white/10 hover:bg-white/10 hover:text-white";

  return (
    <aside className="animate-rise lg:fixed lg:inset-y-4 lg:left-4 lg:z-30 lg:w-72">
      <div className="mx-4 mt-4 overflow-hidden rounded-[2rem] border border-white/12 bg-[linear-gradient(165deg,rgba(4,20,20,0.94),rgba(15,23,42,0.92)_52%,rgba(18,66,60,0.88))] text-white shadow-[0_32px_70px_-30px_rgba(15,23,42,0.72)] backdrop-blur-2xl lg:m-0 lg:flex lg:h-[calc(100vh-2rem)] lg:flex-col">
        <div className="border-b border-white/10 px-5 pb-5 pt-6 sm:px-6 sm:pb-6 sm:pt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-200/80">
            Workspace
          </p>
          <div className="mt-3 flex items-center justify-between gap-3">
            <h2 className="text-3xl font-semibold">EMS</h2>
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-teal-100 backdrop-blur-xl">
              {user?.role || "user"}
            </span>
          </div>
          <p className="mt-2 max-w-xs text-sm text-slate-400">
            Manage people, attendance, and daily operations from one place.
          </p>
        </div>

        <nav className="overflow-x-auto px-3 py-3 sm:px-4 lg:flex-1 lg:px-4 lg:py-6">
          <ul className="flex min-w-max gap-2 lg:min-w-0 lg:flex-col lg:space-y-2 lg:gap-0">
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

            {(user?.role === "admin" || user?.role === "hr") && (
              <li>
                <NavLink to="/attendance" className={linkClass}>
                  Attendance
                </NavLink>
              </li>
            )}

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
