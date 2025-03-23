<template>
  <Teleport to="body">
    <div v-if="isVisible" class="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div 
        :class="[
          'max-w-md w-full mx-4 p-4 rounded-lg shadow-lg transform transition-all duration-300 pointer-events-auto',
          'flex items-center',
          type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
        ]"
        :style="{ opacity: opacity }"
      >
        <div class="flex-shrink-0 mr-4">
          <svg v-if="type === 'success'" class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <svg v-else class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div>
          <p class="font-medium">{{ message }}</p>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';

const emit = defineEmits(['close']);

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'success',
    validator: (value) => ['success', 'error'].includes(value)
  },
  duration: {
    type: Number,
    default: 3000
  },
  show: {
    type: Boolean,
    default: false
  }
});

const isVisible = ref(false);
const opacity = ref(0);
let timeoutId = null;

const showToast = () => {
  isVisible.value = true;
  // Fade in
  setTimeout(() => {
    opacity.value = 1;
  }, 10);

  // Set timeout to hide toast
  timeoutId = setTimeout(() => {
    // Fade out
    opacity.value = 0;
    setTimeout(() => {
      isVisible.value = false;
      emit('close');
    }, 300);
  }, props.duration);
};

const hideToast = () => {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  opacity.value = 0;
  setTimeout(() => {
    isVisible.value = false;
    emit('close');
  }, 300);
};

watch(() => props.show, (newVal) => {
  if (newVal) {
    showToast();
  } else {
    hideToast();
  }
});

onMounted(() => {
  if (props.show) {
    showToast();
  }
});

onUnmounted(() => {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
});
</script>