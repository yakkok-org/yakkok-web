import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import FAQPage from "./pages/FAQPage";
import BlogIndexPage from "./pages/BlogIndexPage";
import BlogPostPage from "./pages/BlogPostPage";
import SharePage from "./pages/SharePage";

const AdminGuard = lazy(() => import("./admin/AdminGuard"));
const AdminLayout = lazy(() => import("./admin/AdminLayout"));
const AdminLogin = lazy(() => import("./admin/pages/AdminLogin"));
const Overview = lazy(() => import("./admin/pages/Overview"));
const UsersList = lazy(() => import("./admin/pages/UsersList"));
const UserDetail = lazy(() => import("./admin/pages/UserDetail"));
const NotificationDispatches = lazy(
  () => import("./admin/pages/NotificationDispatches")
);
const MedicationHistories = lazy(
  () => import("./admin/pages/MedicationHistories")
);
const ProfileShares = lazy(() => import("./admin/pages/ProfileShares"));
const Devices = lazy(() => import("./admin/pages/Devices"));
const SystemLog = lazy(() => import("./admin/pages/SystemLog"));

function AdminFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center text-gray-500">
      로딩 중…
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/blog" element={<BlogIndexPage />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />
      <Route path="/share/:code" element={<SharePage />} />
      <Route
        path="/dashboard/login"
        element={
          <Suspense fallback={<AdminFallback />}>
            <AdminLogin />
          </Suspense>
        }
      />
      <Route
        path="/dashboard"
        element={
          <Suspense fallback={<AdminFallback />}>
            <AdminGuard>
              <AdminLayout />
            </AdminGuard>
          </Suspense>
        }
      >
        <Route
          index
          element={
            <Suspense fallback={<AdminFallback />}>
              <Overview />
            </Suspense>
          }
        />
        <Route
          path="users"
          element={
            <Suspense fallback={<AdminFallback />}>
              <UsersList />
            </Suspense>
          }
        />
        <Route
          path="users/:userId"
          element={
            <Suspense fallback={<AdminFallback />}>
              <UserDetail />
            </Suspense>
          }
        />
        <Route
          path="notifications"
          element={
            <Suspense fallback={<AdminFallback />}>
              <NotificationDispatches />
            </Suspense>
          }
        />
        <Route
          path="medications"
          element={
            <Suspense fallback={<AdminFallback />}>
              <MedicationHistories />
            </Suspense>
          }
        />
        <Route
          path="shares"
          element={
            <Suspense fallback={<AdminFallback />}>
              <ProfileShares />
            </Suspense>
          }
        />
        <Route
          path="devices"
          element={
            <Suspense fallback={<AdminFallback />}>
              <Devices />
            </Suspense>
          }
        />
        <Route
          path="system"
          element={
            <Suspense fallback={<AdminFallback />}>
              <SystemLog />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
