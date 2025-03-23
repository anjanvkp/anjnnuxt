// server/api/auth/login.ts
import { defineEventHandler, readBody, createError } from 'h3';
import User from '../../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {

  
  const body = await readBody(event);
  const { username, password } = body;
  
  if (!username || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Missing username or password' });
  }
  
  // Find the user by username
  const user = await User.findOne({ username });
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' });
  }
  
  // Validate the password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' });
  }
  user.lastLogin = new Date();
  user.save();
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  
  // Token payload
  const tokenPayload = {
    id: user._id,
    username: user.username,
    email: user.email,
    fullname: user.fullname,
    role: user.role // Add user role to the payload
  };
  
  // Create tokens:
  // - Access token (short-lived)
  // - Refresh token (long-lived)
  const accessToken = jwt.sign(tokenPayload, secret, { expiresIn: '15m' });
  const refreshToken = jwt.sign(tokenPayload, secret, { expiresIn: '7d' });
  
  return { accessToken, refreshToken, user: tokenPayload };
});