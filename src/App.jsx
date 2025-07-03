import { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'admin-lte/dist/css/adminlte.min.css';
import './App.css';

// Auth Components
import Login from './components/auth/Login';

// Admin Components
import AdminLayout from './components/layouts/AdminLayout';
import Dashboard from './components/admin/Dashboard';
import UserManagement from './components/admin/UserManagement';
import KategoriBarang from './components/admin/KategoriBarang';
import JenisBarang from './components/admin/JenisBarang';
import BarangManagement from './components/admin/BarangManagement';
import SupplierManagement from './components/admin/SupplierManagement';
import PelangganManagement from './components/admin/PelangganManagement';
import PembelianManagement from './components/admin/PembelianManagement';
import PembelianForm from './components/admin/PembelianForm';
import PembelianDetail from './components/admin/PembelianDetail';
import LaporanPenjualan from './components/admin/LaporanPenjualan';
import LaporanPembelian from './components/admin/LaporanPembelian';
import LaporanStok from './components/admin/LaporanStok';

// Kasir Components
import KasirLayout from './components/layouts/KasirLayout';
import PenjualanManagement from './components/kasir/PenjualanManagement';
import PenjualanForm from './components/kasir/PenjualanForm';
import PenjualanDetail from './components/kasir/PenjualanDetail';
import KasirPelangganManagement from './components/kasir/PelangganManagement';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  // Protected Route component
  const ProtectedRoute = ({ children, requiredRole }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }

    if (requiredRole && user?.role !== requiredRole) {
      return <Navigate to={user?.role === 'admin' ? "/admin/dashboard" : "/kasir/penjualan"} />;
    }

    return children;
  };

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={
            isAuthenticated ? (
              user?.role === 'admin' ? <Navigate to="/admin/dashboard" /> : <Navigate to="/kasir/penjualan" />
            ) : (
              <Login onLogin={handleLogin} />
            )
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/admin/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="kategori" element={<KategoriBarang />} />
            <Route path="jenis" element={<JenisBarang />} />
            <Route path="barang" element={<BarangManagement />} />
            <Route path="supplier" element={<SupplierManagement />} />
            <Route path="pelanggan" element={<PelangganManagement />} />
            <Route path="pembelian" element={<PembelianManagement />} />
            <Route path="pembelian/tambah" element={<PembelianForm />} />
            <Route path="pembelian/:id" element={<PembelianDetail />} />
            <Route path="laporan/penjualan" element={<LaporanPenjualan />} />
            <Route path="laporan/pembelian" element={<LaporanPembelian />} />
            <Route path="laporan/stok" element={<LaporanStok />} />
            <Route path="*" element={<Navigate to="/admin/dashboard" />} />
          </Route>

          {/* Kasir Routes */}
          <Route path="/kasir" element={
            <ProtectedRoute requiredRole="kasir">
              <KasirLayout user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/kasir/penjualan" />} />
            <Route path="penjualan" element={<PenjualanManagement />} />
            <Route path="penjualan/tambah" element={<PenjualanForm />} />
            <Route path="penjualan/:id" element={<PenjualanDetail />} />
            <Route path="pelanggan" element={<KasirPelangganManagement />} />
            <Route path="*" element={<Navigate to="/kasir/penjualan" />} />
          </Route>

          {/* Default Redirect */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
