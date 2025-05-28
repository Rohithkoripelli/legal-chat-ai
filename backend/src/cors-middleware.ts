import { Request, Response, NextFunction } from 'express';

export const corsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // OPTION 1: Allow everything (for testing)
  res.header('Access-Control-Allow-Origin', '*');
  
  // OPTION 2: Allow specific Vercel domains (uncomment this instead if you want to be more secure)
  // const origin = req.headers.origin;
  // if (origin && (origin.includes('vercel.app') || origin.includes('localhost'))) {
  //   res.header('Access-Control-Allow-Origin', origin);
  // }
  
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
};