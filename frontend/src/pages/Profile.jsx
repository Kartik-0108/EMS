import React, { useContext } from "react";
import Layout from "../components/Layout";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const { user } = useContext(AuthContext);

  const currentDate = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const roleTone =
    user?.role === "admin"
      ? "bg-slate-900 text-white"
      : user?.role === "hr"
        ? "bg-cyan-100 text-cyan-700"
        : "bg-emerald-100 text-emerald-700";

  return (
    <Layout>
      <section className="mb-8">
        <h1 className="page-title">Profile</h1>
        <p className="page-subtitle">
          Review your account details and assigned role in the workspace.
        </p>
      </section>

      {user && (
        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="panel overflow-hidden bg-slate-950 text-white">
            <div className="bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.18),transparent_30%),linear-gradient(135deg,#020617,#0f172a_55%,#134e4a)] p-8">
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-300/80">
                Account Summary
              </p>
              <div className="mt-8 flex items-start justify-between gap-4">
                <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] border border-white/10 bg-white/10 text-4xl font-semibold">
                  {user.name?.charAt(0)}
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-right">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-300">
                    Today
                  </p>
                  <p className="mt-2 text-sm font-medium text-white/90">
                    {currentDate}
                  </p>
                </div>
              </div>

              <h2 className="mt-8 text-3xl font-semibold">{user.name}</h2>
              <p className="mt-2 text-slate-300">{user.email}</p>

              <div className="mt-6 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold capitalize text-cyan-200">
                {user.role}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="panel p-6 sm:p-8">
              <h2 className="text-2xl font-semibold text-slate-900">
                Personal Details
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Your account information at a glance.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="panel-soft px-5 py-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Full name
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {user.name}
                  </p>
                </div>

                <div className="panel-soft px-5 py-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Email
                  </p>
                  <p className="mt-2 break-all text-lg font-semibold text-slate-900">
                    {user.email}
                  </p>
                </div>

                <div className="panel-soft px-5 py-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Role
                  </p>
                  <p
                    className={`mt-2 inline-flex rounded-full px-4 py-2 text-sm font-semibold capitalize ${roleTone}`}
                  >
                    {user.role}
                  </p>
                </div>

                <div className="panel-soft px-5 py-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Workspace access
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    Active
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <div className="stat-card">
                <p className="text-sm font-medium text-slate-500">Role type</p>
                <p className="mt-4 text-2xl font-semibold capitalize text-slate-900">
                  {user.role}
                </p>
              </div>
              <div className="stat-card">
                <p className="text-sm font-medium text-slate-500">Status</p>
                <p className="mt-4 text-2xl font-semibold text-emerald-600">
                  Active
                </p>
              </div>
              <div className="stat-card">
                <p className="text-sm font-medium text-slate-500">Profile</p>
                <p className="mt-4 text-2xl font-semibold text-slate-900">
                  Ready
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default Profile;
