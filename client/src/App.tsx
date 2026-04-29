import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { PageSkeleton } from '@/components/ui/StateComponents';

// Static (always loaded — small)
import LandingPage from '@/pages/landing/LandingPage';
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';

// Lazy-loaded engine pages
const DashboardPage = React.lazy(() => import('@/pages/dashboard/DashboardPage'));
const PivotPage = React.lazy(() => import('@/pages/dashboard/PivotPage'));
const CopilotPage = React.lazy(() => import('@/pages/dashboard/CopilotPage'));
const RadarPage = React.lazy(() => import('@/pages/dashboard/RadarPage'));
const SettingsPage = React.lazy(() => import('@/pages/dashboard/SettingsPage'));

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/signup" element={<SignupPage />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<Suspense fallback={<PageSkeleton />}><DashboardPage /></Suspense>} />
            <Route path="/dashboard/pivot" element={<Suspense fallback={<PageSkeleton />}><PivotPage /></Suspense>} />
            <Route path="/dashboard/copilot" element={<Suspense fallback={<PageSkeleton />}><CopilotPage /></Suspense>} />
            <Route path="/dashboard/radar" element={<Suspense fallback={<PageSkeleton />}><RadarPage /></Suspense>} />
            <Route path="/dashboard/settings" element={<Suspense fallback={<PageSkeleton />}><SettingsPage /></Suspense>} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
