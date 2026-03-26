// src/components/Navbar.jsx
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="sticky top-0 z-20 border-b border-white/60 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Employee Management System
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-right shadow-sm sm:block">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Signed in
            </p>
            <p className="text-sm font-semibold text-slate-700">
              {user ? user.name : "Guest"}
            </p>
          </div>

          <button
            onClick={logout}
            className="secondary-btn px-4 py-2"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
