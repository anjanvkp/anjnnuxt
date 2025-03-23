// server/middleware/auth.ts
import { H3Event, createError, getCookie, setCookie } from 'h3';
import { verifyToken } from '../utils/auth';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// List of public routes that don't require authentication
const publicRoutes = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/refresh',
  '/api/firms'
];

// List of routes with specific public methods
const publicMethodRoutes = [
  {
    path: '/api/firms',
    methods: ['GET', 'POST']
  }
];

// Only apply authentication to API routes
const requiresAuth = (path: string) => path.startsWith('/api/');

export default defineEventHandler(async (event: H3Event) => {
  const path = getRequestURL(event).pathname;
  
  // Skip authentication for non-API routes and public routes
  if (!requiresAuth(path) || publicRoutes.some(route => path.startsWith(route))) {
    return;
  }

  // Check for routes with specific public methods
  const publicMethodRoute = publicMethodRoutes.find(route => path.startsWith(route.path));
  if (publicMethodRoute && publicMethodRoute.methods.includes(event.node.req.method || '')) {
    return;
  }
  
  try {
    const token = getCookie(event, 'token');
    const refreshToken = getCookie(event, 'refreshToken');
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    if (!token && !refreshToken) {
      throw createError({
        statusCode: 401,
        statusMessage: 'No authentication tokens provided'
      });
    }

    if (token) {
      try {
        // Try to verify the access token
        const decoded = jwt.verify(token, secret) as any;
        const user = await User.findById(decoded.id);
        if (user) {
          event.context.user = user;
          event.context.userId = user._id.toString();
          return;
        }
      } catch (error: any) {
        // If token verification fails and we have a refresh token, try to refresh
        if (refreshToken && error.name === 'TokenExpiredError') {
          try {
            const decoded = jwt.verify(refreshToken, secret) as any;
            const user = await User.findById(decoded.id);
            
            if (user) {
              const tokenPayload = {
                id: user._id,
                username: user.username,
                email: user.email,
                fullname: user.fullname,
                role: user.role
              };

              const newAccessToken = jwt.sign(tokenPayload, secret, { expiresIn: '15m' });
              
              // Set the new access token in cookie
              setCookie(event, 'token', newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 900 // 15 minutes
              });

              event.context.user = user;
              event.context.userId = user._id.toString();
              return;
            }
          } catch (refreshError) {
            throw createError({
              statusCode: 401,
              statusMessage: 'Invalid refresh token'
            });
          }
        }
      }
    }

    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication failed'
    });
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 401,
      statusMessage: error.statusMessage || 'Unauthorized'
    });
  }
});