
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';
import { toast } from 'react-toastify';

const PembelianForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [barang, setBarang] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    id_barang: '',
    nama_barang: '',
    jumlah: 1,
    harga_satuan: 0,
    subtotal: 0
  });

  useEffect(() => {
    fetchSuppliers();
    fetchBarang();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/supplier', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const options = response.data.map(supplier => ({
        value: supplier.id,
        label: supplier.nama_supplier
      }));
      setSuppliers(options);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      toast.error('Gagal memuat data supplier');
    }
  };

  const fetchBarang = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/barang', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBarang(response.data);
    } catch (error) {
      console.error('Error fetching barang:', error);
      toast.error('Gagal memuat data barang');
    }
  };

  const handleBarangChange = (e) => {
    const id = e.target.value;
    if (!id) return;
    
    const selectedBarang = barang.find(item => item.id === parseInt(id));
    setNewItem({
      ...newItem,
      id_barang: selectedBarang.id,
      nama_barang: selectedBarang.nama_barang,
      harga_satuan: selectedBarang.harga_beli,
      subtotal: selectedBarang.harga_beli * newItem.jumlah
    });
  };

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    const updatedItem = { ...newItem };
    
    if (name === 'jumlah') {
      updatedItem.jumlah = parseInt(value) || 0;
      updatedItem.subtotal = updatedItem.jumlah * updatedItem.harga_satuan;
    } else if (name === 'harga_satuan') {
      updatedItem.harga_satuan = parseFloat(value) || 0;
      updatedItem.subtotal = updatedItem.jumlah * updatedItem.harga_satuan;
    }
    
    setNewItem(updatedItem);
  };

  const addItem = () => {
    if (!newItem.id_barang || newItem.jumlah <= 0 || newItem.harga_satuan <= 0) {
      toast.error('Harap lengkapi data barang dengan benar');
      return;
    }
    
    // Check if item already exists
    const existingItemIndex = items.findIndex(item => item.id_barang === newItem.id_barang);
    
    if (existingItemIndex >= 0) {
      // Update existing item
      const updatedItems = [...items];
      updatedItems[existingItemIndex].jumlah += newItem.jumlah;
      updatedItems[existingItemIndex].subtotal = 
        updatedItems[existingItemIndex].jumlah * updatedItems[existingItemIndex].harga_satuan;
      
      setItems(updatedItems);
    } else {
      // Add new item
      setItems([...items, { ...newItem }]);
    }
    
    // Reset new item
    setNewItem({
      id_barang: '',
      nama_barang: '',
      jumlah: 1,
      harga_satuan: 0,
      subtotal: 0
    });
  };

  const removeItem = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.subtotal, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedSupplier) {
      toast.error('Harap pilih supplier');
      return;
    }
    
    if (items.length === 0) {
      toast.error('Harap tambahkan minimal satu barang');
      return;
    }
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const totalHarga = calculateTotal();
      const details = items.map(item => ({
        id_barang: item.id_barang,
        jumlah: item.jumlah,
        harga_satuan: item.harga_satuan,
        subtotal: item.subtotal
      }));
      
      const response = await axios.post('/api/pembelian', {
        id_supplier: selectedSupplier.value,
        total_harga: totalHarga,
        details
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Transaksi pembelian berhasil disimpan');
      navigate(`/admin/pembelian/${response.data.id}`);
    } catch (error) {
      console.error('Error creating pembelian:', error);
      toast.error('Gagal menyimpan transaksi pembelian');
      setLoading(false);
    }
  };

  return (
    <div className="content-wrapper">
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Tambah Pembelian</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item"><a href="#">Home</a></li>
                <li className="breadcrumb-item"><a href="#/admin/pembelian">Pembelian</a></li>
                <li className="breadcrumb-item active">Tambah</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="content">
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Supplier</label>
                    <Select
                      options={suppliers}
                      value={selectedSupplier}
                      onChange={setSelectedSupplier}
                      placeholder="Pilih Supplier"
                      isSearchable
                      isClearable
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Tanggal</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={new Date().toLocaleDateString('id-ID')} 
                      disabled
                    />
                  </div>
                </div>
              </div>

              <div className="card mt-4">
                <div className="card-header">
                  <h3 className="card-title">Detail Barang</h3>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-4">
                      <div className="form-group">
                        <label>Barang</label>
                        <select 
                          className="form-control" 
                          value={newItem.id_barang} 
                          onChange={handleBarangChange}
                        >
                          <option value="">Pilih Barang</option>
                          {barang.map(item => (
                            <option key={item.id} value={item.id}>
                              {item.nama_barang}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Jumlah</label>
                        <input 
                          type="number" 
                          className="form-control" 
                          name="jumlah"
                          value={newItem.jumlah} 
                          onChange={handleItemChange}
                          min="1"
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Harga Satuan</label>
                        <input 
                          type="number" 
                          className="form-control" 
                          name="harga_satuan"
                          value={newItem.harga_satuan} 
                          onChange={handleItemChange}
                          min="0"
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Subtotal</label>
                        <div className="input-group">
                          <input 
                            type="text" 
                            className="form-control" 
                            value={new Intl.NumberFormat('id-ID', {
                              style: 'currency',
                              currency: 'IDR'
                            }).format(newItem.subtotal)} 
                            readOnly
                          />
                          <div className="input-group-append">
                            <button
                              type="button"
                              className="btn btn-success"
                              onClick={addItem}
                            >
                              <i className="fas fa-plus"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="table-responsive mt-3">
                    <table className="table table-bordered table-striped">
                      <thead>
                        <tr>
                          <th>No</th>
                          <th>Nama Barang</th>
                          <th>Jumlah</th>
                          <th>Harga Satuan</th>
                          <th>Subtotal</th>
                          <th>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.length > 0 ? (
                          items.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item.nama_barang}</td>
                              <td>{item.jumlah}</td>
                              <td>
                                {new Intl.NumberFormat('id-ID', {
                                  style: 'currency',
                                  currency: 'IDR'
                                }).format(item.harga_satuan)}
                              </td>
                              <td>
                                {new Intl.NumberFormat('id-ID', {
                                  style: 'currency',
                                  currency: 'IDR'
                                }).format(item.subtotal)}
                              </td>
                              <td>
                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm"
                                  onClick={() => removeItem(index)}
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="text-center">
                              Belum ada barang ditambahkan
                            </td>
                          </tr>
                        )}
                      </tbody>
                      <tfoot>
                        <tr>
                          <th colSpan="4" className="text-right">Total</th>
                          <th>
                            {new Intl.NumberFormat('id-ID', {
                              style: 'currency',
                              currency: 'IDR'
                            }).format(calculateTotal())}
                          </th>
                          <th></th>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>

              <div className="text-center mt-4">
                <button
                  type="button"
                  className="btn btn-secondary mr-2"
                  onClick={() => navigate('/admin/pembelian')}
                  disabled={loading}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span className="ml-1">Menyimpan...</span>
                    </>
                  ) : (
                    'Simpan Transaksi'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PembelianForm;
