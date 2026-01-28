import { createBrowserRouter, Navigate } from "react-router-dom";
import AppLayout from "../layout/AppLayout";

import DashboardPage from "../pages/DashboardPage";
import InventoriesPage from "../pages/InventoriesPage";
import FinancePage from "../pages/FinancePage";
import HRPage from "../pages/HRPage";
import CRMPage from "../pages/CRMPage";
import ProjectsPage from "../pages/ProjectsPage";
import LeadsPage from "../pages/LeadsPage";
import OperationsPage from "../pages/OperationsPage";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <Navigate to="/dashboard" replace /> },
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/inventories", element: <InventoriesPage /> },
      { path: "/finance", element: <FinancePage /> },
      { path: "/hr", element: <HRPage /> },
      { path: "/crm", element: <CRMPage /> },
      { path: "/projects", element: <ProjectsPage /> },
      { path: "/leads", element: <LeadsPage /> },
      { path: "/operations", element: <OperationsPage /> },
    ],
  },
]);
