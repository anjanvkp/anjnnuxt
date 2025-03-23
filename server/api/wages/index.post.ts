import { Wage } from '../../models/Wage'
import { MasterRoll } from '../../models/MasterRoll'
import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  // Get user ID from context (set by auth middleware)
  const userId = event.context.userId
  const firmId = event.context.user.firmId
  
  if (!userId) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  try {
    // Get request body
    const { wages } = await readBody(event)
    
    if (!wages || !Array.isArray(wages) || wages.length === 0) {
      throw createError({
        statusCode: 400,
        message: 'Invalid wage data'
      })
    }

    // Add userId to each wage record
    const wagesWithUserId = wages.map(wage => ({
      ...wage,
      userId,
      firmId
    }))

    // Save wages to database
    const savedWages = await Wage.insertMany(wagesWithUserId)

    // Update pDayWage in MasterRoll for each employee
    const updatePromises = wages.map(wage => {
      return MasterRoll.findByIdAndUpdate(
        wage.masterRollId,
        { pDayWage: wage.pDayWage },
        { new: true }
      )
    })

    await Promise.all(updatePromises)

    return {
      success: true,
      message: 'Wages saved successfully',
      count: savedWages.length
    }
  } catch (error: any) {
    console.error('Error saving wages:', error)
    
    throw createError({
      statusCode: 500,
      message: `Error saving wages: ${error.message}`
    })
  }
})