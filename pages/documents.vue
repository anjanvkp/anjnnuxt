<template>
  <div class="container mx-auto px-4 py-12">
    <!-- Hero Section -->
    <div
      class="bg-gradient-to-br from-emerald-500 to-teal-600 py-12 px-6 rounded-2xl shadow-xl mb-12 relative overflow-hidden">
      <div class="absolute inset-0 bg-pattern opacity-10"></div>
      <div class="max-w-3xl mx-auto text-center relative z-10">
        <h1 class="text-4xl font-extrabold text-white sm:text-5xl tracking-tight">
          Document Management
        </h1>
        <p class="mt-4 text-xl text-teal-50 max-w-2xl mx-auto">
          Manage your important documents and track their validity
        </p>
      </div>
    </div>

    <!-- Document Management Interface -->
    <div class="bg-white rounded-xl shadow-md p-6 mb-8">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-slate-800">Your Documents</h2>
        <div class="flex gap-4">
          <button @click="triggerNotifications"
            class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            Send Notifications
          </button>
          <button @click="() => showAddDocumentModal = true"
            class="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors duration-300 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Document
          </button>
          <button @click="downloadDocuments"
            class="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-300 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 16v-8m0 8l-4-4m4 4l4-4M4 20h16" />
            </svg>
            Download Documents
          </button>
        </div>
      </div>

      <!-- Warning Banner for Expiring Documents -->
      <div v-if="expiringDocuments.length > 0" class="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-amber-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
              fill="currentColor">
              <path fill-rule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-amber-700">
              <span class="font-medium">Warning:</span> You have {{ expiringDocuments.length }} document(s) expiring
              soon.
            </p>
          </div>
        </div>
      </div>

      <!-- Document List -->
      <div v-if="isLoading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>

      <div v-else-if="documents.length === 0" class="text-center py-12 bg-gray-50 rounded-lg">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No documents</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by adding a new document.</p>
        <div class="mt-6">
          <button @click="showAddDocumentModal = true"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
            <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Document
          </button>
        </div>
      </div>

      <div v-else>
        <!-- Table Controls -->
        <div class="flex flex-col md:flex-row justify-between items-center mb-4 space-y-2 md:space-y-0">
          <div class="w-full md:w-64">
            <input v-model="searchQuery" type="text" placeholder="Search documents..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500" />
          </div>
          <div class="flex space-x-2">
            <select v-model="sortBy"
              class="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500">
              <option value="name">Sort by Name</option>
              <option value="ref_no">Sort by Reference</option>
              <option value="expiryDate">Sort by Expiry Date</option>
              <option value="startDate">Sort by Start Date</option>
              <option value="value">Sort by Value</option>
            </select>
            <button @click="sortDirection = sortDirection === 'asc' ? 'desc' : 'asc'"
              class="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 bg-white">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500"
                :class="{ 'transform rotate-180': sortDirection === 'desc' }" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Documents Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document Name
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference Number
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Date
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expiry Date
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="doc in filteredAndSortedDocuments" :key="doc.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ doc.name }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ doc.ref_no }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-500 truncate max-w-xs">{{ doc.description || 'N/A' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ formatDate(doc.startDate) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ formatDate(doc.expiryDate) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ doc.value ? formatCurrency(doc.value) : 'N/A' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="{
                    'bg-red-100 text-red-800': isExpired(doc),
                    'bg-amber-100 text-amber-800': isExpiringSoon(doc),
                    'bg-green-100 text-green-800': !isExpiringSoon(doc) && !isExpired(doc)
                  }" class="px-2 py-1 text-xs rounded-full">
                    {{ getExpiryStatus(doc) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button @click="editDocument(doc)" class="text-blue-600 hover:text-blue-800 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button @click="confirmDeleteDocument(doc)" class="text-red-600 hover:text-red-800">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Controls -->
        <div class="flex justify-between items-center mt-4">
          <div class="text-sm text-gray-700">
            Showing <span class="font-medium">{{ paginationStart }}</span> to <span class="font-medium">{{ paginationEnd
            }}</span> of <span class="font-medium">{{ documents.length }}</span> documents
          </div>
          <div class="flex space-x-2">
            <button @click="currentPage--" :disabled="currentPage === 1"
              :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
              class="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button @click="currentPage++" :disabled="currentPage >= totalPages"
              :class="{ 'opacity-50 cursor-not-allowed': currentPage >= totalPages }"
              class="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showAddDocumentModal || showEditDocumentModal"
      class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div
          class="px-6 py-4 bg-gradient-to-r from-green-400 via-blue-500 to-green-400 text-white flex justify-between items-center">
          <h3 class="text-lg font-medium">
            {{ showEditDocumentModal ? 'Edit Document' : 'Add New Document' }}
          </h3>
          <button @click="cancelDocumentForm" class="text-white hover:text-gray-200 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="showEditDocumentModal ? updateDocument() : addDocument()">
          <div class="px-6 py-4">
            <!-- Responsive two-column grid: 1 column on small screens, 2 columns on medium+ screens -->
            <!-- Document Name -->
            <div class="mb-4">
              <label for="documentName" class="block text-sm font-medium text-gray-700 mb-1">
                Document Name*
              </label>
              <input id="documentName" v-model="documentForm.name" type="text" required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <!-- Reference Number -->
            <div class="mb-4">
              <label for="ref_no" class="block text-sm font-medium text-gray-700 mb-1">
                Reference Number*
              </label>
              <input id="ref_no" v-model="documentForm.ref_no" type="text" required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <!-- Description -->
            <div class="mb-4">
              <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea id="description" v-model="documentForm.description" rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div>
                <!-- Start Date -->
                <div class="mb-4">
                  <label for="startDate" class="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input id="startDate" v-model="documentForm.startDate" type="date"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <!-- Closed Date -->
                <div class="mb-4">
                  <label for="closedDate" class="block text-sm font-medium text-gray-700 mb-1">
                    Closed Date
                  </label>
                  <input id="closedDate" v-model="documentForm.closedDate" type="date"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>
              <div>
                <!-- Original Expiry Date -->
                <div class="mb-4">
                  <label for="oExpiryDate" class="block text-sm font-medium text-gray-700 mb-1">
                    Original Expiry Date*
                  </label>
                  <input id="oExpiryDate" v-model="documentForm.oExpiryDate" type="date" required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <!-- Expiry Date -->
                <div class="mb-4">
                  <label for="expiryDate" class="block text-sm font-medium text-gray-700 mb-1">
                    Extended Expiry Date*
                  </label>
                  <input id="expiryDate" v-model="documentForm.expiryDate" type="date" required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div>
                <!-- Value -->
                <div class="mb-4">
                  <label for="value" class="block text-sm font-medium text-gray-700 mb-1">
                    Value
                  </label>
                  <input id="value" v-model="documentForm.value" type="number" step="0.01" min="0"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>
              <div>
                <!-- Status -->
                <div class="mb-4">
                  <label for="status" class="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select id="status" v-model="documentForm.status"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    <option value="" disabled>Select status</option>
                    <option value="OPEN">OPEN</option>
                    <option value="RUNNING">RUNNING</option>
                    <option value="CLOSED">CLOSED</option>
                    <option value="TERMINATED">TERMINATED</option>
                  </select>
                </div>
              </div>
            </div>
            <!-- File Upload -->
            <div class="mb-4">
              <label for="fileUpload" class="block text-sm font-medium text-gray-700 mb-1">
                File Upload
              </label>
              <input id="fileUpload" type="file" ref="fileInput" @change="handleFileUpload"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
              <p v-if="documentForm.file" class="mt-1 text-sm text-gray-500">
                Current file: <a :href="`${documentForm.file}`" target="_blank" class="text-blue-600 hover:text-blue-800 underline">{{ documentForm.file }}</a>
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 bg-gradient-to-r from-green-400 via-blue-500 to-green-400 flex justify-end space-x-3">
            <button type="button" @click="cancelDocumentForm"
              class="px-4 py-2 border rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-400 to-red-500 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
              Cancel
            </button>
            <button type="submit"
              class="px-4 py-2 border rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              {{ showEditDocumentModal ? 'Update' : 'Add' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal"
      class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Confirm Deletion</h3>
        </div>
        <div class="px-6 py-4">
          <p class="text-gray-700">Are you sure you want to delete this document? This action cannot be undone.</p>
          <div class="flex justify-end space-x-3 mt-6">
            <button @click="showDeleteModal = false"
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
              Cancel
            </button>
            <button @click="deleteDocument"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <Toast :message="toastMessage" :type="toastType" :show="showToast" @close="showToast = false" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import downloadExcel from '~/composables/downloadExcel';

definePageMeta({
  requiresAuth: true,
});

// Router
const router = useRouter()

// State
const documents = ref([])
const isLoading = ref(true)
const showAddDocumentModal = ref(false)
const showEditDocumentModal = ref(false)
const showDeleteModal = ref(false)
const documentToDelete = ref(null)
const documentToEdit = ref(null)
const searchQuery = ref('')
const sortBy = ref('name')
const sortDirection = ref('asc')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success')
const selectedFile = ref(null)
const fileInput = ref(null)

// Document form
const documentForm = ref({
  id: null,
  name: '',
  ref_no: '',
  description: '',
  startDate: '',
  expiryDate: '',
  oExpiryDate: '',
  closedDate: '',
  value: null,
  status: '',
  file: '',
})

// Computed properties
const filteredDocuments = computed(() => {
  if (!searchQuery.value) return documents.value

  const query = searchQuery.value.toLowerCase()
  return documents.value.filter(doc =>
    doc.name.toLowerCase().includes(query) ||
    doc.ref_no.toLowerCase().includes(query) ||
    (doc.description && doc.description.toLowerCase().includes(query))
  )
})

const sortedDocuments = computed(() => {
  const docs = [...filteredDocuments.value]

  return docs.sort((a, b) => {
    let aValue = a[sortBy.value]
    let bValue = b[sortBy.value]

    // Handle special cases for sorting
    if (sortBy.value === 'value') {
      aValue = aValue || 0
      bValue = bValue || 0
    } else if (sortBy.value === 'startDate' || sortBy.value === 'expiryDate') {
      aValue = aValue ? new Date(aValue).getTime() : 0
      bValue = bValue ? new Date(bValue).getTime() : 0
    } else {
      aValue = aValue ? aValue.toString().toLowerCase() : ''
      bValue = bValue ? bValue.toString().toLowerCase() : ''
    }

    if (sortDirection.value === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })
})

const filteredAndSortedDocuments = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value
  const endIndex = startIndex + itemsPerPage.value
  return sortedDocuments.value.slice(startIndex, endIndex)
})

const totalPages = computed(() => {
  return Math.ceil(filteredDocuments.value.length / itemsPerPage.value)
})

const paginationStart = computed(() => {
  return filteredDocuments.value.length === 0
    ? 0
    : (currentPage.value - 1) * itemsPerPage.value + 1
})

const paginationEnd = computed(() => {
  return Math.min(currentPage.value * itemsPerPage.value, filteredDocuments.value.length)
})

const expiringDocuments = computed(() => {
  const today = new Date()
  const thirtyDaysFromNow = new Date()
  thirtyDaysFromNow.setDate(today.getDate() + 30)

  return documents.value.filter(doc => {
    if (!doc.expiryDate) return false
    const expiryDate = new Date(doc.expiryDate)
    return expiryDate > today && expiryDate <= thirtyDaysFromNow
  })
})

// Watch for changes in filtered documents to reset pagination
watch(filteredDocuments, () => {
  currentPage.value = 1
})

// Methods
async function triggerNotifications() {
  try {
    const token = useCookie('token').value;
    const response = await fetch('/api/documents/sndmlnot', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      // Extract the error message from the server response
      const errorData = await response.json();
      const errorMessage = errorData.message || 'Failed to send notifications';
      throw new Error(errorMessage); // Explicitly throw the error
    }

    const responseData = await response.json(); // Parse the successful response
    showToastNotification(responseData.message || 'Notifications sent successfully', 'success');
  } catch (error) {
    console.error('Error sending notifications:', error);
    showToastNotification(error.message || 'Failed to send notifications', 'error');
  }
}

async function fetchDocuments() {
  isLoading.value = true

  try {
    const token = useCookie('token').value;
    const data = await $fetch('/api/documents', {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Map API response to match frontend field names
    if (data.documents) {
      documents.value = data.documents.map(doc => ({
        ...doc,
        ref_no: doc.ref_no,
      }));
    } else {
      documents.value = [];
    }
  } catch (error) {
    console.error('Error fetching documents:', error);
    showToastNotification('Failed to load documents', 'error');
  } finally {
    isLoading.value = false;
  }
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  
  // Check if file size exceeds 500KB (512000 bytes)
  if (file && file.size > 512000) {
    showToastNotification('File size exceeds maximum limit of 500KB. Please select a smaller file.', 'error');
    // Reset the file input
    event.target.value = '';
    return;
  }
  
  selectedFile.value = file;
}

function resetDocumentForm() {
  documentForm.value = {
    id: null,
    name: '',
    ref_no: '',
    description: '',
    startDate: '',
    expiryDate: '',
    oExpiryDate: '',
    closedDate: '',
    value: null,
    status: '',
    file: '',
  }
}

function cancelDocumentForm() {
  resetDocumentForm()
  showAddDocumentModal.value = false
  showEditDocumentModal.value = false
}

function editDocument(doc) {
  documentToEdit.value = doc
  documentForm.value = {
    id: doc._id,
    name: doc.name,
    ref_no: doc.ref_no,
    description: doc.description || '',
    startDate: doc.startDate ? doc.startDate.slice(0, 10) : '',
    expiryDate: doc.expiryDate ? doc.expiryDate.slice(0, 10) : '',
    oExpiryDate: doc.oExpiryDate ? doc.oExpiryDate.slice(0, 10) : '',
    closedDate: doc.closedDate ? doc.closedDate.slice(0, 10) : '',
    value: doc.value || null,
    status: doc.status,
    file: doc.file || null
  }
  showEditDocumentModal.value = true
}

function confirmDeleteDocument(doc) {
  documentToDelete.value = doc
  showDeleteModal.value = true
}

async function addDocument() {
  try {
    const token = useCookie('token').value;
    
    // First, upload the file if selected
    let fileUrl = null;
    if (selectedFile.value) {
      fileUrl = await uploadFile(selectedFile.value, token);
    }
    
    // Then create the document with the file URL
    const documentData = {
      ...documentForm.value,
      file: fileUrl
    };
    
    const response = await fetch('/api/documents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(documentData)
    });

    if (!response.ok) {
      throw new Error('Failed to add document');
    }

    // Add the new document to the array
    const newDocument = await response.json();
    documents.value.push(newDocument);

    showToastNotification('Document added successfully', 'success');
    cancelDocumentForm();
    // Refresh documents list
    await fetchDocuments();
  } catch (error) {
    console.error('Error adding document:', error);
    showToastNotification(error.message || 'Failed to add document', 'error');
  }
}

async function updateDocument() {
  try {
    const token = useCookie('token').value;
    
    // First, upload the file if a new one is selected
    let fileUrl = documentForm.value.file;
    if (selectedFile.value) {
      fileUrl = await uploadFile(selectedFile.value, token);
    }
    
    // Update document data with file URL
    const documentData = {
      ...documentForm.value,
      file: fileUrl
    };
    
    const response = await fetch(`/api/documents/${documentForm.value.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(documentData)
    });

    if (!response.ok) {
      throw new Error('Failed to update document');
    }

    const updatedDocument = await response.json();

    // Update the document in the array
    const index = documents.value.findIndex(doc => doc._id === updatedDocument._id);
    if (index !== -1) {
      documents.value[index] = updatedDocument;
    }

    showToastNotification('Document updated successfully', 'success');
    cancelDocumentForm();
  } catch (error) {
    console.error('Error updating document:', error);
    showToastNotification('Failed to update document', 'error');
  }
}

// Function to handle file uploads to Google Drive
async function uploadFile(file, token) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/documents/uplddoc', {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to upload file');
    }

    const responseData = await response.json();
    console.log('File upload response:', responseData);
    
    return responseData.fileName; // Return the file URL/name for storage
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

async function deleteDocument() {
  if (!documentToDelete.value) return
  const token = useCookie('token').value;
  try {
    const response = await fetch(`/api/documents/${documentToDelete.value._id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error('Failed to delete document')
    }

    // Remove the document from the array
    documents.value = documents.value.filter(doc => doc._id !== documentToDelete.value._id)

    showToastNotification('Document deleted successfully', 'success')
    showDeleteModal.value = false
    documentToDelete.value = null
  } catch (error) {
    console.error('Error deleting document:', error)
    showToastNotification('Failed to delete document', 'error')
  }
}

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'INR'
  }).format(value)
}

function isExpired(doc) {
  if (!doc.expiryDate) return false
  return new Date(doc.expiryDate) < new Date()
}

function isExpiringSoon(doc) {
  if (!doc.expiryDate) return false

  const today = new Date()
  const expiryDate = new Date(doc.expiryDate)
  const thirtyDaysFromNow = new Date()
  thirtyDaysFromNow.setDate(today.getDate() + 30)

  return expiryDate > today && expiryDate <= thirtyDaysFromNow
}

function getExpiryStatus(doc) {
  if (isExpired(doc)) return 'Expired'
  if (isExpiringSoon(doc)) return 'Expiring Soon'
  return 'Valid'
}

function showToastNotification(message, type = 'success') {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true

  // Auto-hide toast after 5 seconds
  setTimeout(() => {
    showToast.value = false
  }, 5000)
}

const downloadDocuments = async () => {
  await downloadExcel();
};

onMounted(async () => {
  // Fetch documents
  await fetchDocuments()
  await triggerNotifications()
})
</script>

<style>
.bg-pattern {
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6z'%3E%3C/path%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}
</style>