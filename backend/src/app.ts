// backend/src/app.ts - Updated to include document generation routes

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';
import { corsMiddleware } from './cors-middleware';

// Import routes
// In backend/src/app.ts - Add this with the other route imports
import chatRoutes from './routes/chatRoutes';
import documentRoutes from './routes/documentRoutes';
import testRoutes from './routes/testRoutes';
import documentGenerationRoutes from './routes/documentGenerationRoutes';
import contractRoutes from './routes/contractRoutes'; // Add this line


// Load environment variables
dotenv.config();

const app = express();

// ENHANCED CORS SETUP - THIS IS THE FIX
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Handle preflight requests
app.options('*', cors());

// Use custom CORS middleware
app.use(corsMiddleware);

// Log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Standard middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Database connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/legal-ai';
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    console.log('⚠️ Server will continue running but database features will be unavailable');
  }
};

// Connect to database
connectDB();

// Routes - apply CORS to each route
app.use('/api/chat', corsMiddleware, chatRoutes);
app.use('/api/documents', corsMiddleware, documentRoutes);
app.use('/api/test', corsMiddleware, testRoutes);
app.use('/api/generate-document', corsMiddleware, documentGenerationRoutes);
app.use('/api/contracts', corsMiddleware, contractRoutes); // Add this line

// Health check endpoint
app.get('/api/health', corsMiddleware, (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    openai: process.env.OPENAI_API_KEY ? 'configured' : 'not configured',
    services: {
      chat: 'available',
      documents: 'available',
      documentGeneration: 'available'
    }
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
  }
  
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ error: 'Invalid file type. Only PDF, Word, Text, and RTF files are allowed.' });
  }
  
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

export default app;