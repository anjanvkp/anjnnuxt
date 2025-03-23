<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Page Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">My Notes</h1>
      <button @click="showNoteModal = true" 
              class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow transition duration-300">
        <span class="flex items-center">
          <Icon name="heroicons:plus" class="w-5 h-5 mr-2" />
          New Note
        </span>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>

    <!-- Notes Grid -->
    <div v-else-if="notes.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="note in notes" :key="note.id" 
           class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200">
        <div class="p-4">
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-lg font-semibold text-gray-800">{{ note.title }}</h3>
            <div class="flex space-x-2">
              <button @click="editNote(note)" 
                      class="text-blue-500 hover:text-blue-600">
                <Icon name="heroicons:pencil-square" class="w-5 h-5" />
              </button>
              <button @click="confirmDelete(note)" 
                      class="text-red-500 hover:text-red-600">
                <Icon name="heroicons:trash" class="w-5 h-5" />
              </button>
            </div>
          </div>
          <div class="prose max-w-none" v-html="note.content"></div>
          <div class="mt-4 flex justify-between items-center">
            <div class="text-sm text-gray-500">
              Last updated: {{ formatDate(note.updatedAt || note.createdAt) }}
            </div>
            <button v-if="isContentTruncated(note.content)" 
                    @click="editNote(note)"
                    class="text-sm text-blue-500 hover:text-blue-600">
              Read more
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-8">
      <div class="text-gray-500 mb-4">No notes yet</div>
      <button @click="showNoteModal = true" 
              class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow transition duration-300">
        Create your first note
      </button>
    </div>

    <!-- Note Modal -->
    <div v-if="showNoteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <NoteForm
        :note="currentNote"
        :is-editing="!!currentNote"
        @submit="handleSubmit"
        @cancel="closeModal"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useNotes } from '~/composables/useNotes';
import type { Note } from '~/server/models/Note';
import createDOMPurify from 'isomorphic-dompurify';

definePageMeta({
  requiresAuth: true,
});

// Initialize DOMPurify
const DOMPurify = createDOMPurify(window);

// State
const showNoteModal = ref(false);
const currentNote = ref<Note | undefined>();
const { notes, isLoading, fetchNotes, createNote, updateNote, deleteNote } = useNotes();

// Fetch notes on component mount
onMounted(async () => {
  await fetchNotes();
  
  // Sanitize existing notes content
  notes.value = notes.value.map(note => ({
    ...note,
    content: DOMPurify.sanitize(note.content, {
      ALLOWED_TAGS: [
        'p', 'br', 'b', 'i', 'u', 'strong', 'em', 
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li', 'blockquote', 'a', 'img'
      ],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'target']
    })
  }));
});

// Actions
const editNote = (note: Note) => {
  currentNote.value = note;
  showNoteModal.value = true;
};

const closeModal = () => {
  showNoteModal.value = false;
  currentNote.value = undefined;
};

const handleSubmit = async (data: { title: string; content: string }) => {
  try {
    if (currentNote.value) {
      await updateNote(currentNote.value.id!, data);
    } else {
      await createNote(data);
    }
    closeModal();
  } catch (error) {
    console.error('Error saving note:', error);
  }
};

const confirmDelete = async (note: Note) => {
  if (!confirm('Are you sure you want to delete this note?')) return;
  
  try {
    await deleteNote(note.id!);
  } catch (error) {
    console.error('Error deleting note:', error);
  }
};

// Utilities
const isContentTruncated = (content: string) => {
  return content.split('\n').length > 3 || content.length > 200;
};

const formatDate = (ts) => {
    let date;

// If ts is a Firestore Timestamp instance with a toDate method
if (ts && typeof ts.toDate === "function") {
  date = ts.toDate();
}
// Else if it's an object with _seconds and _nanoseconds properties
else if (
  ts &&
  typeof ts._seconds === "number" &&
  typeof ts._nanoseconds === "number"
) {
  // Convert seconds and nanoseconds to milliseconds.
  date = new Date(ts._seconds * 1000 + ts._nanoseconds / 1000000);
}
// Otherwise, try to make a new Date from the value directly
else {
  date = new Date(ts);
}

// Check if the date is valid.
if (isNaN(date.getTime())) {
  return "Invalid Date";
}

// Format the date as DD-MM-YYYY
const day = String(date.getDate()).padStart(2, "0");
const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed.
const year = date.getFullYear();

return `${day}-${month}-${year}`;
};
</script>

<style>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  max-height: 4.5em; /* Fallback for non-webkit browsers */
}

/* Add Tailwind Typography styles for rendered HTML content */
.prose {
  max-width: 100%;
}

.prose img {
  max-width: 100%;
  height: auto;
  border-radius: 0.375rem;
}

.prose a {
  color: #2563eb;
  text-decoration: underline;
}

.prose a:hover {
  color: #1d4ed8;
}
</style>