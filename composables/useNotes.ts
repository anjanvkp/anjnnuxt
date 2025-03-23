import { ref } from 'vue';
import type { Note, CreateNoteDto, UpdateNoteDto } from '~/server/models/Note';
import { useToast } from './useToast';
import createDOMPurify from 'isomorphic-dompurify';

export const useNotes = () => {
  const notes = ref<Note[]>([]);
  const isLoading = ref(false);
  const toast = useToast();

  // Initialize DOMPurify
  const DOMPurify = createDOMPurify(window);

  const sanitizeContent = (content: string | undefined) => {
    if (!content) return '';
    return DOMPurify.sanitize(content, {
      ALLOWED_TAGS: [
        'p', 'br', 'b', 'i', 'u', 'strong', 'em',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li', 'blockquote', 'a', 'img'
      ],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'target']
    });
  };

  // Fetch all notes
  const fetchNotes = async () => {
    try {
      isLoading.value = true;
      const response = await $fetch<Note[]>('/api/notes');
      notes.value = response.map(note => ({
        ...note,
        content: sanitizeContent(note.content)
      }));
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to fetch notes');
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  // Create a new note
  const createNote = async (noteData: CreateNoteDto) => {
    try {
      const sanitizedData = {
        ...noteData,
        content: sanitizeContent(noteData.content)
      };
      const response = await $fetch<Note>('/api/notes', {
        method: 'POST',
        body: sanitizedData
      });
      notes.value.push(response);
      toast.success('Note created successfully');
      return response;
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to create note');
      throw error;
    }
  };

  // Update a note
  const updateNote = async (id: string, noteData: UpdateNoteDto) => {
    try {
      const sanitizedData = {
        ...noteData,
        content: sanitizeContent(noteData.content)
      };
      await $fetch(`/api/notes/${id}`, {
        method: 'PUT',
        body: sanitizedData
      });
      const index = notes.value.findIndex(note => note.id === id);
      if (index !== -1) {
        notes.value[index] = { ...notes.value[index], ...sanitizedData };
      }
      toast.success('Note updated successfully');
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to update note');
      throw error;
    }
  };

  // Delete a note
  const deleteNote = async (id: string) => {
    try {
      await $fetch(`/api/notes/${id}`, {
        method: 'DELETE'
      });
      notes.value = notes.value.filter(note => note.id !== id);
      toast.success('Note deleted successfully');
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to delete note');
      throw error;
    }
  };

  // Get a single note
  const getNote = async (id: string) => {
    try {
      const response = await $fetch<Note>(`/api/notes/${id}`);
      return {
        ...response,
        content: sanitizeContent(response.content)
      };
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to fetch note');
      throw error;
    }
  };

  return {
    notes,
    isLoading,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    getNote
  };
};