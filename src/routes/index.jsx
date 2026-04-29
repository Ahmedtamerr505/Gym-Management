import { createBrowserRouter, Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import AdminDashboard from '../pages/AdminDashboard';
import MemberDashboard from '../pages/MemberDashboard';
import Login from '../pages/Login';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        path: "admin",
        element: <AdminDashboard />,
      },
      {
        path: "member",
        element: <MemberDashboard />,
      },
    ],
  },
]);