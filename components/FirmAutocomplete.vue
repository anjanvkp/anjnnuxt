<template>
  <div class="relative">
    <input
      v-model="searchTerm"
      type="text"
      class="w-full px-4 py-2 bg-white/25 backdrop-blur-md rounded-xl border-2 border-white/40 text-white placeholder-white/60 focus:ring-2 focus:ring-white/60 focus:outline-none text-base transition-all duration-300 h-10"
      :placeholder="placeholder"
      @input="searchFirms"
      @focus="showResults = true"
      @blur="handleBlur"
      required
    >
    <div v-if="showResults" class="absolute z-10 w-full mt-1 bg-white/20 backdrop-blur-md border-2 border-black/40 rounded-xl shadow-lg max-h-60 overflow-y-auto">
      <!-- Filtered Firms -->
      <div v-if="filteredFirms.length > 0">
        <div
          v-for="firm in filteredFirms"
          :key="firm._id"
          class="p-2 hover:bg-gray-100 cursor-pointer text-red-500"
          @mousedown="selectFirm(firm)"
        >
          <div class="font-medium">{{ firm.name }}</div>
          <div class="text-sm text-gray-600">Code: {{ firm.code }}</div>
        </div>
        <!-- Create New Firm Option After Results -->
        <div class="border-t">
          <div class="p-2 hover:bg-gray-100 cursor-pointer text-indigo-600 font-medium" @mousedown="openCreateFirmModal">
            + Create new firm "{{ searchTerm }}"
          </div>
        </div>
      </div>
      <!-- No Results Case -->
      <div v-else>
        <div class="p-2 text-gray-600">No firms found</div>
        <div class="p-2 hover:bg-gray-100 cursor-pointer text-indigo-600 font-medium" @mousedown="openCreateFirmModal">
          + Create new firm "{{ searchTerm }}"
        </div>
      </div>
    </div>
    
    <!-- Create Firm Modal -->
    <div v-if="showCreateFirmModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-4 w-full max-w-md mx-auto" @click.stop>
        <h2 class="text-xl font-bold mb-4">Create New Firm</h2>
        <form @submit.prevent="createFirm" class="grid grid-cols-2 gap-x-4 gap-y-1">
          <div>
            <label class="block text-base font-medium text-gray-700 mb-1">Firm Name</label>
            <textarea v-model="newFirm.name" class="border-2 border-gray-300 rounded w-full p-2 text-black min-h-[12px] max-h[12px] resize-none" required rows="1"></textarea>
          </div>
          <div class="mb-2">
            <label class="block mb-1">Firm Code</label>
            <textarea v-model="newFirm.code" class="border-2 border-gray-300 rounded w-full p-2 text-black min-h-[12px] max-h[12px] resize-none" required rows="1"></textarea>
          </div>
          <div class="mb-2">
            <label class="block mb-1">Business Type</label>
            <textarea v-model="newFirm.businessType" class="border-2 border-gray-300 rounded w-full p-2 text-black min-h-[12px] max-h[12px] resize-none" required rows="1"></textarea>
          </div>
          <div class="mb-2">
            <label class="block mb-1">Address</label>
            <textarea v-model="newFirm.address" class="border-2 border-gray-300 rounded w-full p-2 text-black min-h-[12px] max-h[12px] resize-none" required rows="1"></textarea>
          </div>
          <div class="mb-2">
            <label class="block mb-1">Contact Person</label>
            <textarea v-model="newFirm.contactPerson" class="border-2 border-gray-300 rounded w-full p-2 text-black min-h-[12px] max-h[12px] resize-none" required rows="1"></textarea>
          </div>
          <div class="mb-2">
            <label class="block mb-1">Contact Number</label>
            <textarea v-model="newFirm.contactNo" class="border-2 border-gray-300 rounded w-full p-2 text-black min-h-[12px] max-h[12px] resize-none" required rows="1"></textarea>
          </div>
          <div class="mb-2">
            <label class="block mb-1">Email</label>
            <textarea v-model="newFirm.email" class="border-2 border-gray-300 rounded w-full p-2 text-black min-h-[12px] max-h[12px] resize-none" required rows="1"></textarea>
          </div>
          <div class="mb-2">
            <label class="block mb-1">GST Number</label>
            <textarea v-model="newFirm.gstNo" class="border-2 border-gray-300 rounded w-full p-2 text-black min-h-[12px] max-h[12px] resize-none" required rows="1"></textarea>
          </div>
          <div class="mb-2">
            <label class="block mb-1">Description (Optional)</label>
            <textarea v-model="newFirm.description" class="border-2 border-gray-300 rounded w-full p-2 text-black min-h-[12px] max-h[12px] resize-none" rows="1"></textarea>
          </div>
          <div class="col-span-2 text-sm text-gray-600 mb-2">
            Note: New firms require admin approval before they can be used for registration.
          </div>
          <div class="col-span-2 flex justify-end space-x-2">
            <button type="button" @click="showCreateFirmModal = false" class="px-4 py-2 bg-red-300 text-white rounded hover:bg-red-400">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Create Firm</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue';

