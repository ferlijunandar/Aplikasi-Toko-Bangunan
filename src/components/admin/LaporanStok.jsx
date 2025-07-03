import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import moment from 'moment';
import { useReactToPrint } from 'react-to-print';
import Select from 'react-select';

const LaporanStok = () => {
  const [barang, setBarang] = useState([]);
  const [kategori, setKategori] = useState([]);
  const [selectedKategori, setSelectedKategori] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showLowStock, setShowLowStock] = useState(false);
  const printRef = useRef(null); // Tambahkan null sebagai initial value

  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/kategori', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const options = response.data.map(item => ({
          value: item.id,
          label: item.nama_kategori
        }));
        
        setKategori([{ value: '', label: 'Semua Kategori' }, ...options]);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Gagal memuat data kategori');
      }
    };
    
    fetchKategori();
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      let url = '/api/barang';
      const params = {};
      
      if (selectedKategori && selectedKategori.value) {
        params.id_kategori = selectedKategori.value;
      }
      
      if (showLowStock) {
        params.low_stock = true;
      }
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        params
      });
      
      setBarang(response.data);
    } catch (error) {
      console.error('Error fetching inventory report:', error);
      toast.error('Gagal memuat data laporan stok');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedKategori, showLowStock]);

  // Perbaiki handlePrint dengan contentRef (untuk versi lama react-to-print)
  const handlePrint = useReactToPrint({
    contentRef: printRef, // Gunakan contentRef untuk versi lama
    documentTitle: `Laporan_Stok_${moment().format('YYYY-MM-DD')}`,
    onBeforeGetContent: () => {
      // Pastikan ada konten sebelum print
      if (!printRef.current) {
        toast.error('Konten belum siap untuk dicetak');
        return Promise.reject('Content not ready');
      }
      return Promise.resolve();
    },
    onPrintError: (errorLocation, error) => {
      console.error('Print error:', errorLocation, error);
      toast.error('Gagal mencetak dokumen');
    }
  });

  // Tambahkan fungsi untuk handle click print dengan validation
  const onPrintClick = () => {
    if (!printRef.current) {
      toast.error('Konten belum siap untuk dicetak');
      return;
    }
    
    if (barang.length === 0) {
      toast.error('Tidak ada data untuk dicetak');
      return;
    }
    
    handlePrint();
  };

  return (
    <div className="content-wrapper">
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Laporan Stok Barang</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="#">Home</a>
                </li>
                <li className="breadcrumb-item active">Laporan Stok</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="content">
        <div className="container-fluid">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Filter Laporan</h3>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-5">
                  <div className="form-group">
                    <label>Kategori:</label>
                    <Select
                      value={selectedKategori}
                      onChange={setSelectedKategori}
                      options={kategori}
                      placeholder="Pilih Kategori"
                      isClearable
                      className="basic-select"
                      classNamePrefix="select"
                      defaultValue={{ value: '', label: 'Semua Kategori' }}
                    />
                  </div>
                </div>
                <div className="col-md-5">
                  <div className="form-group">
                    <div className="custom-control custom-checkbox mt-4">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="showLowStock"
                        checked={showLowStock}
                        onChange={(e) => setShowLowStock(e.target.checked)}
                      />
                      <label className="custom-control-label" htmlFor="showLowStock">
                        Tampilkan hanya stok menipis
                      </label>
                    </div>
                  </div>
                </div>
                <div className="col-md-2 d-flex align-items-end">
                  <button 
                    className="btn btn-success btn-block" 
                    onClick={onPrintClick}
                    disabled={loading || barang.length === 0}
                  >
                    <i className="fas fa-print mr-2"></i> Cetak
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Data Stok Barang</h3>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-center my-3">
                  <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              ) : (
                <>
                  {/* Konten yang akan dicetak - pastikan ref di posisi yang tepat */}
                  <div ref={printRef} style={{ width: '100%' }}>
                    {/* Header untuk print */}
                    <div className="text-center mb-4 d-none d-print-block">
                      <h2>Laporan Stok Barang</h2>
                      <p>
                        {selectedKategori && selectedKategori.value
                          ? `Kategori: ${selectedKategori.label}`
                          : 'Semua Kategori'}
                        {showLowStock ? ' - Stok Menipis' : ''}
                      </p>
                      <p>Tanggal Cetak: {moment().format('DD MMMM YYYY')}</p>
                    </div>
                    
                    {/* Tabel data */}
                    <div className="table-responsive">
                      <table className="table table-bordered table-striped">
                        <thead>
                          <tr>
                            <th>No.</th>
                            <th>Nama Barang</th>
                            <th>Kategori</th>
                            <th>Jenis</th>
                            <th className="text-right">Harga Beli</th>
                            <th className="text-right">Harga Jual</th>
                            <th className="text-center">Stok</th>
                          </tr>
                        </thead>
                        <tbody>
                          {barang.length > 0 ? (
                            barang.map((item, index) => (
                              <tr key={item.id} className={item.stok <= (item.min_stok || 0) ? 'table-danger' : ''}>
                                <td>{index + 1}</td>
                                <td>{item.nama_barang}</td>
                                <td>{item.nama_kategori}</td>
                                <td>{item.nama_jenis}</td>
                                <td className="text-right">
                                  {new Intl.NumberFormat('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR'
                                  }).format(item.harga_beli)}
                                </td>
                                <td className="text-right">
                                  {new Intl.NumberFormat('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR'
                                  }).format(item.harga_jual)}
                                </td>
                                <td className="text-center">{item.stok}</td>
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
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LaporanStok;