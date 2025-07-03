import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const AdminLayout = ({ user, onLogout }) => {
  const [openMenus, setOpenMenus] = useState({
    masterData: false,
    laporan: false
  });
  
  const location = useLocation();
  
  useEffect(() => {
    // Memeriksa path saat ini untuk menentukan menu yang aktif
    const currentPath = location.pathname;
    
    if (currentPath.includes('/admin/users') || 
        currentPath.includes('/admin/kategori') || 
        currentPath.includes('/admin/jenis') || 
        currentPath.includes('/admin/barang') || 
        currentPath.includes('/admin/supplier') || 
        currentPath.includes('/admin/pelanggan')) {
      setOpenMenus(prev => ({ ...prev, masterData: true }));
    }
    
    if (currentPath.includes('/admin/laporan')) {
      setOpenMenus(prev => ({ ...prev, laporan: true }));
    }
  }, [location]);

  useEffect(() => {
    // Initialize AdminLTE after component is mounted
    if (window.$ && window.$.AdminLTE) {
      window.$.AdminLTE.init();
    }
    
    // Initialize AdminLTE sidebar functionality after component mounts
    setTimeout(() => {
      if (window.$) {
        window.$('[data-widget="pushmenu"]').on('click', function() {
          document.body.classList.toggle('sidebar-collapse');
        });
      }
    }, 100);

    return () => {
      // Cleanup event listeners when component unmounts
      if (window.$) {
        window.$('[data-widget="pushmenu"]').off('click');
      }
    };
  }, []);

  // Toggle dropdown menu
  const toggleMenu = (menu) => {
    setOpenMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  return (
    <div className="wrapper">
      {/* Navbar */}
      <nav className="main-header navbar navbar-expand navbar-white navbar-light">
        {/* Left navbar links */}
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link" data-widget="pushmenu" href="#" role="button">
              <i className="fas fa-bars"></i>
            </a>
          </li>
        </ul>

        {/* Right navbar links */}
        <ul className="navbar-nav ml-auto">
          <li className="nav-item dropdown">
            <a className="nav-link" data-toggle="dropdown" href="#">
              <i className="fas fa-user mr-2"></i>
              {user?.nama || 'Admin'}
            </a>
            <div className="dropdown-menu dropdown-menu-right">
              <span className="dropdown-item dropdown-header">{user?.username}</span>
              <div className="dropdown-divider"></div>
              <button onClick={onLogout} className="dropdown-item">
                <i className="fas fa-sign-out-alt mr-2"></i> Logout
              </button>
            </div>
          </li>
        </ul>
      </nav>

      {/* Main Sidebar Container */}
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        {/* Brand Logo */}
        <Link to="/admin/dashboard" className="brand-link">
          <span className="brand-text font-weight-light ml-3">Toko Bangunan</span>
        </Link>

        {/* Sidebar */}
        <div className="sidebar">
          {/* Sidebar Menu */}
          <nav className="mt-2">
            <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
              <li className="nav-item">
                <Link to="/admin/dashboard" className="nav-link">
                  <i className="nav-icon fas fa-tachometer-alt"></i>
                  <p>Dashboard</p>
                </Link>
              </li>

              <li className={`nav-item ${openMenus.masterData ? 'menu-open' : ''}`}>
                <a href="#" className="nav-link" onClick={() => toggleMenu('masterData')}>
                  <i className="nav-icon fas fa-database"></i>
                  <p>
                    Master Data
                    <i className="right fas fa-angle-left"></i>
                  </p>
                </a>
                <ul className="nav nav-treeview" style={{ display: openMenus.masterData ? 'block' : 'none' }}>
                  <li className="nav-item">
                    <Link to="/admin/users" className="nav-link">
                      <i className="far fa-circle nav-icon"></i>
                      <p>Users</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/admin/kategori" className="nav-link">
                      <i className="far fa-circle nav-icon"></i>
                      <p>Kategori Barang</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/admin/jenis" className="nav-link">
                      <i className="far fa-circle nav-icon"></i>
                      <p>Jenis Barang</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/admin/barang" className="nav-link">
                      <i className="far fa-circle nav-icon"></i>
                      <p>Barang</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/admin/supplier" className="nav-link">
                      <i className="far fa-circle nav-icon"></i>
                      <p>Supplier</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/admin/pelanggan" className="nav-link">
                      <i className="far fa-circle nav-icon"></i>
                      <p>Pelanggan</p>
                    </Link>
                  </li>
                </ul>
              </li>

              <li className="nav-item">
                <Link to="/admin/pembelian" className="nav-link">
                  <i className="nav-icon fas fa-shopping-cart"></i>
                  <p>Pembelian</p>
                </Link>
              </li>

              <li className={`nav-item ${openMenus.laporan ? 'menu-open' : ''}`}>
                <a href="#" className="nav-link" onClick={() => toggleMenu('laporan')}>
                  <i className="nav-icon fas fa-chart-bar"></i>
                  <p>
                    Laporan
                    <i className="right fas fa-angle-left"></i>
                  </p>
                </a>
                <ul className="nav nav-treeview" style={{ display: openMenus.laporan ? 'block' : 'none' }}>
                  <li className="nav-item">
                    <Link to="/admin/laporan/penjualan" className="nav-link">
                      <i className="far fa-circle nav-icon"></i>
                      <p>Laporan Penjualan</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/admin/laporan/pembelian" className="nav-link">
                      <i className="far fa-circle nav-icon"></i>
                      <p>Laporan Pembelian</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/admin/laporan/stok" className="nav-link">
                      <i className="far fa-circle nav-icon"></i>
                      <p>Laporan Stok</p>
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Content */}
      <Outlet />

      {/* Footer */}
      <footer className="main-footer">
        <div className="float-right d-none d-sm-block">
          <b>Version</b> 1.0.0
        </div>
        <strong>Copyright &copy; {new Date().getFullYear()} <a href="#">Toko Bangunan</a>.</strong> All rights reserved.
      </footer>
    </div>
  );
};

export default AdminLayout;