# API Documentation - Backend Program

## 📋 Deskripsi Program
Program ini adalah REST API backend yang dibangun menggunakan **Node.js + Express.js** untuk mengelola e-commerce/product management system dengan fitur:
- User authentication & authorization (JWT)
- User management (admin only)
- Product catalog management
- News/article management
- Category management
- Cloud image upload (Cloudinary)

---

## 🚀 Setup & Instalasi

### 1. Persiapan Environment
Buat file `.env` di root directory backend dan isi dengan konfigurasi berikut:

```env
# Server
PORT=5000

# Database PostgreSQL
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=your_password
PGDATABASE=your_database_name

# JWT Secret
JWT_SECRET=your_secret_key_here

# Cloudinary (untuk upload image)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_api_secret
```

### 2. Setup Database
Buka PostgreSQL dan jalankan script berikut (atau import file `query.sql`):

```sql
-- Tabel Users
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

-- Tabel Produk (kategori sekarang free-form field 'jenis')
CREATE TABLE produk (
  id SERIAL PRIMARY KEY,
  nama_produk VARCHAR(255) NOT NULL,
  harga NUMERIC NOT NULL,
  deskripsi TEXT,
  image_url TEXT,
  jenis VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabel Berita
CREATE TABLE berita (
  id SERIAL PRIMARY KEY,
  judul VARCHAR(255) NOT NULL,
  konten TEXT NOT NULL,
  image_url TEXT,
  author VARCHAR(100),
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 3. Install Dependencies
```bash
npm install
```

Dependencies yang digunakan:
- `express` - Web framework
- `pg` - PostgreSQL client
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `multer` - File upload handling
- `cloudinary` - Cloud image storage
- `cors` - Cross-origin resource sharing
- `helmet` - Security headers
- `morgan` - HTTP request logger
- `nodemon` - Auto-restart pada perubahan file (dev)

### 4. Jalankan Server

**Development Mode** (dengan auto-restart):
```bash
npm run dev
```

**Production Mode**:
```bash
npm run server
```

Server akan berjalan di `http://localhost:5000` (atau port yang dikonfigurasi di `.env`)

### 5. Test Koneksi
Akses endpoint health check:
```
GET http://localhost:5000/health
```

Response:
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

---

## 📁 Struktur Project

---

## 📁 Struktur Project

```
backend/
├── index.js                 # Main server entry point
├── package.json            # Dependencies
├── query.sql               # Database schema
├── API_DOCUMENTATION.md    # Dokumentasi API (file ini)
├── .env                    # Environment configuration
└── src/
    ├── config/
    │   ├── db.js          # Database connection
    │   └── cloudinary.js   # Cloudinary configuration
    ├── controller/         # Business logic untuk setiap fitur
    │   ├── authController.js      # Register & Login
    │   ├── userController.js      # User management
    │   ├── kategoriController.js  # Category management
    │   ├── produkController.js    # Product management
    │   └── beritaController.js    # News management
    ├── middleware/         # Express middleware
    │   ├── auth.js        # JWT authentication
    │   └── upload.js      # File upload handling
    ├── models/            # Database queries
    │   ├── authModel.js       # Auth related queries
    │   ├── userModel.js       # User queries
    │   ├── kategoriModel.js   # Category queries
    │   ├── produkModel.js     # Product queries
    │   └── beritaModel.js     # News queries
    └── routes/            # API endpoints
        ├── authRoutes.js      # Auth endpoints
        ├── userRoutes.js      # User management endpoints
        ├── kategoriRoutes.js  # Category endpoints
        ├── produkRoutes.js    # Product endpoints
        └── beritaRoutes.js    # News endpoints
```

---

## 🔐 Sistem Authentikasi

### Flow Authentication
1. User melakukan **register** dengan username, email, dan password
2. Password di-hash menggunakan **bcryptjs** untuk keamanan
3. User melakukan **login** dengan email dan password
4. Server mengirimkan **JWT token** (valid 7 hari)
5. Token digunakan di setiap request protected dengan header: `Authorization: Bearer <token>`

