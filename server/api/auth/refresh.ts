// server/api/auth/refresh.ts
import { defineEventHandler, readBody, createError, setCookie } from 'h3';
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
    
    // Verify the user exists
    const user = await User.findById(decoded.id);
    if (!user) {
      throw createError({ statusCode: 401, statusMessage: 'Invalid refresh token' });
    }
    
    // Create new access token
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
    
    return { accessToken: newAccessToken };
  } catch (error: any) {
    // Clear both tokens if refresh fails
    setCookie(event, 'token', '', {
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    setCookie(event, 'refreshToken', '', {
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    throw createError({ 
      statusCode: 401, 
      statusMessage: error.name === 'TokenExpiredError' 
        ? 'Refresh token has expired' 
        : 'Invalid refresh token' 
    });
  }
});