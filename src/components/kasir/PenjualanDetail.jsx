import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const PenjualanDetail = () => {
  const { id } = useParams();
  const [penjualan, setPenjualan] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const strukRef = useRef(); 

  useEffect(() => {
    fetchDetailPenjualan();
  }, []);

  const fetchDetailPenjualan = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/penjualan/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setPenjualan(response.data.penjualan);
      setItems(response.data.details);
    } catch (error) {
      console.error('Error fetching detail penjualan:', error);
      toast.error('Gagal memuat detail penjualan');
    } finally {
      setLoading(false);
    }
  };

  const formatRupiah = (number) => {
    if (!number || isNaN(number)) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(number);
  };

  const formatTanggal = (tanggalString) => {
    if (!tanggalString) return '-';
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(tanggalString).toLocaleDateString('id-ID', options);
  };

  const handlePrint = () => {
    const printContents = strukRef.current.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload(); 
  };

  return (
    <div className="content-wrapper">
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Detail Penjualan</h1>
            </div>
            <div className="col-sm-6 text-right">
              <button className="btn btn-success mr-2" onClick={handlePrint}>
                <i className="fa fa-print"></i> Cetak Struk
              </button>
              <Link to="/kasir/penjualan" className="btn btn-secondary">
                <i className="fa fa-arrow-left"></i> Kembali
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="content">
        <div className="card">
          <div className="card-body" ref={strukRef}> {/* hanya bagian ini yang akan dicetak */}
            {loading ? (
              <div>Loading...</div>
            ) : penjualan ? (
              <>
                <div className="mb-4">
                  <h5>Informasi Penjualan</h5>
                  <table className="table table-sm">
                    <tbody>
                      <tr><th>Invoice</th><td>{penjualan.invoice || '-'}</td></tr>
                      <tr><th>Tanggal</th><td>{formatTanggal(penjualan.tanggal)}</td></tr>
                      <tr><th>Pelanggan</th><td>{penjualan.nama_pelanggan || 'Umum'}</td></tr>
                      <tr><th>Metode Pembayaran</th><td>{penjualan.metode_pembayaran || '-'}</td></tr>
                      <tr><th>Diskon</th><td>{formatRupiah(penjualan.diskon)}</td></tr>
                      <tr><th>Total Harga</th><td>{formatRupiah(penjualan.total_harga)}</td></tr>
                    </tbody>
                  </table>
                </div>

                <h5>Detail Barang</h5>
                <div className="table-responsive">
                  <table className="table table-bordered table-sm">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Nama Barang</th>
                        <th>Jumlah</th>
                        <th>Harga Satuan</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.length === 0 ? (
                        <tr><td colSpan="5" className="text-center">Tidak ada detail barang</td></tr>
                      ) : (
                        items.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.nama_barang || '-'}</td>
                            <td>{item.jumlah}</td>
                            <td>{formatRupiah(item.harga_satuan)}</td>
                            <td>{formatRupiah(item.subtotal || (item.jumlah * item.harga_satuan))}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div>Data tidak ditemukan</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PenjualanDetail;
