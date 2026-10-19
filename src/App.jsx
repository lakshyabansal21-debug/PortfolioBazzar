/**
 * App.jsx: App skeleton: providers (theme, router, auth, toasts), the error boundary, and the list of all routes.
 *
 * Every page is loaded with lazy(): the browser downloads a page's code only when someone opens it,
 * so the first visit is much lighter (the 24 template generators alone are thousands of lines).
 */
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import MainLayout from './layouts/MainLayout.jsx';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';
import PageLoader from './components/common/PageLoader.jsx';
import NavigationProgress from './components/common/NavigationProgress.jsx';
import RouteSeo from './components/common/RouteSeo.jsx';

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
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <ErrorBoundary>
              <NavigationProgress />
              <RouteSeo />
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
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
