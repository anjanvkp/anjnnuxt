// server/api/firms/[id]/reject.ts
import { defineEventHandler, createError } from 'h3';
import Firm from '../../../models/Firm';
import { verifyToken } from '@/server/utils/auth';

export default defineEventHandler(async (event) => {
  // Verify admin authentication
  const user = await verifyToken(event);
  if (user.role !== 'admin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: Only admins can reject firms'
    });
  }

  const id = event.context.params?.id;
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Firm ID is required'
    });
  }

  try {
    const firm = await Firm.findById(id);
    if (!firm) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Firm not found'
      });
    }

    // Update firm status to rejected
    firm.status = 'rejected';
    await firm.save();

    return { message: 'Firm rejected successfully', firm };
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'name' in error && error.name === 'CastError') {
      throw createError({ statusCode: 400, statusMessage: 'Invalid firm ID format' });
    }
    throw error;
  }
});