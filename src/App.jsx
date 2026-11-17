import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Deposit from "./pages/Deposit";
import Withdraw from "./pages/Withdraw";
import Transactions from "./pages/Transactions";
import Transfer from "./pages/Transfer";
import Beneficiaries from "./pages/Beneficiaries";
import Profile from "./pages/Profile";

import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Customers from "./pages/admin/Customers";
import AdminAccounts from "./pages/admin/AdminAccounts";
import Approvals from "./pages/admin/Approvals";
import AdminTransactions from "./pages/admin/AdminTransactions";

// Protected Route
function ProtectedRoute({ children, allowedRole }) {
  const token = sessionStorage.getItem("token");
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return (
      <Navigate to={user.role === "ADMIN" ? "/admin" : "/dashboard"} replace />
    );
  }

  return children;
}

// Placeholder for admin pages not created yet
function ComingSoon({ title }) {
  return (
    <div className="rounded-2xl bg-white p-10 shadow-sm">
      <h2 className="text-2xl font-bold text-[#12372a]">{title}</h2>
      <p className="mt-2 text-slate-500">This section is coming soon.</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Customer Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRole="CUSTOMER">
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/deposit"
          element={
            <ProtectedRoute allowedRole="CUSTOMER">
              <Deposit />
            </ProtectedRoute>
          }
        />

        <Route
          path="/withdraw"
          element={
            <ProtectedRoute allowedRole="CUSTOMER">
              <Withdraw />
            </ProtectedRoute>
          }
        />

        <Route
          path="/transactions"
          element={
            <ProtectedRoute allowedRole="CUSTOMER">
              <Transactions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/transfer"
          element={
            <ProtectedRoute allowedRole="CUSTOMER">
              <Transfer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/beneficiaries"
          element={
            <ProtectedRoute allowedRole="CUSTOMER">
              <Beneficiaries />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRole="CUSTOMER">
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="customers" element={<Customers />} />
          <Route path="accounts" element={<AdminAccounts />} />
          <Route path="approvals" element={<Approvals />} />
          <Route path="transactions" element={<AdminTransactions />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
