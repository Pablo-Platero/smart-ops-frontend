import { createBrowserRouter, Navigate } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import LoginPage from "../pages/LoginPage";

import DashboardPage from "../pages/DashboardPage";
import InventoriesPage from "../pages/InventoriesPage";
import FinancePage from "../pages/FinancePage";
import HRPage from "../pages/HRPage";
import CRMPage from "../pages/CRMPage";
import OperationsPage from "../pages/OperationsPage";


export const router = createBrowserRouter([

   {
    path: "/login",
    element: <LoginPage />,
  },

  //Redirección inicial
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <Navigate to="/dashboard" replace /> },
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/inventories", element: <InventoriesPage /> },
      { path: "/finance", element: <FinancePage /> },
      { path: "/hr", element: <HRPage /> },
      { path: "/crm", element: <CRMPage /> },
      { path: "/operations", element: <OperationsPage /> },
    ],
  },
]);
