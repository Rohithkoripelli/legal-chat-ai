import app from './app';
import fs from 'fs';
import path from 'path';

// Use port 3001 to avoid conflicts and maintain consistency
const PORT = 3001;

// Log OpenAI API key status (without revealing the key)
if (process.env.OPENAI_API_KEY) {
  console.log('✅ OpenAI API key found');
} else {
  console.warn('⚠️  Warning: OPENAI_API_KEY not found in environment variables');
}

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory');
}

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api/`);
});