<template>
  <div class="bg-white rounded-lg w-full max-w-2xl mx-4">
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-4">{{ isEditing ? 'Edit Note' : 'New Note' }}</h2>
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            id="title"
            v-model="formData.title"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter note title"
          />
        </div>
        <div class="mb-6">
          <label for="content" class="block text-sm font-medium text-gray-700 mb-1">Content</label>
          <client-only>
            <div v-if="isMounted" class="relative" style="min-height: 300px;">
              <div ref="editorContainer" class="w-full"></div>
            </div>
            <textarea
              v-else
              id="content"
              v-model="formData.content"
              required
              rows="6"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Loading editor..."
            />
          </client-only>
        </div>
        <div class="flex justify-end space-x-3">
          <button
            type="button"
            @click="$emit('cancel')"
            class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition duration-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, defineProps, defineEmits, watch } from 'vue';
import type { Note } from '~/server/models/Note';
import createDOMPurify from 'isomorphic-dompurify';

// Initialize DOMPurify
const DOMPurify = createDOMPurify(window);

const props = defineProps<{
  note?: Note;
  isEditing?: boolean;
}>();

const emit = defineEmits<{
  (e: 'submit', data: { title: string; content: string }): void;
  (e: 'cancel'): void;
}>();

const isSubmitting = ref(false);
const isMounted = ref(false);
const editorContainer = ref<HTMLElement | null>(null);
const rteInstance = ref<any>(null);

const formData = ref({
  title: props.note?.title || '',
  content: props.note?.content || ''
});

// Watch for changes in the note prop
watch(() => props.note, (newNote) => {
  if (newNote) {
    formData.value.title = newNote.title;
    formData.value.content = newNote.content;
    
    // If editor is already initialized, set its content
    nextTick(() => {
      if (rteInstance.value && typeof rteInstance.value.setHTML === 'function') {
        rteInstance.value.setHTML(newNote.content || '');
      }
    });
  }
}, { immediate: true });

onMounted(async () => {
  isMounted.value = true;
  
  // Wait for DOM to be ready
  await nextTick();
  
  if (editorContainer.value) {
    // Initialize the rich text editor
    const RTE = (window as any).RichTextEditor;
    if (RTE) {
      rteInstance.value = new RTE(editorContainer.value, {
        toolbar: "full", // or "full" for all features
        value: formData.value.content || '', // Set initial content
        width: '100%',
        height: 300
      });
    }
  }
});

onUnmounted(() => {
  if (rteInstance.value) {
    try {
      // Try different cleanup methods that might be available
      if (typeof rteInstance.value.destroy === 'function') {
        rteInstance.value.destroy();
      } else if (typeof rteInstance.value.dispose === 'function') {
        rteInstance.value.dispose();
      } else {
        // Manual cleanup if no built-in method exists
        if (editorContainer.value) {
          editorContainer.value.innerHTML = '';
        }
        rteInstance.value = null;
      }
    } catch (error) {
      console.warn('Error cleaning up RTE instance:', error);
    }
  }
});

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;
    let content = formData.value.content;
    
    if (rteInstance.value) {
      // Get HTML content from editor and sanitize it
      content = DOMPurify.sanitize(rteInstance.value.getHTML(), {
        ALLOWED_TAGS: [
          'p', 'br', 'b', 'i', 'u', 'strong', 'em', 
          'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
          'ul', 'ol', 'li', 'blockquote', 'a', 'img'
        ],
        ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'target']
      });
    }
    
    emit('submit', {
      title: formData.value.title,
      content: content
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style>
.rte-content {
  min-height: 200px;
}

.rte-toolbar {
  border-radius: 0.375rem 0.375rem 0 0;
  border-color: #D1D5DB;
}

.rte-editor {
  border-radius: 0 0 0.375rem 0.375rem;
  border-color: #D1D5DB;
}
</style>