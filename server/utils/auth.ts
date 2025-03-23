// server/utils/auth.ts
import { H3Event, createError } from 'h3';
import jwt from 'jsonwebtoken';
import User from '../models/User';

interface JwtPayload {
  id: string;
  userId?: string;
  role?: string;
}

// Verify the JWT token from the request
export async function verifyToken(event: H3Event) {
  // Get token from cookie or authorization header
  const token = getCookie(event, 'token') || getRequestHeader(event, 'authorization')?.split(' ')[1];
  
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: No token provided'
    });
  }
  
  try {
    // Verify the token using process.env.JWT_SECRET directly instead of config.jwtSecret
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    
    const decoded = jwt.verify(token, secret) as JwtPayload;
    
    // Get user from database - support both id and userId fields from token
    const userId = decoded.id || decoded.userId;
    const user = await User.findById(userId);
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized: User not found'
      });
    }
    
    return user;
  } catch (error: any) {
    console.error('Token verification error:', error.message || error);
    
    // Provide more specific error messages based on the type of JWT error
    if (error.name === 'TokenExpiredError') {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized: Token has expired'
      });
    } else if (error.name === 'JsonWebTokenError') {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized: Invalid token signature'
      });
    } else if (error.name === 'NotBeforeError') {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized: Token not yet active'
      });
    } else {
      throw createError({
        statusCode: 401,
        statusMessage: `Unauthorized: ${error.message || 'Invalid token'}`
      });
    }
  }
}

// Check if user has required role
export function checkRole(user: any, requiredRoles: string[]) {
  if (!requiredRoles.includes(user.role)) {
    throw createError({
      statusCode: 403,
      statusMessage: `Forbidden: Requires ${requiredRoles.join(' or ')} role`
    });
  }
  return true;
}