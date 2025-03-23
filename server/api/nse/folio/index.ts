import { Folio } from '~/server/models/Folio';
import { createError } from 'h3';

// Get all folio records for the authenticated user
export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.auth?.user?.id;
    if (!userId) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized'
      });
    }

    const folioRecords = await Folio.find({ user: userId }).lean();
    
    if (!folioRecords) {
      return [];
    }

    return folioRecords;
  } catch (error) {
    console.error('Error fetching folio records:', error);
    throw createError({
      statusCode: 500,
      message: 'Error fetching folio records'
    });
  }
});