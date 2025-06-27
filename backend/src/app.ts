// backend/src/app.ts - Updated to include freemium features + keep-alive service (preserving all existing functionality)

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';
import { corsMiddleware } from './cors-middleware';

// Import existing routes (keeping all your existing functionality)
import chatRoutes from './routes/chatRoutes';
import documentRoutes from './routes/documentRoutes';
import testRoutes from './routes/testRoutes';
import documentGenerationRoutes from './routes/documentGenerationRoutes';
import contractRoutes from './routes/contractRoutes';

// Import NEW guest routes for freemium features
import guestDocumentRoutes from './routes/guestDocumentRoutes';

// NEW: Import keep-alive service
import KeepAliveService from './services/keepAlive';

// Load environment variables
dotenv.config();

const app = express();

// ENHANCED CORS SETUP - KEEPING YOUR EXISTING SETUP
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Handle preflight requests
app.options('*', cors());

// Use custom CORS middleware
app.use(corsMiddleware);

// Log requests (enhanced to show guest vs auth)
app.use((req, res, next) => {
  const isGuestEndpoint = req.originalUrl.includes('/guest') || req.originalUrl.includes('/api/chat/guest');
  const logPrefix = isGuestEndpoint ? '🎯 GUEST' : '🔐 AUTH';
  console.log(`${logPrefix} ${req.method} ${req.originalUrl}`);
  next();
});

// Standard middleware (keeping your existing setup + increased timeouts)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Set timeout for incoming requests (important for file uploads)
app.use((req, res, next) => {
  // Set a longer timeout for upload endpoints
  if (req.url.includes('/upload')) {
    req.setTimeout(120000); // 2 minutes for uploads
    res.setTimeout(120000);
  }
  next();
});

// Serve static files from uploads directory (keeping existing)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Database connection (keeping your existing setup)
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

// ROUTES CONFIGURATION
// ==================

// 🎯 GUEST ROUTES - NO AUTHENTICATION REQUIRED (place BEFORE authenticated routes)
app.use('/api/guest/documents', corsMiddleware, guestDocumentRoutes);

// 🔐 AUTHENTICATED ROUTES - ALL YOUR EXISTING ROUTES (keeping exactly as they were)
app.use('/api/chat', corsMiddleware, chatRoutes); // This now includes guest chat at /api/chat/guest
app.use('/api/documents', corsMiddleware, documentRoutes);
app.use('/api/test', corsMiddleware, testRoutes);
app.use('/api/generate-document', corsMiddleware, documentGenerationRoutes);
app.use('/api/contracts', corsMiddleware, contractRoutes);

// ENHANCED HEALTH CHECK - showing new freemium features + keep-alive status
app.get('/api/health', corsMiddleware, (req, res) => {
  // NEW: Get keep-alive status
  const keepAlive = KeepAliveService.getInstance();
  const keepAliveStatus = keepAlive.getStatus();
  
  // Check if this is a keep-alive ping
  const isKeepAlivePing = req.headers['x-keep-alive'] === 'true';
  
  const healthData = {
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    openai: process.env.OPENAI_API_KEY ? 'configured' : 'not configured',
    // NEW: Keep-alive status
    environment: process.env.NODE_ENV || 'development',
    platform: process.env.RENDER ? 'Render' : 'Other',
    keepAlive: {
      active: keepAliveStatus.isActive,
      pings: keepAliveStatus.pingCount,
      isInternalPing: isKeepAlivePing
    },
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
    },
    services: {
      chat: 'available',
      documents: 'available',
      documentGeneration: 'available',
      contracts: 'available'
    },
    // NEW: Freemium features
    freemiumFeatures: {
      guestChat: 'available',
      guestUpload: 'available',
      limitations: {
        maxFiles: 3,
        maxSizePerFile: '5MB',
        storage: 'temporary (24hrs)'
      }
    }
  };
  
  if (isKeepAlivePing) {
    console.log(`🏓 Keep-alive health check received (ping #${keepAliveStatus.pingCount})`);
  }
  
  res.json(healthData);
});

