import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error('Username dan password harus diisi');
      return;
    }

    setLoading(true);

    try {
      // Gunakan URL lengkap backend untuk menghindari error 404
      const response = await axios.post('http://localhost:5000/api/login', { 
        username, 
        password 
      });

      const { token, user } = response.data;

      if (token && user) {
        onLogin(user, token);
        toast.success('Login berhasil');
      } else {
        throw new Error('Token tidak ditemukan');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.response) {
        toast.error(error.response.data.message || 'Login gagal');
      } else if (error.request) {
        toast.error('Tidak dapat terhubung ke server');
      } else {
        toast.error('Terjadi kesalahan saat login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="card">
          <div className="card-header text-center">
            <h3><b>Toko</b>Bangunan</h3>
          </div>
          <div className="card-body">
            <p className="login-box-msg">Silakan login untuk memulai</p>

            <form onSubmit={handleSubmit}>
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-user"></span>
                  </div>
                </div>
              </div>
              <div className="input-group mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-lock"></span>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <button
                    type="submit"
                    className="btn btn-primary btn-block"
                    disabled={loading}
                  >
                    {loading ? 'Loading...' : 'Login'}
                  </button>
                </div>
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
