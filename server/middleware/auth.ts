// server/middleware/auth.ts
import { H3Event, createError } from 'h3';
import { verifyToken } from '../utils/auth';

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
    // Verify token and get user
    const user = await verifyToken(event);
    
    // Type assertion to define user structure
    interface User {
      _id: string | { toString(): string };
    }
    
    // Attach user to event context for downstream handlers
    event.context.user = user;
    
    // Add userId to event context for easier access in API handlers
    event.context.userId = ((user as User)._id).toString();
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 401,
      statusMessage: error.statusMessage || 'Unauthorized'
    });
  }
});