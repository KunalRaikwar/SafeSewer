import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SafetyProvider } from './context/SafetyContext';
import { AppLayout } from './components/layout/AppLayout';
import { WorkerLayout } from './components/layout/WorkerLayout';

// Pages
import { LoginPage } from './pages/auth/LoginPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { JobsPage } from './pages/jobs/JobsPage';
import { JobDetailPage } from './pages/jobs/JobDetailPage';
import { WorkersPage } from './pages/workers/WorkersPage';
import { DevicesPage } from './pages/devices/DevicesPage';
import { MapPage } from './pages/map/MapPage';
import { AlertsPage } from './pages/alerts/AlertsPage';
import { IncidentsPage } from './pages/incidents/IncidentsPage';
import { ReportsPage } from './pages/reports/ReportsPage';
import { SettingsPage } from './pages/settings/SettingsPage';

// Worker Pages
import { WorkerHomePage } from './pages/worker/WorkerHomePage';
import { WorkerJobPage } from './pages/worker/WorkerJobPage';
import { WorkerSafetyPage } from './pages/worker/WorkerSafetyPage';
import { WorkerPpePage } from './pages/worker/WorkerPpePage';
import { WorkerAlertsPage } from './pages/worker/WorkerAlertsPage';
import { WorkerProfilePage } from './pages/worker/WorkerProfilePage';

export function App() {
  return (
    <SafetyProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Supervisor / Municipal Admin Console Routes */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/jobs/:id" element={<JobDetailPage />} />
            <Route path="/workers" element={<WorkersPage />} />
            <Route path="/devices" element={<DevicesPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/incidents" element={<IncidentsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Worker Mobile-First Safety Application Routes */}
          <Route path="/worker" element={<WorkerLayout />}>
            <Route index element={<WorkerHomePage />} />
            <Route path="job" element={<WorkerJobPage />} />
            <Route path="safety" element={<WorkerSafetyPage />} />
            <Route path="ppe" element={<WorkerPpePage />} />
            <Route path="alerts" element={<WorkerAlertsPage />} />
            <Route path="profile" element={<WorkerProfilePage />} />
          </Route>

          {/* Catch-all Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </SafetyProvider>
  );
}

export default App;
