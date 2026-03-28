// src/components/Navbar.jsx
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="sticky top-0 z-20 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl rounded-[1.75rem] border border-white/60 bg-white/45 shadow-[0_24px_64px_-36px_rgba(15,23,42,0.4)] backdrop-blur-2xl">
        <div className="flex w-full flex-col gap-3 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">
              Employee Management System
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              {user?.role === "employee"
                ? "Track your work and profile details."
                : "Manage people, tasks, and attendance from one place."}
            </p>
          </div>

          <div className="flex w-full items-center justify-between gap-3 md:w-auto md:justify-end">
            <div className="rounded-2xl border border-white/70 bg-white/45 px-4 py-2 text-left shadow-[0_16px_40px_-30px_rgba(15,23,42,0.45)] backdrop-blur-xl sm:text-right">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Signed in
              </p>
              <p className="text-sm font-semibold text-slate-700">
                {user ? user.name : "Guest"}
              </p>
            </div>

            <button onClick={logout} className="secondary-btn px-4 py-2">
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
