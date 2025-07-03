
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const KategoriBarang = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    id: null,
    nama_kategori: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/kategori', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Gagal memuat data kategori');
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
      nama_kategori: ''
    });
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      if (isEditing) {
        // Update existing category
        const { id, ...updateData } = formData;
        await axios.put(`/api/kategori/${id}`, updateData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Kategori berhasil diperbarui');
      } else {
        // Create new category
        await axios.post('/api/kategori', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Kategori berhasil ditambahkan');
      }
      
      resetForm();
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error(error.response?.data?.message || 'Gagal menyimpan kategori');
    }
  };

  const handleEdit = (category) => {
    setFormData({
      id: category.id,
      nama_kategori: category.nama_kategori
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/kategori/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Kategori berhasil dihapus');
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Gagal menghapus kategori. Pastikan tidak ada barang yang menggunakan kategori ini.');
    }
  };

  return (
    <div className="content-wrapper">
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Manajemen Kategori Barang</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item"><a href="#">Home</a></li>
                <li className="breadcrumb-item active">Kategori Barang</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-5">
              <div className="card card-primary">
                <div className="card-header">
                  <h3 className="card-title">{isEditing ? 'Edit Kategori' : 'Tambah Kategori Baru'}</h3>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="card-body">
                    <div className="form-group">
                      <label htmlFor="nama_kategori">Nama Kategori</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="nama_kategori" 
                        name="nama_kategori"
                        value={formData.nama_kategori}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="card-footer">
                    <button type="submit" className="btn btn-primary">
                      {isEditing ? 'Update' : 'Simpan'}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary ml-2" 
                      onClick={resetForm}
                    >
                      Batal
                    </button>
                  </div>
                </form>
              </div>
            </div>
            
            <div className="col-md-7">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Daftar Kategori Barang</h3>
                </div>
                <div className="card-body">
                  {loading ? (
                    <p>Loading...</p>
                  ) : (
                    <table className="table table-bordered table-striped">
                      <thead>
                        <tr>
                          <th style={{ width: '10%' }}>No</th>
                          <th>Nama Kategori</th>
                          <th style={{ width: '25%' }}>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categories.length > 0 ? (
                          categories.map((category, index) => (
                            <tr key={category.id}>
                              <td>{index + 1}</td>
                              <td>{category.nama_kategori}</td>
                              <td>
                                <button 
                                  className="btn btn-sm btn-warning mr-1" 
                                  onClick={() => handleEdit(category)}
                                >
                                  Edit
                                </button>
                                <button 
                                  className="btn btn-sm btn-danger" 
                                  onClick={() => handleDelete(category.id)}
                                >
                                  Hapus
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="3" className="text-center">Tidak ada data kategori</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default KategoriBarang;
