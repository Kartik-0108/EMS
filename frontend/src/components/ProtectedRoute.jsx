import React, { useContext } from "react";
import { Navigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="panel max-w-lg p-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-500">
            Restricted
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-slate-900">
            Access denied
          </h1>
          <p className="mt-4 text-sm text-slate-500">
            Your current role does not have permission to open this page.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/dashboard" className="primary-btn">
              Go to Dashboard
            </Link>
            <Link to="/" className="secondary-btn">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
