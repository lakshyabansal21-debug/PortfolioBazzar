/**
 * App.jsx: App skeleton: providers (router, auth, toasts) and the list of all routes.
 * Pages are loaded on demand (React.lazy) so a visitor only downloads the page they open.
 */
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import MainLayout from './layouts/MainLayout.jsx';

const LandingPage = lazy(() => import('./pages/LandingPage.jsx'));
const ExplorePage = lazy(() => import('./pages/ExplorePage.jsx'));
const TemplateDetailsPage = lazy(() => import('./pages/TemplateDetailsPage.jsx'));
const GeneratorPage = lazy(() => import('./pages/GeneratorPage.jsx'));
const LiveEditorPage = lazy(() => import('./pages/LiveEditorPage.jsx'));
const UploadPage = lazy(() => import('./pages/UploadPage.jsx'));
const ProfilePage = lazy(() => import('./pages/ProfilePage.jsx'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage.jsx'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage.jsx'));
const AuthCallbackPage = lazy(() => import('./pages/AuthCallbackPage.jsx'));
const StandalonePreviewPage = lazy(() => import('./pages/StandalonePreviewPage.jsx'));

/** Small spinner shown while a page is being downloaded. */
function PageLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center" role="status" aria-label="Loading page">
      <div className="w-8 h-8 rounded-full border-2 border-line border-t-accent animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Suspense fallback={<PageLoader />}>
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
          </Suspense>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
    </ThemeProvider>
  );
}