### Role-Based Access Control
- **user** - Hanya bisa lihat profil sendiri
- **admin** - Bisa mengelola semua data (kategori, produk, berita, users)

---

## 📊 API Endpoints
- `POST /api/auth/register` - Daftar user baru
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get profile (protected)
- `PUT /api/auth/profile` - Update profile (protected)

### Users (Admin Only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user (admin)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Produk
- `GET /api/produk` - Get all produk
- `GET /api/produk/:id` - Get produk by ID
- `GET /api/produk/jenis/:jenis` - Get produk by jenis (type/category)
- `POST /api/produk` - Create produk (admin)
- `PUT /api/produk/:id` - Update produk (admin)
- `DELETE /api/produk/:id` - Delete produk (admin)

### Berita
- `GET /api/berita` - Get all berita
- `GET /api/berita/:id` - Get berita by ID
- `GET /api/berita/status/:status` - Get berita by status (draft/published/archived)
- `POST /api/berita` - Create berita (admin)
- `PUT /api/berita/:id` - Update berita (admin)
- `DELETE /api/berita/:id` - Delete berita (admin)

---

## 📝 Request & Response Examples

### 1️⃣ Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "address": "Jl. Contoh No. 123",
  "phone": "08123456789"
}
```

Response (201 Created):
```json
{
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user",
    "avatar_url": null,
    "address": "Jl. Contoh No. 123",
    "phone": "08123456789",
    "created_at": "2025-11-26T10:30:00.000Z",
    "updated_at": "2025-11-26T10:30:00.000Z"
  }
}
```

---

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

#### Get Profile (Protected)
```http
GET /api/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Response (200 OK):
```json
{
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user",
    "avatar_url": "https://...",
    "address": "Jl. Contoh No. 123",
    "phone": "08123456789",
    "created_at": "2025-11-26T10:30:00.000Z",
    "updated_at": "2025-11-26T10:30:00.000Z"
  }
}
```

---

#### Update Profile (Protected)
```http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data (all optional):
- username: john_doe_updated
- email: john_new@example.com
- address: Jl. Baru No. 456
- phone: 08987654321
- avatar: [file.jpg] (optional)
```

Response (200 OK):
```json
{
  "user": {
    "id": 1,
    "username": "john_doe_updated",
    "email": "john_new@example.com",
    "role": "user",
    "avatar_url": "https://res.cloudinary.com/...",
    "address": "Jl. Baru No. 456",
    "phone": "08987654321",
    "created_at": "2025-11-26T10:30:00.000Z",
    "updated_at": "2025-11-26T11:00:00.000Z"
  }
}
```

---

### 2️⃣ Category Management

#### Get All Categories (Public)
```http
GET /api/kategori
```

Response (200 OK):
```json
{
  "kategori": [
    { "id": 1, "name": "Elektronik" },
    { "id": 2, "name": "Fashion" }
  ]
}
```

---

#### Get Category By ID (Public)
```http
GET /api/kategori/1
```

Response (200 OK):
```json
{
  "kategori": {
    "id": 1,
    "name": "Elektronik"
  }
}
```

---

#### Create Category (Admin Only)
```http
POST /api/kategori
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Elektronik"
}
```

Response (201 Created):
```json
{
  "kategori": {
    "id": 3,
    "name": "Elektronik"
  }
}
```

---

#### Update Category (Admin Only)
```http
PUT /api/kategori/1
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Elektronik & Gadget"
}
```

Response (200 OK):
```json
{
  "kategori": {
    "id": 1,
    "name": "Elektronik & Gadget"
  }
}
```

---

#### Delete Category (Admin Only)
```http
DELETE /api/kategori/1
Authorization: Bearer <admin_token>
```

Response (200 OK):
```json
{
  "message": "Kategori deleted successfully",
  "id": 1
}
```

---

### 3️⃣ Product Management

#### Get All Products (Public)
```http
GET /api/produk
```

Response (200 OK):
```json
{
  "produk": [
    {
      "id": 1,
      "nama_produk": "Laptop Dell",
      "harga": 5000000,
      "deskripsi": "Laptop berkualitas tinggi",
      "image_url": "https://res.cloudinary.com/...",
      "jenis": "Elektronik"
    }
  ]
}
```

