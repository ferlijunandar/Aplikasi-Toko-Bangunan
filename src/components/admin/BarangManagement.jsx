import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Select from 'react-select';

const BarangManagement = () => {
  const [barangList, setBarangList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [kategoriOptions, setKategoriOptions] = useState([]);
  const [jenisOptions, setJenisOptions] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    nama_barang: '',
    id_kategori: '',
    id_jenis: '',
    harga_beli: 0,
    harga_jual: 0,
    stok: 0
  });

  // Fetch all necessary data on component mount
  useEffect(() => {
    fetchBarang();
    fetchKategori();
    fetchJenis();
  }, []);

  const fetchBarang = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/barang', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBarangList(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching barang:', error);
      toast.error('Gagal memuat data barang');
      setLoading(false);
    }
  };

  const fetchKategori = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/kategori', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const options = response.data.map(kategori => ({
        value: kategori.id,
        label: kategori.nama_kategori
      }));
      
      setKategoriOptions(options);
    } catch (error) {
      console.error('Error fetching kategori:', error);
      toast.error('Gagal memuat data kategori');
    }
  };

  const fetchJenis = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/jenis', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const options = response.data.map(jenis => ({
        value: jenis.id,
        label: jenis.nama_jenis
      }));
      
      setJenisOptions(options);
    } catch (error) {
      console.error('Error fetching jenis:', error);
      toast.error('Gagal memuat data jenis');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (selectedOption, { name }) => {
    setFormData(prev => ({
      ...prev,
      [name]: selectedOption.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      
      if (isEditing) {
        await axios.put(`/api/barang/${formData.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Barang berhasil diperbarui');
      } else {
        await axios.post('/api/barang', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Barang berhasil ditambahkan');
      }
      
      resetForm();
      fetchBarang();
    } catch (error) {
      console.error('Error saving barang:', error);
      toast.error(error.response?.data?.message || 'Gagal menyimpan data barang');
    }
  };

  const handleEdit = (barang) => {
    setFormData({
      id: barang.id,
      nama_barang: barang.nama_barang,
      id_kategori: barang.id_kategori,
      id_jenis: barang.id_jenis,
      harga_beli: barang.harga_beli,
      harga_jual: barang.harga_jual,
      stok: barang.stok
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus barang ini?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/barang/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Barang berhasil dihapus');
      fetchBarang();
    } catch (error) {
      console.error('Error deleting barang:', error);
      toast.error('Gagal menghapus barang. Pastikan barang ini tidak terkait dengan transaksi.');
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      nama_barang: '',
      id_kategori: '',
      id_jenis: '',
      harga_beli: 0,
      harga_jual: 0,
      stok: 0
    });
    setIsEditing(false);
  };

  const getKategoriName = (id) => {
    const kategori = kategoriOptions.find(opt => opt.value === id);
    return kategori ? kategori.label : '-';
  };

  const getJenisName = (id) => {
    const jenis = jenisOptions.find(opt => opt.value === id);
    return jenis ? jenis.label : '-';
  };

  return (
    <div className="content-wrapper">
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Manajemen Barang</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item"><a href="#">Home</a></li>
                <li className="breadcrumb-item active">Barang</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="content">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">{isEditing ? 'Edit Barang' : 'Tambah Barang Baru'}</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Nama Barang</label>
                    <input
                      type="text"
                      className="form-control"
                      name="nama_barang"
                      value={formData.nama_barang}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Kategori</label>
                    <Select
                      options={kategoriOptions}
                      onChange={(selected) => handleSelectChange(selected, { name: 'id_kategori' })}
                      value={kategoriOptions.find(option => option.value === formData.id_kategori)}
                      placeholder="Pilih Kategori"
                      isSearchable
                      className="basic-select"
                      classNamePrefix="select"
                    />
                  </div>
                  <div className="form-group">
                    <label>Jenis</label>
                    <Select
                      options={jenisOptions}
                      onChange={(selected) => handleSelectChange(selected, { name: 'id_jenis' })}
                      value={jenisOptions.find(option => option.value === formData.id_jenis)}
                      placeholder="Pilih Jenis"
                      isSearchable
                      className="basic-select"
                      classNamePrefix="select"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Harga Beli</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">Rp</span>
                      </div>
                      <input
                        type="number"
                        className="form-control"
                        name="harga_beli"
                        value={formData.harga_beli}
                        onChange={handleInputChange}
                        required
                        min="0"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Harga Jual</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">Rp</span>
                      </div>
                      <input
                        type="number"
                        className="form-control"
                        name="harga_jual"
                        value={formData.harga_jual}
                        onChange={handleInputChange}
                        required
                        min="0"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Stok</label>
                    <input
                      type="number"
                      className="form-control"
                      name="stok"
                      value={formData.stok}
                      onChange={handleInputChange}
                      required
                      min="0"
                    />
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
            <h3 className="card-title">Daftar Barang</h3>
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
                      <th>Nama Barang</th>
                      <th>Kategori</th>
                      <th>Jenis</th>
                      <th>Harga Beli</th>
                      <th>Harga Jual</th>
                      <th>Stok</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {barangList.length > 0 ? (
                      barangList.map(barang => (
                        <tr key={barang.id}>
                          <td>{barang.nama_barang}</td>
                          <td>{getKategoriName(barang.id_kategori)}</td>
                          <td>{getJenisName(barang.id_jenis)}</td>
                          <td>Rp {Number(barang.harga_beli).toLocaleString('id-ID')}</td>
                          <td>Rp {Number(barang.harga_jual).toLocaleString('id-ID')}</td>
                          <td>{barang.stok}</td>
                          <td>
                            <button
                              className="btn btn-info btn-sm mr-1"
                              onClick={() => handleEdit(barang)}
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDelete(barang.id)}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center">
                          Tidak ada data barang
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

export default BarangManagement;