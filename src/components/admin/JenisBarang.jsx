
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const JenisBarang = () => {
  const [jenisItems, setJenisItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    id: null,
    nama_jenis: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchJenisBarang();
  }, []);

  const fetchJenisBarang = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/jenis', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJenisItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching jenis barang:', error);
      toast.error('Gagal memuat data jenis barang');
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
      nama_jenis: ''
    });
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      if (isEditing) {
        // Update existing jenis
        const { id, ...updateData } = formData;
        await axios.put(`/api/jenis/${id}`, updateData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Jenis barang berhasil diperbarui');
      } else {
        // Create new jenis
        await axios.post('/api/jenis', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Jenis barang berhasil ditambahkan');
      }
      
      resetForm();
      fetchJenisBarang();
    } catch (error) {
      console.error('Error saving jenis barang:', error);
      toast.error(error.response?.data?.message || 'Gagal menyimpan jenis barang');
    }
  };

  const handleEdit = (jenis) => {
    setFormData({
      id: jenis.id,
      nama_jenis: jenis.nama_jenis
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus jenis barang ini?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/jenis/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Jenis barang berhasil dihapus');
      fetchJenisBarang();
    } catch (error) {
      console.error('Error deleting jenis barang:', error);
      toast.error('Gagal menghapus jenis barang. Pastikan tidak ada barang yang menggunakan jenis ini.');
    }
  };

  return (
    <div className="content-wrapper">
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Manajemen Jenis Barang</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item"><a href="#">Home</a></li>
                <li className="breadcrumb-item active">Jenis Barang</li>
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
                  <h3 className="card-title">{isEditing ? 'Edit Jenis Barang' : 'Tambah Jenis Barang Baru'}</h3>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="card-body">
                    <div className="form-group">
                      <label htmlFor="nama_jenis">Nama Jenis Barang</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="nama_jenis" 
                        name="nama_jenis"
                        value={formData.nama_jenis}
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
                  <h3 className="card-title">Daftar Jenis Barang</h3>
                </div>
                <div className="card-body">
                  {loading ? (
                    <p>Loading...</p>
                  ) : (
                    <table className="table table-bordered table-striped">
                      <thead>
                        <tr>
                          <th style={{ width: '10%' }}>No</th>
                          <th>Nama Jenis</th>
                          <th style={{ width: '25%' }}>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {jenisItems.length > 0 ? (
                          jenisItems.map((jenis, index) => (
                            <tr key={jenis.id}>
                              <td>{index + 1}</td>
                              <td>{jenis.nama_jenis}</td>
                              <td>
                                <button 
                                  className="btn btn-sm btn-warning mr-1" 
                                  onClick={() => handleEdit(jenis)}
                                >
                                  Edit
                                </button>
                                <button 
                                  className="btn btn-sm btn-danger" 
                                  onClick={() => handleDelete(jenis.id)}
                                >
                                  Hapus
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="3" className="text-center">Tidak ada data jenis barang</td>
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

export default JenisBarang;
