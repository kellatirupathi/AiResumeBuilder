// C:\Users\NxtWave\Downloads\code\Frontend\src\main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/home/HomePage.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import { EditResume } from "./pages/dashboard/edit-resume/[resume_id]/EditResume.jsx";
import ViewResume from "./pages/dashboard/view-resume/[resume_id]/ViewResume.jsx";
import AdminLoginPage from "./pages/auth/admin/AdminLoginPage.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AuthPage from "./pages/auth/customAuth/AuthPage.jsx";
import { resumeStore } from "./store/store";
import { Provider } from "react-redux";
import PublicResumeView from "./pages/public/PublicResumeView.jsx"; 
import ProfilePage from "./pages/profile/ProfilePage.jsx";
import NiatManagementPage from "./pages/admin/NiatManagementPage.jsx";
import ResetPasswordPage from "./pages/auth/customAuth/ResetPasswordPage.jsx"; // NEW

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/dashboard/edit-resume/:resume_id",
        element: <EditResume />,
      },
      {
        path: "/dashboard/view-resume/:resume_id",
        element: <ViewResume />,
      },
      {
        path: "/profile",
        element: <ProfilePage />
      }
    ],
  },
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/auth/sign-in",
    element: <AuthPage />,
  },
  {
    path: "/reset-password", // NEW ROUTE
    element: <ResetPasswordPage />,
  },
  {
    path: "/public/resume/:resume_id",
    element: <PublicResumeView />,
  },
  {
    path: "/admin/login",
    element: <AdminLoginPage />,
  },
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/admin/niat-ids",
    element: <NiatManagementPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={resumeStore}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
);
