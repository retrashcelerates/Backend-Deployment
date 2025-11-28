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