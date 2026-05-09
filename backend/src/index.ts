import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Serve static frontend files
import path from 'path';
const frontendPath = process.env.NODE_ENV === 'production' 
  ? path.join(__dirname, '../public') 
  : path.join(__dirname, '../../frontend/dist');

app.use(express.static(frontendPath));

app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    res.sendFile(path.join(frontendPath, 'index.html'));
  } else {
    next();
  }
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Terjadi kesalahan pada server' });
});

// Start Server & Check API Key
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
  if (!process.env.GEMINI_API_KEY) {
    console.error('\n[ERROR] GEMINI_API_KEY tidak ditemukan di environment variables.');
    console.error('Silakan set GEMINI_API_KEY sebelum menggunakan fitur AI Mentor.\n');
  } else {
    console.log('[INFO] GEMINI_API_KEY terdeteksi.');
  }
});
