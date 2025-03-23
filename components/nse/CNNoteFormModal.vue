<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[85vh] overflow-hidden">
      <!-- Modal Header -->
      <div class="bg-gradient-to-r from-red-700 to-red-900 p-4 text-white flex justify-between items-center">
        <h2 class="text-xl font-bold">{{ isEdit ? 'Edit CN Note Details' : 'Create CN Note Details' }}</h2>
        <button @click="close" class="text-white hover:text-gray-200">
          <Icon name="heroicons:x-mark" class="w-6 h-6" />
        </button>
      </div>

      <!-- Modal Body -->
      <div class="p-6 overflow-y-auto max-h-[calc(85vh-8rem)]">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">CN Number</label>
              <input
                v-model="formData.cn_no"
                type="text"
                required
                class="w-full p-2 border rounded focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">CN Date</label>
              <input
                v-model="formData.cn_date"
                type="date"
                required
                class="w-full p-2 border rounded focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Broker</label>
              <input
                v-model="formData.broker"
                type="text"
                required
                class="w-full p-2 border rounded focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Type</label>
              <select
                v-model="formData.type"
                required
                class="w-full p-2 border rounded focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Select Type</option>
                <option value="BUY">BUY</option>
                <option value="SELL">SELL</option>
              </select>
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Folio</label>
              <input
                v-model="formData.folio"
                type="text"
                required
                class="w-full p-2 border rounded focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Other Charges</label>
              <input
                v-model.number="formData.oth_chg"
                type="number"
                step="0.01"
                class="w-full p-2 border rounded focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>

          <!-- Records Table -->
          <div class="mt-6">
            <h3 class="text-lg font-semibold mb-4">Folio Records</h3>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Symbol</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Brokerage</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Amount</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(record, index) in recordsData" :key="index">
                    <td class="px-6 py-4">
                      <input
                        v-model="record.symbol"
                        type="text"
                        class="w-full p-1 border rounded"
                      />
                    </td>
                    <td class="px-6 py-4">
                      <input
                        v-model.number="record.price"
                        type="number"
                        step="0.01"
                        class="w-full p-1 border rounded"
                        @input="calculateAmount(record)"
                      />
                    </td>
                    <td class="px-6 py-4">
                      <input
                        v-model.number="record.qnty"
                        type="number"
                        class="w-full p-1 border rounded"
                        @input="calculateAmount(record)"
                      />
                    </td>
                    <td class="px-6 py-4">
                      <input
                        v-model.number="record.amt"
                        type="number"
                        step="0.01"
                        class="w-full p-1 border rounded"
                        readonly
                      />
                    </td>
                    <td class="px-6 py-4">
                      <input
                        v-model.number="record.brokerage"
                        type="number"
                        step="0.01"
                        class="w-full p-1 border rounded"
                        @input="calculateNetAmount(record)"
                      />
                    </td>
                    <td class="px-6 py-4">
                      <input
                        v-model.number="record.namt"
                        type="number"
                        step="0.01"
                        class="w-full p-1 border rounded"
                        readonly
                      />
                    </td>
                    <td class="px-6 py-4">
                      <button
                        type="button"
                        @click="removeRecord(index)"
                        class="text-red-600 hover:text-red-800"
                      >
                        <Icon name="heroicons:trash" class="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <button
              type="button"
              @click="addRecord"
              class="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Add Record
            </button>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end mt-6">
            <button
              type="submit"
              class="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? 'Saving...' : (isEdit ? 'Update' : 'Save') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watchEffect } from 'vue'

const props = defineProps<{
  show: boolean
  isEdit: boolean
  initialData?: any
}>()

const emit = defineEmits(['close', 'submit'])

const formData = ref({
  id: '',
  cn_no: '',
  cn_date: '',
  broker: '',
  type: '',
  folio: '',
  oth_chg: 0,
  famt: 0
})

const recordsData = ref<any[]>([])
const isSubmitting = ref(false)

// Initialize form data if editing
watchEffect(() => {
  if (props.initialData && props.isEdit) {
    formData.value = { ...props.initialData }
    recordsData.value = props.initialData.records || []
  } else {
    resetForm()
  }
})

function resetForm() {
  formData.value = {
    id: '',
    cn_no: '',
    cn_date: '',
    broker: '',
    type: '',
    folio: '',
    oth_chg: 0,
    famt: 0
  }
  recordsData.value = []
}

function calculateAmount(record: any) {
  if (record.price && record.qnty) {
    record.amt = Number((record.price * record.qnty).toFixed(2))
    calculateNetAmount(record)
  }
}

function calculateNetAmount(record: any) {
  if (record.amt) {
    record.namt = Number((record.amt + (record.brokerage || 0)).toFixed(2))
    updateTotalAmount()
  }
}

function updateTotalAmount() {
  formData.value.famt = recordsData.value.reduce(
    (sum, record) => sum + (record.namt || 0),
    0
  )
}

function addRecord() {
  recordsData.value.push({
    symbol: '',
    price: 0,
    qnty: 0,
    amt: 0,
    brokerage: 0,
    namt: 0
  })
}

function removeRecord(index: number) {
  recordsData.value.splice(index, 1)
  updateTotalAmount()
}

async function handleSubmit() {
  try {
    isSubmitting.value = true
    const payload = {
      formData: { ...formData.value },
      recordsData: [...recordsData.value]
    }
    emit('submit', payload)
  } catch (error) {
    console.error('Error submitting form:', error)
  } finally {
    isSubmitting.value = false
  }
}

function close() {
  emit('close')
  resetForm()
}
</script>