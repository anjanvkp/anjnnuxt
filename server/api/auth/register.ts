// server/api/auth/register.ts
import { defineEventHandler, readBody, createError } from 'h3';
import User from '../../models/User';
import Firm from '../../models/Firm';
import ManagerCode from '../../models/ManagerCode';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

export default defineEventHandler(async (event) => {
  
  const body = await readBody(event);
  const { username, email, fullname, password, firmId, managerCode } = body;
  
  if (!username || !email || !fullname || !password || !firmId) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required fields' });
  }
  
  // Check if a user with the same username or email exists
  const existingUser = await User.findOne({ $or: [{ username }, { email }]});
  if (existingUser) {
    throw createError({ statusCode: 400, statusMessage: 'User already exists' });
  }
  
  // Verify that the firm exists and is approved
  try {
    const firm = await Firm.findById(firmId);
    if (!firm) {
      throw createError({ statusCode: 400, statusMessage: 'Selected firm does not exist' });
    }
    
    // Check if the firm is approved
    if (firm.status !== 'approved') {
      throw createError({ 
        statusCode: 403, 
        statusMessage: 'Selected firm is pending approval. Please contact an administrator or select an approved firm.' 
      });
    }
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'name' in error && error.name === 'CastError') {
      throw createError({ statusCode: 400, statusMessage: 'Invalid firm ID format' });
    }
    throw error;
  }
  
  // Default role is 'user'
  let userRole = 'user';
  
  // Check if manager code was provided
  if (managerCode) {
    // Look for a valid, unused manager code
    const validCode = await ManagerCode.findOne({ code: managerCode, used: false });
    
    if (validCode) {
      // Set role to manager if code is valid
      userRole = 'manager';
      
      // Mark the code as used
      validCode.used = true;
      validCode.usedAt = new Date();
      validCode.usedBy = new mongoose.Types.ObjectId();
      await validCode.save();
    } else {
      throw createError({ statusCode: 400, statusMessage: 'Invalid or already used manager code' });
    }
  }
  
  // Hash the password
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  
  // Create and save the user
  const user = new User({
    username,
    email,
    fullname,
    password: hashedPassword,
    role: userRole,
    firmId: new mongoose.Types.ObjectId(firmId)
  });
  
  await user.save();
  
  return { message: 'User registered successfully' };
});