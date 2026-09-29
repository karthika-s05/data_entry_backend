import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import { seedParagraphs } from './config/seedParagraphs.js';
import candidateRoutes from './routes/candidateRoutes.js';
import assessmentRoutes from './routes/assessmentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { notFoundHandler, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

// Connect to MongoDB & Seed Paragraphs
connectDB().then(() => {
  seedParagraphs();
});

const app = express();

const clientUrl = process.env.CLIENT_URL || '*';
const allowedOrigins = clientUrl === '*' ? '*' : [clientUrl];

if (clientUrl !== '*') {
  try {
    const parsed = new URL(clientUrl);
    const isDefaultPort =
      (parsed.protocol === 'http:' && (parsed.port === '80' || parsed.port === '')) ||
      (parsed.protocol === 'https:' && (parsed.port === '443' || parsed.port === ''));
    if (isDefaultPort) {
      allowedOrigins.push(`${parsed.protocol}//${parsed.hostname}`);
    }
  } catch {
    // Keep the configured CLIENT_URL as the only allowed origin.
  }
}

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'KST Infotech Typing Assessment API is running' });
});

// API Routes
app.use('/api/candidates', candidateRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/admin', adminRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDist = path.resolve(__dirname, '../frontend/dist');

app.use(express.static(frontendDist));

app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(frontendDist, 'index.html'));
});

app.get("/", (req, res) => {
  res.json({
    message: "Backend running successfully"
  });
});

// Error Handling Middleware
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