// ENHANCED ERROR HANDLING - with freemium context (keeping your existing setup)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  
  const isGuestEndpoint = req.originalUrl.includes('/guest');
  
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ 
      error: 'File too large', 
      maxSize: isGuestEndpoint ? '5MB for free users' : '10MB for premium users',
      suggestion: isGuestEndpoint ? 'Create a free account for larger uploads!' : 'Please use a smaller file'
    });
  }
  
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ 
      error: 'Invalid file type. Only PDF, Word, Text, and RTF files are allowed.',
      suggestion: isGuestEndpoint ? 'Create a free account for additional format support!' : 'Please check your file format'
    });
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({
      error: 'Too many files',
      maxFiles: isGuestEndpoint ? '3 files for free users' : '10 files for premium users',
      suggestion: isGuestEndpoint ? 'Create a free account for unlimited uploads!' : 'Please upload fewer files'
    });
  }
  
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    suggestion: isGuestEndpoint ? 'For better reliability, consider creating a free account!' : 'Please try again or contact support'
  });
});

// ENHANCED 404 HANDLER - showing available endpoints (keeping your existing setup)
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    availableEndpoints: {
      // NEW: Guest endpoints (freemium)
      guest: {
        chat: '/api/chat/guest',
        chatTest: '/api/chat/guest/test',
        documents: '/api/guest/documents/test',
        upload: '/api/guest/documents/upload'
      },
      // Existing authenticated endpoints
      authenticated: {
        chat: '/api/chat',
        chatTest: '/api/chat/test',
        documents: '/api/documents',
        upload: '/api/documents/upload',
        generateDocument: '/api/generate-document',
        contracts: '/api/contracts',
        test: '/api/test'
      },
      general: {
        health: '/api/health'
      }
    }
  });
});

const PORT = Number(process.env.PORT) || 3001;

// START SERVER WITH KEEP-ALIVE SERVICE
const server = app.listen(PORT, '0.0.0.0', () => {
  // Set server timeout for file uploads
  server.timeout = 120000; // 2 minutes
  console.log(`🚀 Legal Chat AI Backend running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Server URL: http://localhost:${PORT}`);
  
  // NEW: Log platform information
  if (process.env.RENDER) {
    console.log('☁️  Running on Render platform');
    console.log(`🔗 Service URL: ${process.env.RENDER_SERVICE_URL || 'Not set'}`);
  } else {
    console.log('🏠 Running in local/other environment');
  }
  
  console.log(`
🆕 NEW FREEMIUM FEATURES:
   🎯 Guest Chat: http://localhost:${PORT}/api/chat/guest
   📤 Guest Upload: http://localhost:${PORT}/api/guest/documents/upload
   
🔐 EXISTING FEATURES (ALL PRESERVED):
   💬 Auth Chat: http://localhost:${PORT}/api/chat
   📄 Auth Documents: http://localhost:${PORT}/api/documents
   🏗️ Document Generation: http://localhost:${PORT}/api/generate-document
   📊 Contracts: http://localhost:${PORT}/api/contracts
   🧪 Test: http://localhost:${PORT}/api/test
   ❤️ Health: http://localhost:${PORT}/api/health
  `);
  
  // NEW: Start keep-alive service AFTER server is running
  if (process.env.NODE_ENV === 'production' && process.env.RENDER) {
    console.log('🚀 Initializing keep-alive service for Render...');
    const keepAlive = KeepAliveService.getInstance();
    
    // Start keep-alive service after a short delay to ensure server is fully ready
    setTimeout(() => {
      keepAlive.start();
    }, 30000); // Start after 30 seconds
  } else {
    console.log('🏠 Keep-alive service disabled (not running on Render production)');
  }
});

// NEW: Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  
  // Stop keep-alive service
  const keepAlive = KeepAliveService.getInstance();
  keepAlive.stop();
  
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  
  // Stop keep-alive service
  const keepAlive = KeepAliveService.getInstance();
  keepAlive.stop();
  
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

export default app;