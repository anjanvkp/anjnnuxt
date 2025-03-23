import { getFirestore } from 'firebase-admin/firestore';
import type { CreateNoteDto, Note } from '~/server/models/Note';

export default defineEventHandler(async (event) => {
  const userId = event.context.userId;
  if (!userId) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    });
  }

  const db = getFirestore();
  
  // GET - List all notes for the user
  if (event.method === 'GET') {
    const notesRef = db.collection('notes');
    const snapshot = await notesRef.where('userId', '==', userId).get();
    
    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }
  
  // POST - Create a new note
  if (event.method === 'POST') {
    const body = await readBody<CreateNoteDto>(event);
    
    if (!body.title || !body.content) {
      throw createError({
        statusCode: 400,
        message: 'Title and content are required'
      });
    }

    const note: Note = {
      title: body.title,
      content: body.content,
      userId: userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await db.collection('notes').add(note);
    const newNote = await docRef.get();
    
    return {
      id: docRef.id,
      ...newNote.data()
    };
  }

  throw createError({
    statusCode: 405,
    message: 'Method not allowed'
  });
});