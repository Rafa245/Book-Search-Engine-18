import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request } from 'express';

dotenv.config();

interface JwtPayload {
  _id: unknown;
  username: string;
  email: string;
}

// Function to verify and decode JWT
export const authenticateToken = (authHeader?: string): JwtPayload | null => {
  if (!authHeader) {
    throw new Error('Authorization header missing');
  }

  const token = authHeader.split(' ')[1];
  const secretKey = process.env.JWT_SECRET_KEY || '';

  try {
    return jwt.verify(token, secretKey) as JwtPayload;
  } catch (err) {
    throw new Error('Unauthorized: Invalid token');
  }
};

// Function to sign a new JWT token
export const signToken = (username: string, email: string, _id: unknown): string => {
  const payload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET_KEY || '';

  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

// Auth middleware for Apollo Server context
export const authMiddleware = ({ req }: { req: Request }) => {
  const authHeader = req.headers.authorization || "";
  
  try {
    const user = authenticateToken(authHeader);
    return { user };
  } catch {
    return { user: null }; // Allow requests without authentication
  }
};
