import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ProtectedRoute from '@/components/ProtectedRoute';

// Auth pages
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';

// Layout
import MainLayout from './components/layout/MainLayout';
import AdminLayout from '@/pages/admin/AdminLayout';

// Public pages
import Home from '@/pages/Home';
import VoucherList from '@/pages/VoucherList';
import VoucherDetail from '@/pages/VoucherDetail';
import BrandList from '@/pages/BrandList';
import BrandDetail from '@/pages/BrandDetail';
import CategoryList from '@/pages/CategoryList';
import CategoryDetail from '@/pages/CategoryDetail';
import SearchPage from '@/pages/SearchPage';
import PlatformPage from '@/pages/PlatformPage';
import BlogList from '@/pages/BlogList';
import BlogDetail from '@/pages/BlogDetail';
import AboutPage from '@/pages/AboutPage';
import PolicyPage from '@/pages/PolicyPage';

// Admin pages
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminVouchers from '@/pages/admin/AdminVouchers';
import AdminBrands from '@/pages/admin/AdminBrands';
import AdminCategories from '@/pages/admin/AdminCategories';
import AdminBlog from '@/pages/admin/AdminBlog';
import AdminBanners from '@/pages/admin/AdminBanners';
import AdminHotBanners from '@/pages/admin/AdminHotBanners';
import AdminInterestPosts from '@/pages/admin/AdminInterestPosts';
import AdminSync from '@/pages/admin/AdminSync';
import AdminStats from '@/pages/admin/AdminStats';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-sm text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Public routes with MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/ma-giam-gia" element={<VoucherList />} />
        <Route path="/ma-giam-gia/:slug" element={<VoucherDetail />} />
        <Route path="/thuong-hieu" element={<BrandList />} />
        <Route path="/thuong-hieu/:slug" element={<BrandDetail />} />
        <Route path="/danh-muc" element={<CategoryList />} />
        <Route path="/danh-muc/:slug" element={<CategoryDetail />} />
        <Route path="/tim-kiem" element={<SearchPage />} />
        <Route path="/san/:platform" element={<PlatformPage />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/gioi-thieu" element={<AboutPage />} />
        <Route path="/chinh-sach" element={<PolicyPage />} />
        <Route path="/dieu-khoan" element={<PolicyPage />} />
        <Route path="/lien-he" element={<AboutPage />} />
      </Route>

      {/* Admin routes - protected */}
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/vouchers" element={<AdminVouchers />} />
          <Route path="/admin/brands" element={<AdminBrands />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/blog" element={<AdminBlog />} />
          <Route path="/admin/banners" element={<AdminBanners />} />
          <Route path="/admin/hot-banners" element={<AdminHotBanners />} />
          <Route path="/admin/interests" element={<AdminInterestPosts />} />
          <Route path="/admin/sync" element={<AdminSync />} />
          <Route path="/admin/stats" element={<AdminStats />} />
        </Route>
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