---

#### Get Products By Jenis (Public)
```http
GET /api/produk/jenis/Elektronik
```

Response (200 OK):
```json
{
  "produk": [
    {
      "id": 1,
      "nama_produk": "Laptop Dell",
      "harga": 5000000,
      "deskripsi": "Laptop berkualitas tinggi",
      "image_url": "https://res.cloudinary.com/...",
      "jenis": "Elektronik"
    }
  ]
}
```

---

#### Create Product (Admin Only)
```http
POST /api/produk
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data

Form Data:
- nama_produk: Laptop Dell
- harga: 5000000
- deskripsi: Laptop berkualitas tinggi dengan prosesor terbaru
- jenis: Elektronik
- image: [file.jpg] (optional)
```

Response (201 Created):
```json
{
  "produk": {
    "id": 1,
    "nama_produk": "Laptop Dell",
    "harga": 5000000,
    "deskripsi": "Laptop berkualitas tinggi dengan prosesor terbaru",
    "image_url": "https://res.cloudinary.com/...",
    "jenis": "Elektronik"
  }
}
```

---

#### Update Product (Admin Only)
```http
PUT /api/produk/1
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data

Form Data (all optional):
- nama_produk: Laptop Dell XPS
- harga: 6000000
- deskripsi: Laptop premium dengan display 4K
- jenis: Elektronik
- image: [file.jpg] (optional)
```

Response (200 OK):
```json
{
  "produk": {
    "id": 1,
    "nama_produk": "Laptop Dell XPS",
    "harga": 6000000,
    "deskripsi": "Laptop premium dengan display 4K",
    "image_url": "https://res.cloudinary.com/...",
    "jenis": "Elektronik"
  }
}
```

---

#### Delete Product (Admin Only)
```http
DELETE /api/produk/1
Authorization: Bearer <admin_token>
```

Response (200 OK):
```json
{
  "message": "Produk deleted successfully",
  "id": 1
}
```

---

### 4️⃣ News Management

#### Get All News (Public)
```http
GET /api/berita
```

Response (200 OK):
```json
{
  "berita": [
    {
      "id": 1,
      "judul": "Berita Terbaru",
      "konten": "Isi berita di sini...",
      "image_url": "https://res.cloudinary.com/...",
      "author": "Admin",
      "status": "published",
      "created_at": "2025-11-26T10:30:00.000Z"
    }
  ]
}
```

---

#### Get News By Status (Public)
```http
GET /api/berita/status/published
```

Valid status: `draft`, `published`, `archived`

Response (200 OK):
```json
{
  "berita": [
    {
      "id": 1,
      "judul": "Berita Terbaru",
      "konten": "Isi berita di sini...",
      "image_url": "https://res.cloudinary.com/...",
      "author": "Admin",
      "status": "published",
      "created_at": "2025-11-26T10:30:00.000Z"
    }
  ]
}
```

---

#### Create News (Admin Only)
```http
POST /api/berita
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data

Form Data:
- judul: Berita Terbaru
- konten: Isi berita yang informatif dan menarik
- author: Admin
- status: published
- image: [file.jpg] (optional)
```

Response (201 Created):
```json
{
  "berita": {
    "id": 1,
    "judul": "Berita Terbaru",
    "konten": "Isi berita yang informatif dan menarik",
    "image_url": "https://res.cloudinary.com/...",
    "author": "Admin",
    "status": "published",
    "created_at": "2025-11-26T10:30:00.000Z"
  }
}
```

---

#### Update News (Admin Only)
```http
PUT /api/berita/1
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data

Form Data:
- judul: Berita Update
- konten: Konten berita yang telah diperbarui
- author: Admin
- status: published
- image: [file.jpg] (optional)
```

Response (200 OK):
```json
{
  "berita": {
    "id": 1,
    "judul": "Berita Update",
    "konten": "Konten berita yang telah diperbarui",
    "image_url": "https://res.cloudinary.com/...",
    "author": "Admin",
    "status": "published",
    "created_at": "2025-11-26T10:30:00.000Z"
  }
}
```

