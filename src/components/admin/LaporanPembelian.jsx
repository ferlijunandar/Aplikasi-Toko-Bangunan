import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import moment from 'moment';
import { useReactToPrint } from 'react-to-print';

const LaporanPembelian = () => {
  const [pembelian, setPembelian] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: moment().startOf('month').format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD')
  });
  const printRef = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/reports/pembelian', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          start_date: dateRange.startDate,
          end_date: dateRange.endDate
        }
      });
      setPembelian(response.data);
    } catch (error) {
      console.error('Error fetching purchase report:', error);
      toast.error('Gagal memuat data laporan pembelian');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange.startDate, dateRange.endDate]);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Laporan_Pembelian_${dateRange.startDate}_${dateRange.endDate}`,
    onBeforeGetContent: () => {
      return new Promise((resolve) => {
        // Pastikan content sudah siap sebelum print
        setTimeout(resolve, 100);
      });
    },
    onAfterPrint: () => {
      console.log('Print completed');
    },
    onPrintError: (errorLocation, error) => {
      console.error('Print error:', errorLocation, error);
      toast.error('Gagal mencetak laporan');
    }
  });

  const calculateTotal = () => {
    return pembelian.reduce((total, item) => total + parseFloat(item.total_harga || 0), 0);
  };

  // Component untuk konten yang akan dicetak
  const PrintableContent = React.forwardRef((props, ref) => (
    <div ref={ref}>
      <div className="text-center mb-4">
        <h2 style={{ marginBottom: '10px', fontSize: '24px', fontWeight: 'bold' }}>
          Laporan Pembelian
        </h2>
        <p style={{ marginBottom: '20px', fontSize: '16px' }}>
          Periode: {moment(dateRange.startDate).format('DD MMMM YYYY')} s/d{' '}
          {moment(dateRange.endDate).format('DD MMMM YYYY')}
        </p>
      </div>
      <div className="table-responsive">
        <table className="table table-bordered table-striped" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ border: '1px solid #dee2e6', padding: '8px', textAlign: 'center' }}>No.</th>
              <th style={{ border: '1px solid #dee2e6', padding: '8px' }}>Tanggal</th>
              <th style={{ border: '1px solid #dee2e6', padding: '8px' }}>Nomor Transaksi</th>
              <th style={{ border: '1px solid #dee2e6', padding: '8px' }}>Supplier</th>
              <th style={{ border: '1px solid #dee2e6', padding: '8px', textAlign: 'right' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {pembelian.length > 0 ? (
              pembelian.map((item, index) => (
                <tr key={item.id}>
                  <td style={{ border: '1px solid #dee2e6', padding: '8px', textAlign: 'center' }}>
                    {index + 1}
                  </td>
                  <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>
                    {moment(item.tanggal).format('DD/MM/YYYY')}
                  </td>
                  <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>
                    {item.invoice || `PO-${item.id}`}
                  </td>
                  <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>
                    {item.nama_supplier || 'N/A'}
                  </td>
                  <td style={{ border: '1px solid #dee2e6', padding: '8px', textAlign: 'right' }}>
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR'
                    }).format(item.total_harga)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ border: '1px solid #dee2e6', padding: '8px', textAlign: 'center' }}>
                  Tidak ada data untuk periode ini
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr style={{ backgroundColor: '#f8f9fa', fontWeight: 'bold' }}>
              <th colSpan="4" style={{ border: '1px solid #dee2e6', padding: '8px', textAlign: 'right' }}>
                Total
              </th>
              <th style={{ border: '1px solid #dee2e6', padding: '8px', textAlign: 'right' }}>
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR'
                }).format(calculateTotal())}
              </th>
            </tr>
          </tfoot>
        </table>
      </div>
      <div style={{ marginTop: '30px', fontSize: '12px', color: '#666' }}>
        <p>Dicetak pada: {moment().format('DD MMMM YYYY HH:mm:ss')}</p>
      </div>
    </div>
  ));

  return (
    <div className="content-wrapper">
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Laporan Pembelian</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="#">Home</a>
                </li>
                <li className="breadcrumb-item active">Laporan Pembelian</li>
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
                    <label>Tanggal Mulai:</label>
                    <input
                      type="date"
                      className="form-control"
                      value={dateRange.startDate}
                      onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="col-md-5">
                  <div className="form-group">
                    <label>Tanggal Akhir:</label>
                    <input
                      type="date"
                      className="form-control"
                      value={dateRange.endDate}
                      onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="col-md-2 d-flex align-items-end">
                  <button 
                    className="btn btn-success btn-block" 
                    onClick={handlePrint}
                    disabled={loading || pembelian.length === 0}
                  >
                    <i className="fas fa-print mr-2"></i> Cetak
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Data Pembelian</h3>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-center my-3">
                  <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              ) : (
                <div>
                  {/* Konten untuk tampilan di layar */}
                  <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                      <thead>
                        <tr>
                          <th>No.</th>
                          <th>Tanggal</th>
                          <th>Nomor Transaksi</th>
                          <th>Supplier</th>
                          <th className="text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pembelian.length > 0 ? (
                          pembelian.map((item, index) => (
                            <tr key={item.id}>
                              <td>{index + 1}</td>
                              <td>{moment(item.tanggal).format('DD/MM/YYYY')}</td>
                              <td>{item.invoice || `PO-${item.id}`}</td>
                              <td>{item.nama_supplier || 'N/A'}</td>
                              <td className="text-right">
                                {new Intl.NumberFormat('id-ID', {
                                  style: 'currency',
                                  currency: 'IDR'
                                }).format(item.total_harga)}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center">
                              Tidak ada data untuk periode ini
                            </td>
                          </tr>
                        )}
                      </tbody>
                      <tfoot>
                        <tr>
                          <th colSpan="4" className="text-right">
                            Total
                          </th>
                          <th className="text-right">
                            {new Intl.NumberFormat('id-ID', {
                              style: 'currency',
                              currency: 'IDR'
                            }).format(calculateTotal())}
                          </th>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {/* Konten untuk print (tersembunyi) */}
                  <div style={{ display: 'none' }}>
                    <PrintableContent ref={printRef} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LaporanPembelian;