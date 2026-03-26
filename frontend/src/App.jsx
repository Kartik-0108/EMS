import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import AddEmployee from "./pages/AddEmployee";
import Attendance from "./pages/Attendance";
import Profile from "./pages/Profile";
import Tasks from "./pages/Tasks";          
import AddTask from "./pages/AddTask";      

// Components
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin", "hr", "employee"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Employees (Admin + HR) */}
        <Route
          path="/employees"
          element={
            <ProtectedRoute allowedRoles={["admin", "hr"]}>
              <Employees />
            </ProtectedRoute>
          }
        />

        {/* Add Employee (Admin only) */}
        <Route
          path="/add-employee"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AddEmployee />
            </ProtectedRoute>
          }
        />

        {/* 🔥 Tasks (ALL users) */}
        <Route
          path="/tasks"
          element={
            <ProtectedRoute allowedRoles={["admin", "hr", "employee"]}>
              <Tasks />
            </ProtectedRoute>
          }
        />

        {/* 🔥 Assign Task (Admin + HR) */}
        <Route
          path="/add-task"
          element={
            <ProtectedRoute allowedRoles={["admin", "hr"]}>
              <AddTask />
            </ProtectedRoute>
          }
        />

        {/* Attendance (optional now) */}
        <Route
          path="/attendance"
          element={
            <ProtectedRoute allowedRoles={["admin", "hr"]}>
              <Attendance />
            </ProtectedRoute>
          }
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["admin", "hr", "employee"]}>
              <Profile />
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
};

export default App;
