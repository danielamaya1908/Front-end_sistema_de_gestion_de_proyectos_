import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ProjectsPage from "./pages/projects/Projects";
import UsersPage from "./pages/users/Users";
import TaskPage from "./pages/task/Task";
import DashboardPage from "./pages/DashboardPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import UserView from "./components/userView"; // ✅ Nuevo

import PrivateRoute from "./components/PrivateRoute";

import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <ToastContainer
        className="toast-container"
        position="top-right"
        autoClose={3000}
      />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* ✅ Nueva ruta para perfil */}
        <Route
          path="/perfil"
          element={
            <PrivateRoute>
              <UserView />
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="projects" />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="allocationTasks" element={<TaskPage />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
