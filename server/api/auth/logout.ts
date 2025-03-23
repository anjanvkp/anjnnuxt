// server/api/auth/logout.ts
import { defineEventHandler, setCookie } from 'h3';

export default defineEventHandler(async (event) => {
  // Remove the token cookie
  setCookie(event, 'token', '', {
    maxAge: 0,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax'
  });

  // Remove the refresh token cookie
  setCookie(event, 'refreshToken', '', {
    maxAge: 0,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax'
  });

  return { message: 'Logged out successfully' };
});