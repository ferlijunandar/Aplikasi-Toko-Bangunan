import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { toast } from 'react-toastify';
import { useReactToPrint } from 'react-to-print';

const PembelianDetail = () => {
  const { id } = useParams();
  const [pembelian, setPembelian] = useState(null);
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const printRef = useRef();

  useEffect(() => {
    fetchPembelianDetail();
  }, [id]);

  const fetchPembelianDetail = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/pembelian/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setPembelian(response.data.pembelian);
      setDetails(response.data.details);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pembelian detail:', error);
      toast.error('Gagal memuat detail pembelian');
      setLoading(false);
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef, // Changed from 'content' to 'contentRef'
    documentTitle: `Invoice Pembelian #${id}`,
    onAfterPrint: () => {
      console.log('Print completed');
    },
    onPrintError: (error) => {
      console.error('Print error:', error);
      toast.error('Gagal mencetak dokumen');
    }
  });

  if (loading) {
    return (
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Detail Pembelian</h1>
              </div>
            </div>
          </div>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="text-center p-5">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (!pembelian) {
    return (
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Detail Pembelian</h1>
              </div>
            </div>
          </div>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="alert alert-danger">
              Pembelian tidak ditemukan
            </div>
            <Link to="/admin/pembelian" className="btn btn-primary">
              Kembali ke Daftar Pembelian
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="content-wrapper">
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Detail Pembelian #{id}</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item"><a href="#">Home</a></li>
                <li className="breadcrumb-item"><a href="/admin/pembelian">Pembelian</a></li>
                <li className="breadcrumb-item active">Detail</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Informasi Pembelian</h3>
                  <div className="card-tools">
                    <button className="btn btn-success" onClick={handlePrint}>
                      <i className="fas fa-print mr-1"></i> Cetak
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <div ref={printRef} className="p-3">
                    <div className="invoice-title mb-4">
                      <h2 className="font-weight-bold">Nota Pembelian #{id}</h2>
                      <div className="text-right">
                        <small>Tanggal Transaksi: {moment(pembelian.tanggal).format('DD MMMM YYYY')}</small>
                      </div>
                    </div>
                    
                    <hr/>
                    
                    <div className="row">
                      <div className="col-md-6">
                        <address>
                          <strong>Supplier:</strong><br/>
                          {pembelian.nama_supplier}<br/>
                        </address>
                      </div>
                    </div>
                    
                    <div className="row">
                      <div className="col-md-12">
                        <div className="table-responsive">
                          <table className="table table-striped">
                            <thead>
                              <tr>
                                <th>No.</th>
                                <th>Barang</th>
                                <th className="text-right">Harga</th>
                                <th className="text-center">Jumlah</th>
                                <th className="text-right">Subtotal</th>
                              </tr>
                            </thead>
                            <tbody>
                              {details.map((item, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{item.nama_barang}</td>
                                  <td className="text-right">
                                    {new Intl.NumberFormat('id-ID', {
                                      style: 'currency',
                                      currency: 'IDR'
                                    }).format(item.harga_satuan)}
                                  </td>
                                  <td className="text-center">{item.jumlah}</td>
                                  <td className="text-right">
                                    {new Intl.NumberFormat('id-ID', {
                                      style: 'currency',
                                      currency: 'IDR'
                                    }).format(item.subtotal)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr>
                                <th colSpan="4" className="text-right">Total</th>
                                <th className="text-right">
                                  {new Intl.NumberFormat('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR'
                                  }).format(pembelian.total_harga)}
                                </th>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-12">
              <Link to="/admin/pembelian" className="btn btn-secondary">
                <i className="fas fa-arrow-left mr-1"></i> Kembali
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PembelianDetail;