interface Firm {
  _id: string;
  name: string;
  code: string;
  description?: string;
}

const props = defineProps({
  label: {
    type: String,
    default: 'Firm'
  },
  placeholder: {
    type: String,
    default: 'Search for a firm...'
  },
  selectedFirmId: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:selectedFirm']);

const searchTerm = ref('');
const firms = ref<Firm[]>([]);
const filteredFirms = ref<Firm[]>([]);
const showResults = ref(false);
const selectedFirm = ref<Firm | null>(null);
const showCreateFirmModal = ref(false);
const newFirm = reactive({
  name: '',
  code: '',
  description: '',
  address: '',
  contactPerson: '',
  contactNo: '',
  email: '',
  gstNo: '',
  businessType: ''
});

// Success/error messages for firm creation
const firmCreationMessage = ref('');
const firmCreationError = ref('');

// Load initial firms
async function loadFirms() {
  try {
    const response = await $fetch('/api/firms');
    firms.value = response as Firm[];
  } catch (error) {
    console.error('Error loading firms:', error);
  }
}

// Search firms based on input
async function searchFirms() {
  if (!searchTerm.value) {
    filteredFirms.value = [];
    return;
  }
  
  try {
    const response = await $fetch(`/api/firms?search=${encodeURIComponent(searchTerm.value)}`);
    filteredFirms.value = response as Firm[];
  } catch (error) {
    console.error('Error searching firms:', error);
  }
}

// Select a firm from the dropdown
function selectFirm(firm: Firm) {
  selectedFirm.value = firm;
  searchTerm.value = firm.name;
  showResults.value = false;
  emit('update:selectedFirm', firm);
}

// Handle input blur
function handleBlur() {
  // Delay hiding results to allow for click events
  setTimeout(() => {
    showResults.value = false;
    
    // If no firm was selected but there's text, reset
    if (!selectedFirm.value && searchTerm.value) {
      searchTerm.value = '';
      emit('update:selectedFirm', null);
    }
  }, 200);
}

// Watch for external changes to selectedFirmId
watch(() => props.selectedFirmId, async (newId) => {
  if (newId && (!selectedFirm.value || selectedFirm.value._id !== newId)) {
    try {
      const firm = await $fetch(`/api/firms/${newId}`);
      if (firm) {
        selectedFirm.value = firm as Firm;
        searchTerm.value = (firm as Firm).name;
      }
    } catch (error) {
      console.error('Error fetching firm details:', error);
    }
  }
}, { immediate: true });

// Open the create firm modal
function openCreateFirmModal() {
  newFirm.name = searchTerm.value;
  newFirm.code = '';
  newFirm.description = '';
  showCreateFirmModal.value = true;
}

// Create a new firm
async function createFirm() {
  firmCreationMessage.value = '';
  firmCreationError.value = '';
  
  try {
    const response:any = await $fetch('/api/firms', {
      method: 'POST',
      body: newFirm
    });
    
    showCreateFirmModal.value = false;
    
    // Show success message
    firmCreationMessage.value = response.message;
    
    // Since all new firms require approval, show the pending message
    alert('Your firm has been created and is pending admin approval. Please check back later or contact an administrator.');
    
    // Clear the search term and close the modal
    searchTerm.value = '';
    emit('update:selectedFirm', null);
    
    // Refresh the firms list
    await loadFirms();
  } catch (error: any) {
    firmCreationError.value = error.data?.statusMessage || 'Error creating firm';
  }
}

// Load initial firms on component mount
onMounted(() => {
  loadFirms();
});
</script>