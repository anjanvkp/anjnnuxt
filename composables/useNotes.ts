import { ref } from 'vue';
import type { Note, CreateNoteDto, UpdateNoteDto } from '~/server/models/Note';
import { useToast } from './useToast';

export const useNotes = () => {
  const notes = ref<Note[]>([]);
  const isLoading = ref(false);
  const toast = useToast();

  // Fetch all notes
  const fetchNotes = async () => {
    try {
      isLoading.value = true;
      const response = await $fetch<Note[]>('/api/notes');
      notes.value = response;
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
      const response = await $fetch<Note>('/api/notes', {
        method: 'POST',
        body: noteData
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
      await $fetch(`/api/notes/${id}`, {
        method: 'PUT',
        body: noteData
      });
      const index = notes.value.findIndex(note => note.id === id);
      if (index !== -1) {
        notes.value[index] = { ...notes.value[index], ...noteData };
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
      return response;
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