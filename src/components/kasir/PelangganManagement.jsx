
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const KasirPelangganManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    id: null,
    nama: '',
    alamat: '',
    telepon: '',
    email: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/pelanggan', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCustomers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching customers:', error);
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
      nama: '',
      alamat: '',
      telepon: '',
      email: ''
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
      fetchCustomers();
      
    } catch (error) {
      console.error('Error saving customer:', error);
      toast.error('Gagal menyimpan data pelanggan');
    }
  };

  const handleEdit = (customer) => {
    setFormData({
      id: customer.id,
      nama: customer.nama,
      alamat: customer.alamat || '',
      telepon: customer.telepon || '',
      email: customer.email || ''
    });
    setIsEditing(true);
  };

  return (
    <div className="content-wrapper">
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Manajemen Pelanggan</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="content">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              {isEditing ? 'Edit Pelanggan' : 'Tambah Pelanggan'}
            </h3>
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
                      name="nama"
                      value={formData.nama}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Telepon</label>
                    <input
                      type="text"
                      className="form-control"
                      name="telepon"
                      value={formData.telepon}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
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

              <div>
                <button type="submit" className="btn btn-primary">
                  {isEditing ? 'Update' : 'Simpan'}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    className="btn btn-secondary ml-2"
                    onClick={resetForm}
                  >
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
                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Nama</th>
                      <th>Telepon</th>
                      <th>Email</th>
                      <th>Alamat</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.length > 0 ? (
                      customers.map((customer, index) => (
                        <tr key={customer.id}>
                          <td>{index + 1}</td>
                          <td>{customer.nama}</td>
                          <td>{customer.telepon || '-'}</td>
                          <td>{customer.email || '-'}</td>
                          <td>{customer.alamat || '-'}</td>
                          <td>
                            <button
                              className="btn btn-info btn-sm"
                              onClick={() => handleEdit(customer)}
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center">
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

export default KasirPelangganManagement;
