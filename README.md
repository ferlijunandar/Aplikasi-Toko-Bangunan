# 🧱 Aplikasi Toko Bangunan

Aplikasi web berbasis React.js dan Express.js yang digunakan untuk mengelola operasional toko bangunan seperti manajemen barang, transaksi pembelian & penjualan, pelanggan, supplier. Dibangun dengan arsitektur RESTful API dan otentikasi JWT.

---

## 🚀 Fitur Utama

- 🔐 Login multi-role (Admin & Kasir)
- 👥 Manajemen pengguna (CRUD user)
- 📦 Barang, kategori, dan jenis barang
- 🧾 Transaksi pembelian dan penjualan
- 📈 Dashboard dan laporan dinamis
- 🧮 Cetak invoice otomatis dengan nomor faktur unik
- 🔒 Otentikasi menggunakan JWT & bcrypt

---

## 🛠️ Teknologi yang Digunakan

| Layer      | Teknologi                      |
|------------|--------------------------------|
| Frontend   | React.js, Vite, Bootstrap      |
| Backend    | Node.js, Express.js            |
| Database   | PostgreSQL                     |
| Auth       | JWT (JSON Web Token)           |
| Hashing    | Bcrypt                         |
| Env Config | dotenv                         |

---

## 📦 Instalasi & Menjalankan Proyek

### 1. Clone Repository

```bash
git clone https://github.com/ferlijunandar/Aplikasi-Toko-Bangunan.git
cd Aplikasi-Toko-Bangunan
```
### 2. Setup Backend

```bash
cd server
npm install
node index
```
-Server berjalan di `http://localhost:5000`
### 3. Setup Frontend
-Buka Terminal Baru lalu jalankan perintah berikut:
```bash
npm install
npm run dev
```
-Aplikasi akan berjalan di `http://localhost:5173`

## Tampilan Dashboard

![Screenshot (378)](https://github.com/user-attachments/assets/0243d0f8-5436-4910-9e20-713b60112341)

## Tampilan Barang

![Screenshot (379)](https://github.com/user-attachments/assets/9c67f14c-fc79-407f-a003-ab6e94fe16e4)

