import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const SupplierManagement = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    id: null,
    nama_supplier: '',
    kontak: '',
    alamat: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/supplier', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuppliers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      toast.error('Gagal memuat data supplier');
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
      nama_supplier: '',
      kontak: '',
      alamat: ''
    });
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      
      if (isEditing) {
        await axios.put(`/api/supplier/${formData.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Supplier berhasil diperbarui');
      } else {
        await axios.post('/api/supplier', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Supplier berhasil ditambahkan');
      }
      
      resetForm();
      fetchSuppliers();
    } catch (error) {
      console.error('Error saving supplier:', error);
      toast.error(error.response?.data?.message || 'Gagal menyimpan data supplier');
    }
  };

  const handleEdit = (supplier) => {
    setFormData({
      id: supplier.id,
      nama_supplier: supplier.nama_supplier,
      kontak: supplier.kontak,
      alamat: supplier.alamat
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus supplier ini?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/supplier/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Supplier berhasil dihapus');
      fetchSuppliers();
    } catch (error) {
      console.error('Error deleting supplier:', error);
      toast.error('Gagal menghapus supplier. Pastikan supplier ini tidak terkait dengan transaksi.');
    }
  };

  return (
    <div className="content-wrapper">
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Manajemen Supplier</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item"><a href="#">Home</a></li>
                <li className="breadcrumb-item active">Supplier</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="content">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">{isEditing ? 'Edit Supplier' : 'Tambah Supplier Baru'}</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Nama Supplier</label>
                    <input
                      type="text"
                      className="form-control"
                      name="nama_supplier"
                      value={formData.nama_supplier}
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
                      required
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
            <h3 className="card-title">Daftar Supplier</h3>
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
                      <th>Nama Supplier</th>
                      <th>Kontak</th>
                      <th>Alamat</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {suppliers.length > 0 ? (
                      suppliers.map(supplier => (
                        <tr key={supplier.id}>
                          <td>{supplier.nama_supplier}</td>
                          <td>{supplier.kontak}</td>
                          <td>{supplier.alamat}</td>
                          <td>
                            <button
                              className="btn btn-info btn-sm mr-1"
                              onClick={() => handleEdit(supplier)}
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDelete(supplier.id)}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">
                          Tidak ada data supplier
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

export default SupplierManagement;