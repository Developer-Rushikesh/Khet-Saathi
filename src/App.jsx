import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { NotificationProvider } from './context/NotificationContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { BottomNav } from './components/common/BottomNav';
import { Alert } from './components/common/Alert';
import { LoadingSpinner } from './components/common/LoadingSpinner';

// Landing & Auth Pages
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { ForgotPassword } from './pages/auth/ForgotPassword';

// Farmer Pages
import { Dashboard } from './pages/farmer/Dashboard';
import { MyFarms } from './pages/farmer/MyFarms';
import { FarmDetails } from './pages/farmer/FarmDetails';
import { MyCrops } from './pages/farmer/MyCrops';
import { CropDetails } from './pages/farmer/CropDetails';
import { AddActivity } from './pages/farmer/AddActivity';
import { ActivityHistory } from './pages/farmer/ActivityHistory';
import { ActivityDetails } from './pages/farmer/ActivityDetails';
import { EditActivity } from './pages/farmer/EditActivity';
import { Reminders } from './pages/farmer/Reminders';
import { AddReminder } from './pages/farmer/AddReminder';
import { Expenses } from './pages/farmer/Expenses';
import { AddExpense } from './pages/farmer/AddExpense';
import { ExpenseReports } from './pages/farmer/ExpenseReports';
import { ComprehensiveReports } from './pages/farmer/ComprehensiveReports';
import { AIKhetSaathi } from './pages/farmer/AIKhetSaathi';
import { AIChatHistory } from './pages/farmer/AIChatHistory';
import { Notifications } from './pages/farmer/Notifications';
import { Profile } from './pages/farmer/Profile';
import { Settings } from './pages/farmer/Settings';
import { LanguageSelection } from './pages/farmer/LanguageSelection';
import { HelpFAQ } from './pages/farmer/HelpFAQ';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminFarmers } from './pages/admin/AdminFarmers';
import { AdminFarms } from './pages/admin/AdminFarms';
import { AdminCrops } from './pages/admin/AdminCrops';
import { AdminActivities } from './pages/admin/AdminActivities';
import { AdminReports } from './pages/admin/AdminReports';
import { AdminNotifications } from './pages/admin/AdminNotifications';

/**
 * Protected Route Guard Component
 * Ensures only authenticated users with valid role can access internal app pages.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <LoadingSpinner message="Verifying authentication session..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  return children;
};

const MainLayout = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const isPublicPage = ['/', '/login', '/register', '/forgot-password'].includes(location.pathname);

  if (isPublicPage) {
    return <main>{children}</main>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar onOpenMobileMenu={() => setIsMobileOpen(true)} />
      
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <Sidebar isMobileOpen={isMobileOpen} onCloseMobile={() => setIsMobileOpen(false)} />
        <main className="flex-1 min-w-0">{children}</main>
      </div>

      <BottomNav />
      <Alert />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <LanguageProvider>
          <NotificationProvider>
            <BrowserRouter>
              <MainLayout>
                <Routes>
                  {/* Public Landing & Auth Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />

                  {/* Protected Farmer Routes */}
                  <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['farmer']}><Dashboard /></ProtectedRoute>} />
                  <Route path="/farms" element={<ProtectedRoute allowedRoles={['farmer']}><MyFarms /></ProtectedRoute>} />
                  <Route path="/farms/:farmId" element={<ProtectedRoute allowedRoles={['farmer']}><FarmDetails /></ProtectedRoute>} />
                  <Route path="/crops" element={<ProtectedRoute allowedRoles={['farmer']}><MyCrops /></ProtectedRoute>} />
                  <Route path="/crops/:cropId" element={<ProtectedRoute allowedRoles={['farmer']}><CropDetails /></ProtectedRoute>} />
                  <Route path="/add-activity" element={<ProtectedRoute allowedRoles={['farmer']}><AddActivity /></ProtectedRoute>} />
                  <Route path="/activity-history" element={<ProtectedRoute allowedRoles={['farmer']}><ActivityHistory /></ProtectedRoute>} />
                  <Route path="/activities/:activityId" element={<ProtectedRoute allowedRoles={['farmer']}><ActivityDetails /></ProtectedRoute>} />
                  <Route path="/activities/:activityId/edit" element={<ProtectedRoute allowedRoles={['farmer']}><EditActivity /></ProtectedRoute>} />
                  <Route path="/reminders" element={<ProtectedRoute allowedRoles={['farmer']}><Reminders /></ProtectedRoute>} />
                  <Route path="/add-reminder" element={<ProtectedRoute allowedRoles={['farmer']}><AddReminder /></ProtectedRoute>} />
                  <Route path="/expenses" element={<ProtectedRoute allowedRoles={['farmer']}><Expenses /></ProtectedRoute>} />
                  <Route path="/add-expense" element={<ProtectedRoute allowedRoles={['farmer']}><AddExpense /></ProtectedRoute>} />
                  <Route path="/expense-reports" element={<ProtectedRoute allowedRoles={['farmer']}><ExpenseReports /></ProtectedRoute>} />
                  <Route path="/reports" element={<ProtectedRoute allowedRoles={['farmer']}><ComprehensiveReports /></ProtectedRoute>} />
                  <Route path="/ai-assistant" element={<ProtectedRoute allowedRoles={['farmer']}><AIKhetSaathi /></ProtectedRoute>} />
                  <Route path="/ai-history" element={<ProtectedRoute allowedRoles={['farmer']}><AIChatHistory /></ProtectedRoute>} />
                  <Route path="/notifications" element={<ProtectedRoute allowedRoles={['farmer']}><Notifications /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute allowedRoles={['farmer']}><Profile /></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute allowedRoles={['farmer']}><Settings /></ProtectedRoute>} />
                  <Route path="/language" element={<ProtectedRoute allowedRoles={['farmer']}><LanguageSelection /></ProtectedRoute>} />
                  <Route path="/help" element={<ProtectedRoute allowedRoles={['farmer']}><HelpFAQ /></ProtectedRoute>} />

                  {/* Protected Admin Routes */}
                  <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
                  <Route path="/admin/farmers" element={<ProtectedRoute allowedRoles={['admin']}><AdminFarmers /></ProtectedRoute>} />
                  <Route path="/admin/farms" element={<ProtectedRoute allowedRoles={['admin']}><AdminFarms /></ProtectedRoute>} />
                  <Route path="/admin/crops" element={<ProtectedRoute allowedRoles={['admin']}><AdminCrops /></ProtectedRoute>} />
                  <Route path="/admin/activities" element={<ProtectedRoute allowedRoles={['admin']}><AdminActivities /></ProtectedRoute>} />
                  <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['admin']}><AdminReports /></ProtectedRoute>} />
                  <Route path="/admin/notifications" element={<ProtectedRoute allowedRoles={['admin']}><AdminNotifications /></ProtectedRoute>} />

                  {/* Catch-all Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </MainLayout>
            </BrowserRouter>
          </NotificationProvider>
        </LanguageProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
