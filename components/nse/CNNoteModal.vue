<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
      <!-- Modal Header -->
      <div class="bg-gradient-to-r from-red-600 to-black p-4 text-white flex justify-between items-center">
        <h2 class="text-xl font-bold">CN Notes</h2>
        <button @click="close" class="text-white hover:text-gray-200">
          <Icon name="heroicons:x-mark" class="w-6 h-6" />
        </button>
      </div>

      <!-- Modal Body -->
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
        <!-- All CN Notes Table -->
        <div class="mb-8">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">All CN Notes</h3>
            <button
              @click="showFormModal = true"
              class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Add New CN Note
            </button>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CN Number</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CN Date</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Broker</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Folio</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Other Charges</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Final Amount</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="note in cnNotes" :key="note.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4">{{ note.cn_no }}</td>
                  <td class="px-6 py-4">{{ note.cn_date }}</td>
                  <td class="px-6 py-4">{{ note.broker }}</td>
                  <td class="px-6 py-4">{{ note.type }}</td>
                  <td class="px-6 py-4">{{ note.folio }}</td>
                  <td class="px-6 py-4">{{ note.oth_chg }}</td>
                  <td class="px-6 py-4">{{ note.famt }}</td>
                  <td class="px-6 py-4">
                    <button @click="editNote(note)" class="text-blue-600 hover:text-blue-800 mr-2">
                      <Icon name="heroicons:pencil" class="w-5 h-5" />
                    </button>
                    <button @click="deleteNote(note.id)" class="text-red-600 hover:text-red-800">
                      <Icon name="heroicons:trash" class="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Nested Form Modal -->
  <CNNoteFormModal
    :show="showFormModal"
    :is-edit="!!selectedNote"
    :initial-data="selectedNote"
    @close="closeFormModal"
    @submit="handleFormSubmit"
  />
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
import CNNoteFormModal from './CNNoteFormModal.vue'
const props = defineProps<{
  show: boolean
  isEdit: boolean
  initialData?: any
  cnNotes?: any[]
}>()

const emit = defineEmits(['close', 'submit', 'edit', 'delete'])

const cnNotes = ref<any[]>(props.cnNotes || [])
const showFormModal = ref(false)
const selectedNote = ref(null)

function editNote(note: any) {
  selectedNote.value = note
  showFormModal.value = true
}

function deleteNote(id: string) {
  emit('delete', id)
}

function handleFormSubmit(payload: any) {
  emit('submit', payload)
  showFormModal.value = false
}

function closeFormModal() {
  showFormModal.value = false
  selectedNote.value = null
}

function close() {
  emit('close')
}
</script>