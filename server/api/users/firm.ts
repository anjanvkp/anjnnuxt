// server/api/users/firm.ts
import { defineEventHandler, createError } from 'h3';
import User from '../../models/User';
import { verifyToken } from '@/server/utils/auth';

export default defineEventHandler(async (event) => {
  // Verify authentication and ensure user is a manager
  const currentUser = await verifyToken(event);
  
  if (currentUser.role !== 'manager' && currentUser.role !== 'admin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: Only managers and admins can view firm users'
    });
  }

  // Get users from the same firm
  const users = await User.find({ firmId: currentUser.firmId })
    .select('-password')
    .sort({ createdAt: -1 });

  return { users };
});