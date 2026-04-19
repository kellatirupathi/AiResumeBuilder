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
import AdminSetPasswordPage from "./pages/auth/admin/AdminSetPasswordPage.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminUsersPage from "./pages/admin/AdminUsersPage.jsx";
import AdminResumesPage from "./pages/admin/AdminResumesPage.jsx";
import AdminUserDetailPage from "./pages/admin/AdminUserDetailPage.jsx";
import AdminUserResumesPage from "./pages/admin/AdminUserResumesPage.jsx";
import AdminStudentIdsPage from "./pages/admin/AdminStudentIdsPage.jsx";
import AdminNotificationsPage from "./pages/admin/AdminNotificationsPage.jsx";
import AdminAccountsPage from "./pages/admin/AdminAccountsPage.jsx";
import AdminInviteUsersPage from "./pages/admin/AdminInviteUsersPage.jsx";
import AuthPage from "./pages/auth/customAuth/AuthPage.jsx";
import GoogleCallbackPage from "./pages/auth/customAuth/GoogleCallbackPage.jsx";
import ResumePreparation from "./pages/public/ResumePreparation.jsx";
import CoverLetterPreparation from "./pages/public/CoverLetterPreparation.jsx";
import { resumeStore, persistor } from "./store/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import PublicResumeView from "./pages/public/PublicResumeView.jsx";
import PublicCoverLetterPage from "./pages/public/PublicCoverLetterPage.jsx";
import EditCoverLetter from "./pages/dashboard/cover-letter/[id]/EditCoverLetter.jsx";
import CreateCoverLetterPage from "./pages/dashboard/cover-letter/creation/CreateCoverLetterPage.jsx";
import AdminCoverLettersPage from "./pages/admin/AdminCoverLettersPage.jsx";
import ProfilePage from "./pages/profile/ProfilePage.jsx";
import NiatManagementPage from "./pages/admin/NiatManagementPage.jsx";
import ResetPasswordPage from "./pages/auth/customAuth/ResetPasswordPage.jsx";
import ForgotPasswordPage from "./pages/auth/customAuth/ForgotPasswordPage.jsx";
import CompleteProfilePage from "./pages/onboarding/CompleteProfilePage.jsx"; // <-- MODIFIED: IMPORTED NEW PAGE
import Documentation from "./pages/documentation/Documentation.jsx";
import ATSCheckerPage from "./pages/ats/ATSCheckerPage.jsx";
import ResumesPage from "./pages/resumes/ResumesPage.jsx";
import CoverLettersPage from "./pages/cover-letters/CoverLettersPage.jsx";
import ChangePasswordPage from "./pages/change-password/ChangePasswordPage.jsx";
import UserNotificationsPage from "./pages/notifications/UserNotificationsPage.jsx";
import PublicDocumentationPage from "./pages/public/PublicDocumentationPage.jsx";
import PublicATSCheckerPage from "./pages/public/PublicATSCheckerPage.jsx";
import PublicResumesPage from "./pages/public/PublicResumesPage.jsx";
import PublicCoverLettersPage from "./pages/public/PublicCoverLettersPage.jsx";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { VITE_GOOGLE_CLIENT_ID } from './config/config.js';
import { HelmetProvider } from 'react-helmet-async';
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { queryClient, queryPersistOptions } from "./lib/queryClient.js";

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
        path: "/dashboard/cover-letter/:id",
        element: <EditCoverLetter />,
      },
      {
        path: "/cover-letter/creation-part",
        element: <CreateCoverLetterPage />,
      },
      {
        path: "/profile",
        element: <ProfilePage />
      },
      {
        path: "/app/documentation",
        element: <Documentation />
      },
      {
        path: "/app/ats-checker",
        element: <ATSCheckerPage />
      },
      {
        path: "/app/resumes",
        element: <ResumesPage />
      },
      {
        path: "/app/cover-letters",
        element: <CoverLettersPage />
      },
      {
        path: "/change-password",
        element: <ChangePasswordPage />
      },
      {
        path: "/notifications",
        element: <UserNotificationsPage />
      },
      {
        path: "/complete-profile",
        element: <CompleteProfilePage />,
      }
    ],
  },
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/documentation",
    element: <PublicDocumentationPage />,
  },
  {
    path: "/ats-checker",
    element: <PublicATSCheckerPage />,
  },
  {
    path: "/resumes",
    element: <PublicResumesPage />,
  },
  {
    path: "/cover-letters",
    element: <PublicCoverLettersPage />,
  },
  {
    path: "/resume-preparation",
    element: <ResumePreparation />,
  },
  {
    path: "/cover-letter-preparation",
    element: <CoverLetterPreparation />,
  },
  {
    path: "/auth/sign-in",
    element: <AuthPage />,
  },
  {
    path: "/auth/google/callback",
    element: <GoogleCallbackPage />,
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
  {
    path: "/public/cover-letter/:slugOrId",
    element: <PublicCoverLetterPage />,
  },
  {
    path: "/admin/login",
    element: <AdminLoginPage />,
  },
  {
    path: "/admin/set-password",
    element: <AdminSetPasswordPage />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "users", element: <AdminUsersPage /> },
      { path: "users/:userId", element: <AdminUserDetailPage /> },
      { path: "resumes", element: <AdminResumesPage /> },
      { path: "cover-letters", element: <AdminCoverLettersPage /> },
      { path: "resumes/:userId", element: <AdminUserResumesPage /> },
      { path: "student-ids", element: <AdminStudentIdsPage /> },
      { path: "notifications", element: <AdminNotificationsPage /> },
      { path: "invite-users", element: <AdminInviteUsersPage /> },
      { path: "accounts", element: <AdminAccountsPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <HelmetProvider>
    <GoogleOAuthProvider clientId={VITE_GOOGLE_CLIENT_ID}>
      <Provider store={resumeStore}>
        <PersistGate loading={null} persistor={persistor}>
          <PersistQueryClientProvider client={queryClient} persistOptions={queryPersistOptions}>
            <React.StrictMode>
              <RouterProvider router={router} />
            </React.StrictMode>
          </PersistQueryClientProvider>
        </PersistGate>
      </Provider>
    </GoogleOAuthProvider>
  </HelmetProvider>
);
