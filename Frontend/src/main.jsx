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
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminUsersPage from "./pages/admin/AdminUsersPage.jsx";
import AdminResumesPage from "./pages/admin/AdminResumesPage.jsx";
import AdminUserDetailPage from "./pages/admin/AdminUserDetailPage.jsx";
import AdminUserResumesPage from "./pages/admin/AdminUserResumesPage.jsx";
import AdminStudentIdsPage from "./pages/admin/AdminStudentIdsPage.jsx";
import AuthPage from "./pages/auth/customAuth/AuthPage.jsx";
import { resumeStore } from "./store/store";
import { Provider } from "react-redux";
import PublicResumeView from "./pages/public/PublicResumeView.jsx"; 
import ProfilePage from "./pages/profile/ProfilePage.jsx";
import NiatManagementPage from "./pages/admin/NiatManagementPage.jsx";
import ResetPasswordPage from "./pages/auth/customAuth/ResetPasswordPage.jsx";
import ForgotPasswordPage from "./pages/auth/customAuth/ForgotPasswordPage.jsx";
import CompleteProfilePage from "./pages/onboarding/CompleteProfilePage.jsx"; // <-- MODIFIED: IMPORTED NEW PAGE
import Documentation from "./pages/documentation/Documentation.jsx";
import ATSCheckerPage from "./pages/ats/ATSCheckerPage.jsx";
import ResumesPage from "./pages/resumes/ResumesPage.jsx";
import ChangePasswordPage from "./pages/change-password/ChangePasswordPage.jsx";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { VITE_GOOGLE_CLIENT_ID } from './config/config.js';
import { HelmetProvider } from 'react-helmet-async';

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
      },
      {
        path: "/documentation",
        element: <Documentation />
      },
      {
        path: "/ats-checker",
        element: <ATSCheckerPage />
      },
      {
        path: "/resumes",
        element: <ResumesPage />
      },
      {
        path: "/change-password",
        element: <ChangePasswordPage />
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
    path: "/reset-password",
    element: <ResetPasswordPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/public/resume/:resume_id",
    element: <PublicResumeView />,
  },
  // <-- MODIFIED: ADDED NEW ROUTE -->
  {
    path: "/complete-profile",
    element: <CompleteProfilePage />,
  },
  {
    path: "/admin/login",
    element: <AdminLoginPage />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "users", element: <AdminUsersPage /> },
      { path: "users/:userId", element: <AdminUserDetailPage /> },
      { path: "resumes", element: <AdminResumesPage /> },
      { path: "resumes/:userId", element: <AdminUserResumesPage /> },
      { path: "student-ids", element: <AdminStudentIdsPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <HelmetProvider>
    <GoogleOAuthProvider clientId={VITE_GOOGLE_CLIENT_ID}>
      <Provider store={resumeStore}>
        <React.StrictMode>
          <RouterProvider router={router} />
        </React.StrictMode>
      </Provider>
    </GoogleOAuthProvider>
  </HelmetProvider>
);
