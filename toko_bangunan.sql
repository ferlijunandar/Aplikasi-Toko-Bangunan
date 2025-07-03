CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('admin', 'kasir')) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE kategori_barang (
    id SERIAL PRIMARY KEY,
    nama_kategori VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE jenis_barang (
    id SERIAL PRIMARY KEY,
    nama_jenis VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE barang (
    id SERIAL PRIMARY KEY,
    nama_barang VARCHAR(150) NOT NULL,
    id_kategori INT REFERENCES kategori_barang(id) ON DELETE SET NULL,
    id_jenis INT REFERENCES jenis_barang(id) ON DELETE SET NULL,
    stok INT DEFAULT 0 CHECK (stok >= 0),
    harga_beli NUMERIC(15,2) NOT NULL CHECK (harga_beli >= 0),
    harga_jual NUMERIC(15,2) NOT NULL CHECK (harga_jual >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE supplier (
    id SERIAL PRIMARY KEY,
    nama_supplier VARCHAR(100) NOT NULL,
    kontak VARCHAR(50),
    alamat TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pelanggan (
    id SERIAL PRIMARY KEY,
    nama_pelanggan VARCHAR(100) NOT NULL,
    kontak VARCHAR(50),
    alamat TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transaksi_pembelian (
    id SERIAL PRIMARY KEY,
    id_supplier INT REFERENCES supplier(id) ON DELETE SET NULL,
    total_barang INT DEFAULT 0 CHECK (total_barang >= 0),
    total_harga NUMERIC(15,2) NOT NULL CHECK (total_harga >= 0),
    tanggal TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE detail_pembelian (
    id SERIAL PRIMARY KEY,
    id_pembelian INT REFERENCES transaksi_pembelian(id) ON DELETE CASCADE,
    id_barang INT REFERENCES barang(id) ON DELETE SET NULL,
    jumlah INT NOT NULL CHECK (jumlah > 0),
    harga_satuan NUMERIC(15,2) NOT NULL CHECK (harga_satuan >= 0),
    subtotal NUMERIC(15,2) NOT NULL CHECK (subtotal >= 0)
);

CREATE TABLE transaksi_penjualan (
    id SERIAL PRIMARY KEY,
    id_user INT REFERENCES users(id) ON DELETE SET NULL,
    id_pelanggan INT REFERENCES pelanggan(id) ON DELETE SET NULL,
    total_barang INT DEFAULT 0 CHECK (total_barang >= 0),
    total_harga NUMERIC(15,2) NOT NULL CHECK (total_harga >= 0),
    diskon NUMERIC(15,2) DEFAULT 0 CHECK (diskon >= 0),
    metode_pembayaran VARCHAR(50) NOT NULL DEFAULT 'cash' CHECK (metode_pembayaran IN ('cash', 'transfer', 'debit', 'credit')),
    tanggal TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE detail_penjualan (
    id SERIAL PRIMARY KEY,
    id_penjualan INT REFERENCES transaksi_penjualan(id) ON DELETE CASCADE,
    id_barang INT REFERENCES barang(id) ON DELETE SET NULL,
    jumlah INT NOT NULL CHECK (jumlah > 0),
    harga_satuan NUMERIC(15,2) NOT NULL CHECK (harga_satuan >= 0),
    subtotal NUMERIC(15,2) NOT NULL CHECK (subtotal >= 0)
);

CREATE INDEX idx_transaksi_tanggal ON transaksi_penjualan(tanggal);
CREATE INDEX idx_barang_nama ON barang(nama_barang);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_pelanggan_nama ON pelanggan(nama_pelanggan);
CREATE INDEX idx_supplier_nama ON supplier(nama_supplier);

CREATE FUNCTION update_total_barang_penjualan() RETURNS TRIGGER AS $$
BEGIN
    UPDATE transaksi_penjualan 
    SET total_barang = (SELECT COALESCE(SUM(jumlah), 0) FROM detail_penjualan WHERE id_penjualan = NEW.id_penjualan)
    WHERE id = NEW.id_penjualan;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_total_barang_penjualan
AFTER INSERT OR UPDATE ON detail_penjualan
FOR EACH ROW EXECUTE FUNCTION update_total_barang_penjualan();

CREATE FUNCTION update_total_barang_pembelian() RETURNS TRIGGER AS $$
BEGIN
    UPDATE transaksi_pembelian 
    SET total_barang = (SELECT COALESCE(SUM(jumlah), 0) FROM detail_pembelian WHERE id_pembelian = NEW.id_pembelian)
    WHERE id = NEW.id_pembelian;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_total_barang_pembelian
AFTER INSERT OR UPDATE ON detail_pembelian
FOR EACH ROW EXECUTE FUNCTION update_total_barang_pembelian();

INSERT INTO users (nama, username, password, role) VALUES
('Admin Toko', 'admin', '$2b$10$mw9wCnPBRqTqgNfXJ/EDPeODnN./h7TvPDH1CNGUeUSJAywsMu0xe', 'admin'),
('Kasir 1', 'kasir1', '$2b$10$nHSEK4z9j0bDp4NAlLIOUuKCvFvA8dv05zyRvMJdU6RDGTvf2A52a', 'kasir');

INSERT INTO kategori_barang (nama_kategori) VALUES
('Material Dasar'), ('Alat Bangunan'), ('Elektrik');

INSERT INTO jenis_barang (nama_jenis) VALUES
('Material Bangunan'), ('Peralatan');

INSERT INTO barang (nama_barang, id_kategori, id_jenis, stok, harga_beli, harga_jual) VALUES
('Semen 50kg', 1, 1, 100, 50000, 60000),
('Palu Besi', 2, 2, 50, 20000, 30000);

INSERT INTO supplier (nama_supplier, kontak, alamat) VALUES
('PT. Material Jaya', '08123456789', 'Jl. Merdeka No. 10');

INSERT INTO pelanggan (nama_pelanggan, kontak, alamat) VALUES
('Budi Santoso', '082233445566', 'Jl. Sudirman No. 20'),
('Siti Aisyah', '081312345678', 'Jl. Diponegoro No. 5');