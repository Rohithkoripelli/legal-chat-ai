import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Request to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      user?: any;
    }
  }
}

export const clerkAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'No authorization token provided',
        message: 'Please log in to access this resource'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify Clerk JWT token
    const decoded = jwt.decode(token) as any;
    
    if (!decoded || !decoded.sub) {
      return res.status(401).json({ 
        error: 'Invalid token',
        message: 'Please log in again'
      });
    }

    // Add userId to request object
    req.userId = decoded.sub;
    req.user = decoded;
    
    console.log('✅ Authenticated user:', req.userId);
    next();
    
  } catch (error) {
    console.error('❌ Auth middleware error:', error);
    return res.status(401).json({ 
      error: 'Authentication failed',
      message: 'Please log in to continue'
    });
  }
};

// Optional middleware - allow requests without auth (for public endpoints)
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = jwt.decode(token) as any;
      
      if (decoded && decoded.sub) {
        req.userId = decoded.sub;
        req.user = decoded;
        console.log('✅ Optional auth - user identified:', req.userId);
      }
    }
    
    next();
  } catch (error) {
    console.warn('⚠️ Optional auth failed:', error);
    next(); // Continue without auth
  }
};