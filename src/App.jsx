import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { NotificationProvider } from './context/NotificationContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { BottomNav } from './components/common/BottomNav';
import { Alert } from './components/common/Alert';

// Auth Pages
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

const MainLayout = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(location.pathname);

  if (isAuthPage) {
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
    <AuthProvider>
      <LanguageProvider>
        <NotificationProvider>
          <BrowserRouter>
            <MainLayout>
              <Routes>
                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Farmer Routes */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/farms" element={<MyFarms />} />
                <Route path="/farms/:farmId" element={<FarmDetails />} />
                <Route path="/crops" element={<MyCrops />} />
                <Route path="/crops/:cropId" element={<CropDetails />} />
                <Route path="/add-activity" element={<AddActivity />} />
                <Route path="/activity-history" element={<ActivityHistory />} />
                <Route path="/activities/:activityId" element={<ActivityDetails />} />
                <Route path="/activities/:activityId/edit" element={<EditActivity />} />
                <Route path="/reminders" element={<Reminders />} />
                <Route path="/add-reminder" element={<AddReminder />} />
                <Route path="/expenses" element={<Expenses />} />
                <Route path="/add-expense" element={<AddExpense />} />
                <Route path="/expense-reports" element={<ExpenseReports />} />
                <Route path="/reports" element={<ComprehensiveReports />} />
                <Route path="/ai-assistant" element={<AIKhetSaathi />} />
                <Route path="/ai-history" element={<AIChatHistory />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/language" element={<LanguageSelection />} />
                <Route path="/help" element={<HelpFAQ />} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/farmers" element={<AdminFarmers />} />
                <Route path="/admin/farms" element={<AdminFarms />} />
                <Route path="/admin/crops" element={<AdminCrops />} />
                <Route path="/admin/activities" element={<AdminActivities />} />
                <Route path="/admin/reports" element={<AdminReports />} />
                <Route path="/admin/notifications" element={<AdminNotifications />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </MainLayout>
          </BrowserRouter>
        </NotificationProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
