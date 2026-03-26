import React, { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

const Tasks = () => {
  const { user } = useContext(AuthContext);
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const canReviewAllTasks = user?.role === "admin" || user?.role === "hr";

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      const res = await API.get("/tasks");
      setAllTasks(res.data);
    } catch (error) {
      setErrorMessage("Couldn't load task details right now.");
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const updateStatus = async (id, status) => {
    try {
      setErrorMessage("");
      await API.put(`/tasks/${id}`, { status });
      fetchTasks();
    } catch (error) {
      setErrorMessage("Task status couldn't be updated.");
      console.error("Error updating task:", error);
    }
  };

  const statusClass = (status) => {
    if (status === "Completed") {
      return "status-badge bg-emerald-100 text-emerald-700";
    }

    if (status === "In Progress") {
      return "status-badge bg-amber-100 text-amber-700";
    }

    return "status-badge bg-slate-100 text-slate-600";
  };

  const myTasks = allTasks.filter((task) => task.assignedTo?.email === user?.email);
  const visibleTasks = canReviewAllTasks ? allTasks : myTasks;
  const filteredTasks = visibleTasks.filter((task) => {
    if (activeFilter === "all") {
      return true;
    }

    return task.status.toLowerCase().replace(/\s+/g, "-") === activeFilter;
  });

  const totalTasks = visibleTasks.length;
  const completedTasks = visibleTasks.filter(
    (task) => task.status === "Completed"
  ).length;
  const inProgressTasks = visibleTasks.filter(
    (task) => task.status === "In Progress"
  ).length;
  const pendingTasks = visibleTasks.filter(
    (task) => task.status === "Pending"
  ).length;

  const filterOptions = [
    { id: "all", label: "All", count: totalTasks },
    { id: "pending", label: "Pending", count: pendingTasks },
    { id: "in-progress", label: "In Progress", count: inProgressTasks },
    { id: "completed", label: "Completed", count: completedTasks },
  ];

  const pageTitle = canReviewAllTasks ? "Task Overview" : "My Tasks";
  const pageSubtitle = canReviewAllTasks
    ? "See who completed work, what is still pending, and where the team needs attention."
    : "Track your assigned work and keep progress moving with clear status updates.";

  return (
    <>
      <section className="hero-banner animate-rise">
        <div className="section-header mb-0">
          <div>
            <p className="hero-kicker">
              {canReviewAllTasks ? "Team execution" : "Personal workflow"}
            </p>
            <h1 className="page-title">{pageTitle}</h1>
            <p className="hero-copy">{pageSubtitle}</p>
          </div>

          <div className="hero-metrics">
            <span className="metric-chip">Visible: {loading ? "--" : totalTasks}</span>
            <span className="metric-chip">
              In progress: {loading ? "--" : inProgressTasks}
            </span>
            <span className="metric-chip">
              Completed: {loading ? "--" : completedTasks}
            </span>
          </div>
        </div>
      </section>

      <section className="mt-6 flex flex-wrap gap-3 animate-rise-delay-1">
        {filterOptions.map((filter) => {
          const isActive = activeFilter === filter.id;

          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActiveFilter(filter.id)}
              className={isActive ? "primary-btn px-4 py-2" : "secondary-btn px-4 py-2"}
            >
              {filter.label} ({filter.count})
            </button>
          );
        })}
      </section>

      <section className="mb-8 mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="stat-card animate-rise-delay-1">
          <p className="text-sm font-medium text-slate-500">Visible tasks</p>
          <p className="mt-4 text-4xl font-semibold text-slate-900">
            {loading ? "--" : totalTasks}
          </p>
        </div>
        <div className="stat-card animate-rise-delay-1">
          <p className="text-sm font-medium text-slate-500">Pending</p>
          <p className="mt-4 text-4xl font-semibold text-slate-700">
            {loading ? "--" : pendingTasks}
          </p>
        </div>
        <div className="stat-card animate-rise-delay-2">
          <p className="text-sm font-medium text-slate-500">In progress</p>
          <p className="mt-4 text-4xl font-semibold text-amber-600">
            {loading ? "--" : inProgressTasks}
          </p>
        </div>
        <div className="stat-card animate-rise-delay-2">
          <p className="text-sm font-medium text-slate-500">Completed</p>
          <p className="mt-4 text-4xl font-semibold text-emerald-600">
            {loading ? "--" : completedTasks}
          </p>
        </div>
      </section>

      <section className="panel animate-rise-delay-2 overflow-hidden">
        {errorMessage && (
          <div className="border-b border-slate-200 px-6 py-4">
            <div className="feedback-banner feedback-banner-error">
              {errorMessage}
            </div>
          </div>
        )}

        <div className="border-b border-slate-200/80 px-6 py-5">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="hero-kicker">
                {canReviewAllTasks ? "Team progress" : "Your task list"}
              </p>
              <h2 className="text-2xl font-semibold text-slate-900">
                {canReviewAllTasks ? "Team progress" : "Your task list"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {canReviewAllTasks
                  ? "Review ownership, progress, and completion across the team."
                  : "Move tasks from pending to in progress or complete when work is done."}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
              Showing {loading ? "..." : filteredTasks.length} of{" "}
              {loading ? "..." : totalTasks} tasks
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Assigned To</th>
                <th>Status</th>
                <th>Updated</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-slate-500">
                    Loading task overview...
                  </td>
                </tr>
              ) : filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <tr key={task._id}>
                    <td>
                      <div>
                        <p className="font-semibold text-slate-900">{task.title}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          {task.description || "No description provided"}
                        </p>
                      </div>
                    </td>
                    <td>
                      <div>
                        <p className="font-semibold text-slate-900">
                          {task.assignedTo?.name || "Unknown"}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {task.assignedTo?.email || "No email available"}
                        </p>
                      </div>
                    </td>
                    <td>
                      <span className={statusClass(task.status)}>{task.status}</span>
                    </td>
                    <td>{new Date(task.updatedAt).toLocaleDateString()}</td>
                    <td>
                      {canReviewAllTasks ? (
                        <span className="text-sm text-slate-500">
                          {task.status === "Completed"
                            ? "Completed"
                            : task.status === "In Progress"
                              ? "In progress"
                              : "Pending"}
                        </span>
                      ) : task.status === "Completed" ? (
                        <span className="status-badge bg-emerald-100 text-emerald-700">
                          Done
                        </span>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {task.status === "Pending" && (
                            <button
                              type="button"
                              onClick={() => updateStatus(task._id, "In Progress")}
                              className="secondary-btn px-4 py-2"
                            >
                              Start
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => updateStatus(task._id, "Completed")}
                            className="primary-btn px-4 py-2"
                          >
                            Mark Done
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-slate-500">
                    {canReviewAllTasks
                      ? "No tasks match the current filter."
                      : "No tasks assigned yet."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default Tasks;
