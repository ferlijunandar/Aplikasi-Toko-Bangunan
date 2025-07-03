import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const PenjualanManagement = () => {
  const [penjualanList, setPenjualanList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPenjualan();
  }, []);

  const fetchPenjualan = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/penjualan', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPenjualanList(response.data);
    } catch (error) {
      console.error('Error fetching penjualan:', error);
      toast.error('Gagal memuat data penjualan');
    } finally {
      setLoading(false);
    }
  };

  const formatRupiah = (number) => {
    if (!number || isNaN(number)) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
  };

  const formatTanggal = (tanggalString) => {
    if (!tanggalString) return '-';
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(tanggalString).toLocaleDateString('id-ID', options);
  };

  return (
    <div className="content-wrapper">
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Manajemen Penjualan</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item"><Link to="/kasir">Home</Link></li>
                <li className="breadcrumb-item active">Penjualan</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="content">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Daftar Penjualan</h3>
            <div className="card-tools">
              <Link to="/kasir/penjualan/tambah" className="btn btn-primary btn-sm">
                Tambah Penjualan
              </Link>
            </div>
          </div>
          <div className="card-body table-responsive">
            {loading ? (
              <div>Loading...</div>
            ) : (
              <table className="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Tanggal</th>
                    <th>Invoice</th>
                    <th>Pelanggan</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {penjualanList.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center">Belum ada data penjualan</td>
                    </tr>
                  ) : (
                    penjualanList.map((penjualan, index) => (
                      <tr key={penjualan.id}>
                        <td>{index + 1}</td>
                        <td>{formatTanggal(penjualan.tanggal)}</td>
                        <td>{penjualan.invoice || '-'}</td>
                        <td>{penjualan.nama_pelanggan || '-'}</td> {/* ✅ Perbaikan disini */}
                        <td>{formatRupiah(penjualan.total_harga || penjualan.total)}</td>
                        <td>
                          <span className="badge badge-success">
                            {penjualan.status || 'Selesai'}
                          </span>
                        </td>
                        <td>
                          <Link to={`/kasir/penjualan/${penjualan.id}`} className="btn btn-info btn-sm">
                            Detail
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PenjualanManagement;
