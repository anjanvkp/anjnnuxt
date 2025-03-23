import { defineEventHandler, createError } from 'h3';
import { CNNote } from '~/server/models/CNNote';
import { Folio } from '~/server/models/Folio';
import mongoose from 'mongoose';

// Default export for GET handler
export default defineEventHandler(async (event) => {
  if (event.method !== 'GET') {
    return createError({
      statusCode: 405,
      message: 'Method not allowed'
    });
  }

  try {
    const cnNotes = await CNNote.find().sort({ createdAt: -1 });
    return {
      status: 'success',
      data: cnNotes
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: `Error fetching CN Notes: ${error.message}`
    });
  }
});

// Create new CN Note with associated Folio records
export const POST = defineEventHandler(async (event) => {
  try {
    const { formData, recordsData } = await readBody(event);
    const userId = event.context.auth?.user?.id;

    if (!userId) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized'
      });
    }

    // Add user to formData
    const enrichedFormData = {
      ...formData,
      user: userId
    };

    // Add user to each record
    const enrichedRecordsData = recordsData.map((record: any) => ({
      ...record,
      user: userId
    }));

    // Create CN Note and associated Folio records in a transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const cnNote = await CNNote.create([enrichedFormData], { session })
        .then((docs: any) => {
          const doc = docs[0];
          // Add CNNote _id to each record
          enrichedRecordsData.forEach((record: any) => {
            record.cnNoteId = doc._id;
          });
          return doc;
        });

      // Insert all records into FolioModel
      const savedRecords = await Folio.insertMany(enrichedRecordsData, { session });

      // Extract IDs from saved records and update CNNote
      const savedRecordIds = savedRecords.map(record => record["_id"]);
      await CNNote.findByIdAndUpdate(
        cnNote._id,
        { Folio_rec: savedRecordIds },
        { new: true, session }
      );

      await session.commitTransaction();
      return {
        status: 'success',
        data: {
          cnNote,
          folioRecords: savedRecords
        }
      };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: `Error creating CN Note: ${error.message}`
    });
  }
});

// Update existing CN Note and associated Folio records
export const PUT = defineEventHandler(async (event) => {
  try {
    const { formData, recordsData } = await readBody(event);
    const userId = event.context.auth?.user?.id;

    if (!userId) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized'
      });
    }

    if (!formData.id) {
      throw createError({
        statusCode: 400,
        message: 'CN Note ID is required'
      });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Update CN Note
      const cnNote = await CNNote.findByIdAndUpdate(
        formData.id,
        { ...formData, user: userId },
        { new: true, session }
      );

      if (!cnNote) {
        throw createError({
          statusCode: 404,
          message: 'CN Note not found'
        });
      }

      // Delete existing Folio records
      await Folio.deleteMany({ cnNoteId: cnNote._id }, { session });

      // Create new Folio records
      const savedRecords = await Folio.insertMany(
        recordsData.map((record: any) => ({
          ...record,
          user: userId,
          cnNoteId: cnNote._id
        })),
        { session }
      );

      // Update CN Note with new Folio record IDs
      const savedRecordIds = savedRecords.map(record => record['_id']);
      await CNNote.findByIdAndUpdate(
        cnNote._id,
        { Folio_rec: savedRecordIds },
        { new: true, session }
      );

      await session.commitTransaction();
      return {
        status: 'success',
        data: {
          cnNote,
          folioRecords: savedRecords
        }
      };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: `Error updating CN Note: ${error.message}`
    });
  }
});