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
          <textarea
            id="content"
            v-model="formData.content"
            required
            rows="6"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter note content"
          ></textarea>
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
import { ref, defineProps, defineEmits } from 'vue';
import type { Note } from '~/server/models/Note';

const props = defineProps<{
  note?: Note;
  isEditing?: boolean;
}>();

const emit = defineEmits<{
  (e: 'submit', data: { title: string; content: string }): void;
  (e: 'cancel'): void;
}>();

const isSubmitting = ref(false);
const formData = ref({
  title: props.note?.title || '',
  content: props.note?.content || ''
});

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;
    emit('submit', {
      title: formData.value.title,
      content: formData.value.content
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>