CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  avatar_url TEXT,
  address TEXT,
  phone VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

create table kategori(
	id serial primary key,
	name varchar(255) not null
);

create table produk(
  id serial primary key,
  nama_produk varchar(255) not null,
  harga numeric not null,
  deskripsi text,
  image_url text,
  jenis varchar(255),
  created_at TIMESTAMP DEFAULT NOW()
);

create table berita(
    id serial primary key,
    judul varchar(255) not null,
    konten text not null,
    image_url text,
    author varchar(100),
    status varchar(50) default 'draft',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE lokasi (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    jalan VARCHAR(255) NOT NULL,
    desa VARCHAR(100),
    kecamatan VARCHAR(100),
    kabupaten VARCHAR(100),
    kodepos VARCHAR(10),
    image_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE setor ( 
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES produk(id), 
    lokasi_id INTEGER REFERENCES lokasi(id),
    harga_saat_transaksi NUMERIC(10,2) NOT NULL DEFAULT 0,
    kuantitas NUMERIC(10,2) NOT NULL DEFAULT 0,
    gambar_url TEXT, 
    catatan_tambahan TEXT, 
    tanggal_setor TIMESTAMP DEFAULT NOW()
);

CREATE TABLE riwayat_penarikan (
  id                SERIAL PRIMARY KEY,
  user_id           INTEGER REFERENCES users(id) ON DELETE CASCADE,
  jumlah_penarikan  NUMERIC NOT NULL,
  tanggal_penarikan TIMESTAMP DEFAULT NOW(),
  metode_penarikan  VARCHAR(50) NOT NULL,
  saldo_setelah     NUMERIC NOT NULL,
  catatan           TEXT,
  kode_transaksi    VARCHAR(50) NOT NULL UNIQUE
);

