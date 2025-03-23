// server/api/dashboard.ts
import { defineEventHandler, createError } from 'h3';
import User from '../models/User';

export default defineEventHandler(async (event) => {
  // User is already authenticated by the middleware
  // and available in event.context.userId
  const userId = event.context.userId;
  
  // Fetch the user data from the database using userId
  const user = await User.findById(userId);
  
  if (!user) {
    throw createError({
      statusCode: 404,
      message: 'User not found'
    });
  }
  
  return { 
    message: 'Authenticated', 
    user: {
      id: userId,
      username: user.username,
      email: user.email,
      fullname: user.fullname,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      role: user.role
    } 
  };
});
