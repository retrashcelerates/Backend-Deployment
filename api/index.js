import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from '../src/routes/authRoutes.js';
import userRoutes from '../src/routes/userRoutes.js';
import kategoriRoutes from '../src/routes/kategoriRoutes.js';
import produkRoutes from '../src/routes/produkRoutes.js';
import beritaRoutes from '../src/routes/beritaRoutes.js';

dotenv.config();

const app = express();

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
  res.json({ status: 'ok', message: 'Serverless API ready' });
});

export default function handler(req, res) {
  return app(req, res);
}
