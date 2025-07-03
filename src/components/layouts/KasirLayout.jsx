
import React, { useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';

const KasirLayout = ({ user, onLogout }) => {
  useEffect(() => {
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
              {user?.nama || 'Kasir'}
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

      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        {/* Brand Logo */}
        <Link to="/kasir/penjualan" className="brand-link">
          <span className="brand-text font-weight-light ml-3">Toko Bangunan</span>
        </Link>

        {/* Sidebar */}
        <div className="sidebar">
          {/* Sidebar Menu */}
          <nav className="mt-2">
            <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
              <li className="nav-item">
                <Link to="/kasir/penjualan" className="nav-link">
                  <i className="nav-icon fas fa-cash-register"></i>
                  <p>Penjualan</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/kasir/riwayat" className="nav-link">
                  <i className="nav-icon fas fa-history"></i>
                  <p>Riwayat Penjualan</p>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Content */}
      <div className="content-wrapper">
        <Outlet />
      </div>

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

export default KasirLayout;
