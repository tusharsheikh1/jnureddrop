import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import HomePage from './pages/public/HomePage';
import FindDonorsPage from './pages/public/FindDonorsPage';
import RequestsPage from './pages/public/RequestsPage';
import BlogPage from './pages/public/BlogPage';
import BlogPostPage from './pages/public/BlogPostPage';
import FaqPage from './pages/public/FaqPage';

// New Public Pages
import DonorDetailsPage from './pages/public/DonorDetailsPage';
import RequestDetailsPage from './pages/public/RequestDetailsPage';
import AboutUsPage from './pages/public/AboutUsPage';
import ContactUsPage from './pages/public/ContactUsPage';
import PrivacyPolicyPage from './pages/public/PrivacyPolicyPage';

import DonorLoginPage from './pages/donor/LoginPage';
import DonorRegisterPage from './pages/donor/RegisterPage';
import DonorVerifyEmailPage from './pages/donor/VerifyEmailPage';
import DonorDashboardPage from './pages/donor/DashboardPage';
import DonorProfilePage from './pages/donor/ProfilePage';
import DonorCreateRequestPage from './pages/donor/CreateRequestPage';
import DonorMyRequestsPage from './pages/donor/MyRequestsPage';

// New Donor Pages
import DonorEditProfilePage from './pages/donor/DonorEditProfilePage';
import NotificationsPage from './pages/donor/NotificationsPage';
import DonationHistoryPage from './pages/donor/DonationHistoryPage';
import GettingStartedPage from './pages/donor/GettingStartedPage';

import AdminLoginPage from './pages/admin/LoginPage';
import AdminDashboardPage from './pages/admin/DashboardPage';
import AdminDonorsPage from './pages/admin/DonorsPage';
import AdminBloodRequestsPage from './pages/admin/BloodRequestsPage';
import AdminBlogPage from './pages/admin/BlogPage';
import AdminStaffPage from './pages/admin/StaffPage';
import AdminSettingsPage from './pages/admin/SettingsPage';

function DonorRoute({ children }) {
  const { isLoggedIn, isDonor } = useAuth();
  if (!isLoggedIn) return <Navigate to="/donor/login" replace />;
  if (!isDonor)    return <Navigate to="/" replace />;
  return children;
}

function AdminRoute({ children }) {
  const { isLoggedIn, isAdmin } = useAuth();
  if (!isLoggedIn) return <Navigate to="/admin/login" replace />;
  if (!isAdmin)    return <Navigate to="/" replace />;
  return children;
}

function GuestRoute({ children, adminOnly = false }) {
  const { isLoggedIn, isDonor, isAdmin } = useAuth();
  if (isLoggedIn) {
    if (adminOnly && isAdmin) return <Navigate to="/admin/dashboard" replace />;
    if (!adminOnly && isDonor) return <Navigate to="/donor/dashboard" replace />;
    return <Navigate to="/" replace />;
  }
  return children;
}

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <div className="hidden md:block"><Footer /></div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NotificationProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/find" element={<Layout><FindDonorsPage /></Layout>} />
          <Route path="/requests" element={<Layout><RequestsPage /></Layout>} />
          <Route path="/blog" element={<Layout><BlogPage /></Layout>} />
          <Route path="/blog/:slug" element={<Layout><BlogPostPage /></Layout>} />
          <Route path="/faq" element={<Layout><FaqPage /></Layout>} />

          <Route path="/donors/:id" element={<Layout><DonorDetailsPage /></Layout>} />
          <Route path="/requests/:id" element={<Layout><RequestDetailsPage /></Layout>} />
          <Route path="/about" element={<Layout><AboutUsPage /></Layout>} />
          <Route path="/contact" element={<Layout><ContactUsPage /></Layout>} />
          <Route path="/privacy-policy" element={<Layout><PrivacyPolicyPage /></Layout>} />

          {/* Donor auth */}
          <Route path="/donor/login" element={<GuestRoute><Layout><DonorLoginPage /></Layout></GuestRoute>} />
          <Route path="/donor/register" element={<GuestRoute><Layout><DonorRegisterPage /></Layout></GuestRoute>} />
          <Route path="/donor/verify-email" element={<DonorVerifyEmailPage />} />

          {/* Donor protected */}
          <Route path="/donor/dashboard" element={<DonorRoute><Layout><DonorDashboardPage /></Layout></DonorRoute>} />
          <Route path="/donor/profile" element={<DonorRoute><Layout><DonorProfilePage /></Layout></DonorRoute>} />
          <Route path="/donor/profile/edit" element={<DonorRoute><Layout><DonorEditProfilePage /></Layout></DonorRoute>} />
          <Route path="/donor/history" element={<DonorRoute><Layout><DonationHistoryPage /></Layout></DonorRoute>} />
          <Route path="/notifications" element={<DonorRoute><Layout><NotificationsPage /></Layout></DonorRoute>} />
          <Route path="/donor/getting-started" element={<DonorRoute><Layout><GettingStartedPage /></Layout></DonorRoute>} />
          <Route path="/donor/blood-request/create" element={<DonorRoute><Layout><DonorCreateRequestPage /></Layout></DonorRoute>} />
          <Route path="/donor/my-requests" element={<DonorRoute><Layout><DonorMyRequestsPage /></Layout></DonorRoute>} />

          {/* Admin auth */}
          <Route path="/admin/login" element={<GuestRoute adminOnly><AdminLoginPage /></GuestRoute>} />

          {/* Admin protected */}
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
          <Route path="/admin/donors" element={<AdminRoute><AdminDonorsPage /></AdminRoute>} />
          <Route path="/admin/blood-requests" element={<AdminRoute><AdminBloodRequestsPage /></AdminRoute>} />
          <Route path="/admin/blog" element={<AdminRoute><AdminBlogPage /></AdminRoute>} />
          <Route path="/admin/staff" element={<AdminRoute><AdminStaffPage /></AdminRoute>} />
          <Route path="/admin/settings" element={<AdminRoute><AdminSettingsPage /></AdminRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </NotificationProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}
