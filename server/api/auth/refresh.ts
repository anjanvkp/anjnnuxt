// server/api/auth/refresh.ts
import { defineEventHandler, readBody, createError } from 'h3';
import jwt from 'jsonwebtoken';
import User from '../../models/User';

export default defineEventHandler(async (event) => {

  const body = await readBody(event);
  const { refreshToken } = body;
  
  if (!refreshToken) {
    throw createError({ statusCode: 401, statusMessage: 'Refresh token missing' });
  }
  
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  
  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, secret) as any;
    
    // Optionally verify the user exists
    const user = await User.findById(decoded.id);
    if (!user) {
      throw createError({ statusCode: 401, statusMessage: 'Invalid refresh token' });
    }
    
    // Reissue a new access token based on the user details
    const tokenPayload = {
      id: user._id,
      username: user.username,
      email: user.email,
      fullname: user.fullname
    };
    const newAccessToken = jwt.sign(tokenPayload, secret, { expiresIn: '15m' });
    
    return { accessToken: newAccessToken };
  } catch (error: any) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid or expired refresh token' });
  }
});