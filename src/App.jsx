/**
 * App.jsx: App skeleton: providers (router, auth, toasts) and the list of all routes.
 */
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import MainLayout from './layouts/MainLayout.jsx';

import LandingPage from './pages/LandingPage.jsx';
import ExplorePage from './pages/ExplorePage.jsx';
import TemplateDetailsPage from './pages/TemplateDetailsPage.jsx';
import GeneratorPage from './pages/GeneratorPage.jsx';
import LiveEditorPage from './pages/LiveEditorPage.jsx';
import UploadPage from './pages/UploadPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import AuthCallbackPage from './pages/AuthCallbackPage.jsx';
import StandalonePreviewPage from './pages/StandalonePreviewPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Dedicated OAuth popup callback handler */}
            <Route path="auth/callback" element={<AuthCallbackPage />} />

            {/* Standalone full-window portfolio site preview routes */}
            <Route path="site/:id" element={<StandalonePreviewPage />} />
            <Route path="preview/:id" element={<StandalonePreviewPage />} />

            <Route path="/" element={<MainLayout />}>
              <Route index element={<LandingPage />} />
              <Route path="explore" element={<ExplorePage />} />
              <Route path="template/:id" element={<TemplateDetailsPage />} />
              <Route path="generator" element={<GeneratorPage />} />
              <Route path="editor" element={<LiveEditorPage />} />
              <Route path="upload" element={<UploadPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="admin" element={<AdminDashboardPage />} />
              <Route path="reset-password" element={<ResetPasswordPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
