import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Select from 'react-select';

const PenjualanForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [barangList, setBarangList] = useState([]);
  const [pelangganList, setPelangganList] = useState([]);
  const [selectedPelanggan, setSelectedPelanggan] = useState(null);
  const [selectedItems, setSelectedItems] = useState([
    { barang: null, jumlah: 1, harga: 0, subtotal: 0 }
  ]);
  const [total, setTotal] = useState(0);
  const [metodePembayaran, setMetodePembayaran] = useState('Cash');
  const [diskon, setDiskon] = useState(0);

  useEffect(() => {
    fetchBarang();
    fetchPelanggan();
  }, []);

  useEffect(() => {
    calculateTotal();
  }, [selectedItems, diskon]);

  const fetchBarang = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/barang', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const options = response.data.map(item => ({
        value: item.id,
        label: item.nama_barang,
        harga_jual: parseFloat(item.harga_jual),
        stok: parseInt(item.stok, 10)
      }));
      setBarangList(options);
    } catch (error) {
      toast.error('Gagal memuat data barang');
    }
  };

  const fetchPelanggan = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/pelanggan', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const options = response.data.map(item => ({
        value: item.id,
        label: item.nama_pelanggan
      }));
      setPelangganList(options);
    } catch (error) {
      toast.error('Gagal memuat data pelanggan');
    }
  };

  const handlePelangganChange = (selected) => setSelectedPelanggan(selected);

  const handleBarangChange = (selected, index) => {
    const newItems = [...selectedItems];
    if (selected) {
      newItems[index].barang = selected;
      newItems[index].harga = selected.harga_jual || 0;
      newItems[index].subtotal = (selected.harga_jual || 0) * newItems[index].jumlah;
    } else {
      newItems[index] = { barang: null, jumlah: 1, harga: 0, subtotal: 0 };
    }
    setSelectedItems(newItems);
  };

  const handleJumlahChange = (e, index) => {
    const value = parseInt(e.target.value, 10) || 0;
    const newItems = [...selectedItems];
    if (newItems[index].barang && value > newItems[index].barang.stok) {
      toast.warning(`Stok hanya tersedia ${newItems[index].barang.stok}`);
      newItems[index].jumlah = newItems[index].barang.stok;
    } else {
      newItems[index].jumlah = value;
    }
    newItems[index].subtotal = newItems[index].harga * newItems[index].jumlah || 0;
    setSelectedItems(newItems);
  };

  const handleDiskonChange = (e) => setDiskon(parseFloat(e.target.value) || 0);

  const addItem = () => {
    setSelectedItems([...selectedItems, { barang: null, jumlah: 1, harga: 0, subtotal: 0 }]);
  };

  const removeItem = (index) => {
    if (selectedItems.length > 1) {
      setSelectedItems(selectedItems.filter((_, i) => i !== index));
    }
  };

  const calculateTotal = () => {
    const subtotal = selectedItems.reduce((acc, item) => acc + (item.subtotal || 0), 0);
    const totalAfterDiscount = subtotal - diskon;
    setTotal(totalAfterDiscount > 0 ? totalAfterDiscount : 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPelanggan) return toast.error('Silakan pilih pelanggan');
    if (selectedItems.some(item => !item.barang)) return toast.error('Silakan pilih semua barang');
    if (selectedItems.some(item => !item.jumlah || item.jumlah <= 0)) return toast.error('Jumlah barang harus lebih dari 0');
    if (selectedItems.some(item => item.barang && item.jumlah > item.barang.stok)) return toast.error('Jumlah melebihi stok tersedia');

    const formData = {
      id_pelanggan: selectedPelanggan.value,
      metode_pembayaran: metodePembayaran,
      total_harga: parseFloat(total.toFixed(2)) || 0,
      diskon: parseFloat(diskon.toFixed(2)) || 0,
      details: selectedItems.map(item => ({
        id_barang: item.barang.value,
        jumlah: item.jumlah,
        harga_satuan: parseFloat(item.harga.toFixed(2)) || 0,
        subtotal: parseFloat(item.subtotal.toFixed(2)) || 0
      }))
    };

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.post('/api/penjualan', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      });

      toast.success('Penjualan berhasil disimpan');
      navigate('/kasir/penjualan');
    } catch (error) {
      console.error('Error saving penjualan:', error);
      toast.error('Gagal menyimpan penjualan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-wrapper">
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Tambah Penjualan</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item"><Link to="/kasir">Home</Link></li>
                <li className="breadcrumb-item"><Link to="/kasir/penjualan">Penjualan</Link></li>
                <li className="breadcrumb-item active">Tambah Penjualan</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="content">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Form Penjualan</h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="card-body">
              {/* --- Form Pelanggan dan Metode Pembayaran --- */}
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Pelanggan</label>
                    <Select
                      options={pelangganList}
                      value={selectedPelanggan}
                      onChange={handlePelangganChange}
                      placeholder="Pilih Pelanggan"
                      isClearable
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Metode Pembayaran</label>
                    <select
                  className="form-control"
                  value={metodePembayaran}
                  onChange={(e) => setMetodePembayaran(e.target.value)}
                 >
                 <option value="Tunai">Tunai</option>
                <option value="Transfer">Transfer</option>
                <option value="Cash">Cash</option>
                <option value="Credit">Credit</option>
                  </select>
                  </div>
                </div>
              </div>

              <hr />
              <h4>Item Penjualan</h4>

              {/* --- List Item Barang --- */}
              {selectedItems.map((item, index) => (
                <div className="row mb-3" key={index}>
                  <div className="col-md-5">
                    <Select
                      options={barangList}
                      value={item.barang}
                      onChange={(selected) => handleBarangChange(selected, index)}
                      placeholder="Pilih Barang"
                    />
                    {item.barang && (
                      <small className="text-muted">Stok tersedia: {item.barang.stok}</small>
                    )}
                  </div>
                  <div className="col-md-2">
                    <input
                      type="number"
                      className="form-control"
                      value={item.jumlah}
                      onChange={(e) => handleJumlahChange(e, index)}
                      min="1"
                    />
                  </div>
                  <div className="col-md-2">
                    <input
                      type="text"
                      className="form-control"
                      value={`Rp ${item.harga.toLocaleString('id-ID')}`}
                      readOnly
                    />
                  </div>
                  <div className="col-md-2">
                    <input
                      type="text"
                      className="form-control"
                      value={`Rp ${item.subtotal.toLocaleString('id-ID')}`}
                      readOnly
                    />
                  </div>
                  <div className="col-md-1 d-flex align-items-center">
                    <button
                      type="button"
                      className="btn btn-danger mt-4"
                      onClick={() => removeItem(index)}
                      disabled={selectedItems.length === 1}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}

              {/* --- Tambah Item Button --- */}
              <div className="row mb-3">
                <div className="col-12">
                  <button type="button" className="btn btn-info" onClick={addItem}>
                    <i className="fas fa-plus"></i> Tambah Item
                  </button>
                </div>
              </div>

              {/* --- Diskon dan Total --- */}
              <div className="row">
                <div className="col-md-6 offset-md-6">
                  <div className="form-group">
                    <label>Diskon (Rp)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={diskon}
                      onChange={handleDiskonChange}
                      min="0"
                    />
                  </div>
                  <div className="form-group">
                    <label>Total</label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      value={`Rp ${total.toLocaleString('id-ID')}`}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="card-footer">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Menyimpan...' : 'Simpan'}
              </button>
              <button
                type="button"
                className="btn btn-secondary ml-2"
                onClick={() => navigate('/kasir/penjualan')}
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default PenjualanForm;
