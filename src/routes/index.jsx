import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Unauthorized from "../pages/Unauthorized";
import DashboardLayout from "../layouts/DashboardLayout";
import AdminDashboard from "../pages/AdminDashboard";
import MembersPage from "../pages/MembersPage";
import TrainersPage from "../pages/TrainersPage";
import ClassesPage from "../pages/ClassesPage";
import PublicRoute from "./PublicRoute";
import Login from "../pages/Login";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    element: <PublicRoute />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
  {
    element: <ProtectedRoute allowedRoles={["Admin"]} />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
          {
            path: "admin",
            element: <AdminDashboard />,
          },
          {
            path: "members",
            element: <MembersPage />,
          },
          {
            path: "trainers",
            element: <TrainersPage />,
          },
          {
            path: "classes",
            element: <ClassesPage />,
          },
        ],
      },
    ],
  },
]);
