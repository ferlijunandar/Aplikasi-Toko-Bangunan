import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [salesData, setSalesData] = useState({
    labels: [],
    datasets: []
  });
  const [totalStats, setTotalStats] = useState({
    totalSales: 0,
    totalPurchases: 0,
    totalItems: 0,
    lowStockItems: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');

        const response = await axios.get('/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Set chart data from penjualanPerKategori
        const kategori = response.data.penjualanPerKategori;
        const chartData = {
          labels: kategori.map(item => item.nama_kategori || 'Lainnya'),
          datasets: [
            {
              label: 'Penjualan per Kategori',
              data: kategori.map(item => parseInt(item.total_penjualan)),
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
          ],
        };

        // Set summary data
        setSalesData(chartData);
        setTotalStats({
          totalSales: response.data.summary.totalPenjualanBulan,
          totalPurchases: response.data.summary.totalPembelianBulan,
          totalItems: response.data.summary.totalBarang,
          lowStockItems: response.data.barangHampirHabis.length
        });
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Penjualan per Kategori',
      },
    },
  };

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Dashboard</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item"><a href="#">Home</a></li>
                <li className="breadcrumb-item active">Dashboard</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-3 col-6">
              <div className="small-box bg-info">
                <div className="inner">
                  <h3>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalStats.totalSales)}</h3>
                  <p>Total Penjualan</p>
                </div>
                <div className="icon">
                  <i className="ion ion-bag"></i>
                </div>
                <a href="#" className="small-box-footer">More info <i className="fas fa-arrow-circle-right"></i></a>
              </div>
            </div>
            
            <div className="col-lg-3 col-6">
              <div className="small-box bg-success">
                <div className="inner">
                  <h3>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalStats.totalPurchases)}</h3>
                  <p>Total Pembelian</p>
                </div>
                <div className="icon">
                  <i className="ion ion-stats-bars"></i>
                </div>
                <a href="#" className="small-box-footer">More info <i className="fas fa-arrow-circle-right"></i></a>
              </div>
            </div>
            
            <div className="col-lg-3 col-6">
              <div className="small-box bg-warning">
                <div className="inner">
                  <h3>{totalStats.totalItems}</h3>
                  <p>Total Barang</p>
                </div>
                <div className="icon">
                  <i className="ion ion-cube"></i>
                </div>
                <a href="#" className="small-box-footer">More info <i className="fas fa-arrow-circle-right"></i></a>
              </div>
            </div>
            
            <div className="col-lg-3 col-6">
              <div className="small-box bg-danger">
                <div className="inner">
                  <h3>{totalStats.lowStockItems}</h3>
                  <p>Stok Menipis</p>
                </div>
                <div className="icon">
                  <i className="ion ion-alert"></i>
                </div>
                <a href="#" className="small-box-footer">More info <i className="fas fa-arrow-circle-right"></i></a>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Laporan Penjualan</h5>
                </div>
                <div className="card-body">
                  <div className="chart">
                    <Bar options={chartOptions} data={salesData} height={100} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