---

#### Delete News (Admin Only)
```http
DELETE /api/berita/1
Authorization: Bearer <admin_token>
```

Response (200 OK):
```json
{
  "message": "Berita deleted successfully",
  "id": 1
}
```

---

### 5️⃣ User Management (Admin Only)

#### Get All Users (Admin Only)
```http
GET /api/users
Authorization: Bearer <admin_token>
```

Response (200 OK):
```json
{
  "users": [
    {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "role": "user",
      "avatar_url": "https://...",
      "address": "Jl. Contoh No. 123",
      "phone": "08123456789",
      "created_at": "2025-11-26T10:30:00.000Z",
      "updated_at": "2025-11-26T10:30:00.000Z"
    }
  ]
}
```

---

#### Get User By ID (Admin Only)
```http
GET /api/users/1
Authorization: Bearer <admin_token>
```

Response (200 OK):
```json
{
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user",
    "avatar_url": "https://...",
    "address": "Jl. Contoh No. 123",
    "phone": "08123456789",
    "created_at": "2025-11-26T10:30:00.000Z",
    "updated_at": "2025-11-26T10:30:00.000Z"
  }
}
```

---

#### Update User (Admin Only)
```http
PUT /api/users/1
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data

Form Data (all optional):
- username: john_updated
- email: john_updated@example.com
- role: admin
- address: Jl. Baru No. 456
- phone: 08987654321
- avatar: [file.jpg] (optional)
```

Response (200 OK):
```json
{
  "user": {
    "id": 1,
    "username": "john_updated",
    "email": "john_updated@example.com",
    "role": "admin",
    "avatar_url": "https://...",
    "address": "Jl. Baru No. 456",
    "phone": "08987654321",
    "created_at": "2025-11-26T10:30:00.000Z",
    "updated_at": "2025-11-26T11:00:00.000Z"
  }
}
```

---

#### Delete User (Admin Only)
```http
DELETE /api/users/1
Authorization: Bearer <admin_token>
```

Response (200 OK):
```json
{
  "message": "User deleted successfully",
  "id": 1
}
```

---

## 🛡️ Error Handling

Semua error response akan mengikuti format:

```json
{
  "message": "Deskripsi error"
}
```

**Common Error Status:**
- `400 Bad Request` - Input tidak valid
- `401 Unauthorized` - Token tidak valid atau expired
- `403 Forbidden` - Tidak punya akses (bukan admin)
- `404 Not Found` - Resource tidak ditemukan
- `500 Internal Server Error` - Server error

---

## 💡 Tips Testing

### Menggunakan Postman atau Insomnia:

1. **Simpan Token**
   - Buat request Login
   - Copy token dari response
   - Buat Environment Variable: `token = <token>`
   - Gunakan di Protected Routes: `Authorization: Bearer {{token}}`

2. **Testing Image Upload**
   - Gunakan tab "Body" → "form-data"
   - Set key "image" dengan type "File"
   - Select file dari komputer

3. **Admin Testing**
   - Login dengan akses admin (update role di database terlebih dahulu)
   - Gunakan token admin untuk CRUD operations

---

## 📚 Teknologi Stack

| Layer | Teknologi |
|-------|-----------|
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Database** | PostgreSQL |
| **Authentication** | JWT + bcryptjs |
| **File Storage** | Cloudinary |
| **Security** | Helmet.js |
| **HTTP Logging** | Morgan |
| **Development** | Nodemon |

---

## ⚠️ Important Notes

1. **JWT Token Expiry**: Token berlaku 7 hari. User perlu login ulang setelahnya
2. **Password Hashing**: Password di-hash dengan bcryptjs level 10
3. **Database Connection**: Pastikan PostgreSQL running sebelum start server
4. **Cloudinary**: Dibutuhkan untuk upload image. Atur di `.env`
5. **CORS**: Diaktifkan untuk semua origin (bisa dikonfigurasi lebih ketat)
