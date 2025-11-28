import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import kategoriRoutes from './src/routes/kategoriRoutes.js';
import produkRoutes from './src/routes/produkRoutes.js';
import beritaRoutes from './src/routes/beritaRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/kategori', kategoriRoutes);
app.use('/api/produk', produkRoutes);
app.use('/api/berita', beritaRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ 
    message: err.message || 'Internal server error' 
  });
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
