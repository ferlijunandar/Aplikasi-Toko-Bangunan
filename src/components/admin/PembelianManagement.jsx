
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { toast } from 'react-toastify';

const PembelianManagement = () => {
  const [pembelian, setPembelian] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPembelian();
  }, []);

  const fetchPembelian = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/pembelian', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPembelian(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pembelian:', error);
      toast.error('Gagal memuat data pembelian');
      setLoading(false);
    }
  };

  return (
    <div className="content-wrapper">
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Manajemen Pembelian</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item"><a href="#">Home</a></li>
                <li className="breadcrumb-item active">Pembelian</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="content">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Data Pembelian</h3>
            <div className="card-tools">
              <Link to="/admin/pembelian/tambah" className="btn btn-primary btn-sm">
                <i className="fas fa-plus"></i> Tambah Pembelian
              </Link>
            </div>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Tanggal</th>
                      <th>Supplier</th>
                      <th>Total</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pembelian.length > 0 ? (
                      pembelian.map((item, index) => (
                        <tr key={item.id}>
                          <td>{index + 1}</td>
                          <td>{moment(item.tanggal).format('DD/MM/YYYY')}</td>
                          <td>{item.nama_supplier}</td>
                          <td>
                            {new Intl.NumberFormat('id-ID', {
                              style: 'currency',
                              currency: 'IDR'
                            }).format(item.total_harga)}
                          </td>
                          <td>
                            <Link
                              to={`/admin/pembelian/${item.id}`}
                              className="btn btn-info btn-sm mr-1"
                            >
                              <i className="fas fa-eye"></i> Detail
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">
                          Tidak ada data pembelian
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PembelianManagement;
