<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg w-11/12 max-w-6xl max-h-[90vh] overflow-hidden">
      <div class="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 class="text-xl font-semibold">All NSE Records</h2>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
          <Icon name="heroicons:x-mark" class="w-6 h-6" />
        </button>
      </div>
      
      <div class="p-4 overflow-auto max-h-[calc(90vh-8rem)]">
        <div v-if="loading" class="flex justify-center items-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-red-700"></div>
        </div>
        
        <div v-else-if="error" class="text-red-600 text-center py-4">
          {{ error }}
        </div>
        
        <div v-else>
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th v-for="header in tableHeaders" :key="header.key"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ header.label }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="record in records" :key="record._id" class="hover:bg-gray-50">
                <td v-for="header in tableHeaders" :key="header.key" class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ record[header.key] }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const records = ref<any[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const tableHeaders = [
  { key: 'SYMBOL', label: 'Symbol' },
  { key: 'SERIES', label: 'Series' },
  { key: 'DATE1', label: 'Date' },
  { key: 'PREV_CLOSE', label: 'Prev Close' },
  { key: 'OPEN_PRICE', label: 'Open' },
  { key: 'HIGH_PRICE', label: 'High' },
  { key: 'LOW_PRICE', label: 'Low' },
  { key: 'LAST_PRICE', label: 'Last' },
  { key: 'CLOSE_PRICE', label: 'Close' },
  { key: 'AVG_PRICE', label: 'Avg' },
  { key: 'TTL_TRD_QNTY', label: 'Volume' },
  { key: 'TURNOVER_LACS', label: 'Turnover' },
  { key: 'NO_OF_TRADES', label: 'Trades' },
  { key: 'DELIV_QTY', label: 'Delivery Qty' },
  { key: 'DELIV_PER', label: 'Delivery %' }
]

const fetchRecords = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await fetch('/api/nse/all-records')
    const data = await response.json()
    records.value = data
  } catch (err: any) {
    error.value = err.message || 'Failed to fetch records'
  } finally {
    loading.value = false
  }
}

watch(() => props.show, (newVal) => {
  if (newVal) {
    fetchRecords()
  }
})
</script>