export default function handler(req, res) {
  res.status(200).json({
    message: '✅ Legal AI API is working!',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    environment: process.env.NODE_ENV || 'development'
  });
}
