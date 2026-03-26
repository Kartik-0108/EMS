import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import AddEmployee from "./pages/AddEmployee";
import Attendance from "./pages/Attendance";
import Profile from "./pages/Profile";
import Tasks from "./pages/Tasks";
import AddTask from "./pages/AddTask";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          element={
            <ProtectedRoute allowedRoles={["admin", "hr", "employee"]}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/profile" element={<Profile />} />

          <Route element={<ProtectedRoute allowedRoles={["admin", "hr"]} />}>
            <Route path="/employees" element={<Employees />} />
            <Route path="/add-task" element={<AddTask />} />
            <Route path="/attendance" element={<Attendance />} />

            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="/add-employee" element={<AddEmployee />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
