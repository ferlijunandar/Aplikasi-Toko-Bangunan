import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const PelangganManagement = () => {
  const [pelanggan, setPelanggan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    id: null,
    nama_pelanggan: '',
    alamat: '',
    kontak: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchPelanggan();
  }, []);

  const fetchPelanggan = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/pelanggan', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPelanggan(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pelanggan:', error);
      toast.error('Gagal memuat data pelanggan');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      id: null,
      nama_pelanggan: '',
      alamat: '',
      kontak: '',
    });
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      
      if (isEditing) {
        await axios.put(`/api/pelanggan/${formData.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Pelanggan berhasil diperbarui');
      } else {
        await axios.post('/api/pelanggan', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Pelanggan berhasil ditambahkan');
      }
      
      resetForm();
      fetchPelanggan();
    } catch (error) {
      console.error('Error saving pelanggan:', error);
      toast.error(error.response?.data?.message || 'Gagal menyimpan data pelanggan');
    }
  };

  const handleEdit = (customer) => {
    setFormData({
      id: customer.id,
      nama_pelanggan: customer.nama_pelanggan,
      alamat: customer.alamat,
      kontak: customer.kontak,
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus pelanggan ini?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/pelanggan/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Pelanggan berhasil dihapus');
      fetchPelanggan();
    } catch (error) {
      console.error('Error deleting pelanggan:', error);
      toast.error('Gagal menghapus pelanggan. Pastikan pelanggan ini tidak terkait dengan transaksi.');
    }
  };

  return (
    <div className="content-wrapper">
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Manajemen Pelanggan</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item"><a href="#">Home</a></li>
                <li className="breadcrumb-item active">Pelanggan</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="content">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">{isEditing ? 'Edit Pelanggan' : 'Tambah Pelanggan Baru'}</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Nama Pelanggan</label>
                    <input
                      type="text"
                      className="form-control"
                      name="nama_pelanggan"
                      value={formData.nama_pelanggan}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Kontak</label>
                    <input
                      type="text"
                      className="form-control"
                      name="kontak"
                      value={formData.kontak}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Alamat</label>
                    <textarea
                      className="form-control"
                      name="alamat"
                      value={formData.alamat}
                      onChange={handleInputChange}
                      rows="3"
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="d-flex">
                <button type="submit" className="btn btn-primary mr-2">
                  {isEditing ? 'Update' : 'Simpan'}
                </button>
                {isEditing && (
                  <button type="button" className="btn btn-secondary" onClick={resetForm}>
                    Batal
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Daftar Pelanggan</h3>
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
                      <th>Nama</th>
                      <th>Alamat</th>
                      <th>Kontak</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pelanggan.length > 0 ? (
                      pelanggan.map(customer => (
                        <tr key={customer.id}>
                          <td>{customer.nama_pelanggan}</td>
                          <td>{customer.alamat || '-'}</td>
                          <td>{customer.kontak}</td>
                          <td>
                            <button
                              className="btn btn-info btn-sm mr-1"
                              onClick={() => handleEdit(customer)}
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDelete(customer.id)}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">
                          Tidak ada data pelanggan
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

export default PelangganManagement;