import { MasterRoll } from '../../models/MasterRoll';
import { createError } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    // Get userId from the event context (set by auth middleware)
    const userId = event.context.userId;
    const firmId = event.context.user.firmId;
    // Connect to database and fetch employees for the current user only
    const employees = await MasterRoll.find({ firmId }).sort({ employeeName: 1 })
    
    return {
      employees
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal server error'
    })
  }
})
