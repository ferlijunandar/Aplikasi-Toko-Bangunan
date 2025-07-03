import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

// Konfigurasi axios untuk baseURL dan interceptors
axios.defaults.baseURL = 'http://localhost:5000'; // Ubah ke port server backend Anda
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    id: null,
    nama: '',
    username: '',
    password: '',
    role: 'kasir'
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/users');
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Gagal memuat data pengguna');
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
      username: '',
      password: '',
      role: 'kasir'
    });
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // Update existing user
        const { id, ...updateData } = formData;
        // If password is empty, don't send it (it means don't change password)
        if (!updateData.password) {
          delete updateData.password;
        }
        
        await axios.put(`/api/users/${id}`, updateData);
        toast.success('Pengguna berhasil diperbarui');
      } else {
        // Create new user
        await axios.post('/api/users', formData);
        toast.success('Pengguna berhasil ditambahkan');
      }
      
      resetForm();
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error(error.response?.data?.message || 'Gagal menyimpan pengguna');
    }
  };

  const handleEdit = (user) => {
    setFormData({
      id: user.id,
      nama: user.nama,
      username: user.username,
      password: '', // Don't show password, leave it blank
      role: user.role
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
      return;
    }
    
    try {
      await axios.delete(`/api/users/${id}`);
      toast.success('Pengguna berhasil dihapus');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Gagal menghapus pengguna');
    }
  };

  return (
    <div className="content-wrapper">
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Manajemen Pengguna</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item"><a href="#">Home</a></li>
                <li className="breadcrumb-item active">Pengguna</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="card card-primary">
                <div className="card-header">
                  <h3 className="card-title">{isEditing ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</h3>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="card-body">
                    <div className="form-group">
                      <label htmlFor="nama">Nama</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="nama" 
                        name="nama"
                        value={formData.nama}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="username">Username</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="username" 
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="password">Password {isEditing && '(Kosongkan jika tidak diubah)'}</label>
                      <input 
                        type="password" 
                        className="form-control" 
                        id="password" 
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required={!isEditing}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="role">Role</label>
                      <select 
                        className="form-control" 
                        id="role" 
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="admin">Admin</option>
                        <option value="kasir">Kasir</option>
                      </select>
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
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Daftar Pengguna</h3>
                </div>
                <div className="card-body">
                  {loading ? (
                    <p>Loading...</p>
                  ) : (
                    <table className="table table-bordered table-striped">
                      <thead>
                        <tr>
                          <th>No</th>
                          <th>Nama</th>
                          <th>Username</th>
                          <th>Role</th>
                          <th>Tgl Dibuat</th>
                          <th>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.length > 0 ? (
                          users.map((user, index) => (
                            <tr key={user.id}>
                              <td>{index + 1}</td>
                              <td>{user.nama}</td>
                              <td>{user.username}</td>
                              <td>
                                <span className={`badge ${user.role === 'admin' ? 'badge-primary' : 'badge-info'}`}>
                                  {user.role}
                                </span>
                              </td>
                              <td>{new Date(user.created_at).toLocaleDateString('id-ID')}</td>
                              <td>
                                <button 
                                  className="btn btn-sm btn-warning mr-1" 
                                  onClick={() => handleEdit(user)}
                                >
                                  Edit
                                </button>
                                <button 
                                  className="btn btn-sm btn-danger" 
                                  onClick={() => handleDelete(user.id)}
                                >
                                  Hapus
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="text-center">Tidak ada data pengguna</td>
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

export default UserManagement;