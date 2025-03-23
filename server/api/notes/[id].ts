import { getFirestore } from 'firebase-admin/firestore';
import type { UpdateNoteDto, Note } from '~/server/models/Note';

export default defineEventHandler(async (event) => {
  const userId = event.context.userId;
  if (!userId) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    });
  }

  const id = event.context.params?.id;
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Note ID is required'
    });
  }

  const db = getFirestore();
  const noteRef = db.collection('notes').doc(id);

  // GET - Get a specific note
  if (event.method === 'GET') {
    const doc = await noteRef.get();
    if (!doc.exists) {
      throw createError({
        statusCode: 404,
        message: 'Note not found'
      });
    }

    const note = doc.data() as Note;
    if (note.userId !== userId) {
      throw createError({
        statusCode: 403,
        message: 'Access denied'
      });
    }

    return {
      id: doc.id,
      ...note
    };
  }

  // PUT - Update a note
  if (event.method === 'PUT') {
    const doc = await noteRef.get();
    if (!doc.exists) {
      throw createError({
        statusCode: 404,
        message: 'Note not found'
      });
    }

    const existingNote = doc.data() as Note;
    if (existingNote.userId !== userId) {
      throw createError({
        statusCode: 403,
        message: 'Access denied'
      });
    }

    const body = await readBody<UpdateNoteDto>(event);
    const updateData: Partial<Note> = {
      ...(body.title && { title: body.title }),
      ...(body.content && { content: body.content }),
      updatedAt: new Date()
    };

    await noteRef.update(updateData);
    
    return {
      message: 'Note updated successfully'
    };
  }

  // DELETE - Delete a note
  if (event.method === 'DELETE') {
    const doc = await noteRef.get();
    if (!doc.exists) {
      throw createError({
        statusCode: 404,
        message: 'Note not found'
      });
    }

    const note = doc.data() as Note;
    if (note.userId !== userId) {
      throw createError({
        statusCode: 403,
        message: 'Access denied'
      });
    }

    await noteRef.delete();
    
    return {
      message: 'Note deleted successfully'
    };
  }
});