<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Wages Report</h1>

    <!-- Filter Section -->
    <div class="bg-white p-4 rounded-lg shadow mb-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="flex justify-between items-center col-span-full mb-4">
          <div class="flex space-x-4">
            <button
              @click="exportToExcel"
              class="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              <DocumentArrowDownIcon class="w-5 h-5 mr-2" />
              Generate PF ESIC Report
            </button>
            <button
              @click="generateBankStatement"
              class="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              <DocumentArrowDownIcon class="w-5 h-5 mr-2" />
              Generate Bank Statement
            </button>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Month</label>
          <input
            type="month"
            v-model="selectedMonth"
            :max="new Date().toISOString().slice(0, 7)"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            @change="loadWages"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Cheque No</label>
          <select
            v-model="chequeFilter"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">All</option>
            <option v-for="cheque in uniqueChequeNumbers" :key="cheque" :value="cheque">
              {{ cheque }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Employee Name</label>
          <input
            type="text"
            v-model="employeeFilter"
            placeholder="Filter by name"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Project</label>
          <input
            type="text"
            v-model="projectFilter"
            placeholder="Filter by project"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>

    <!-- Summary Section -->
    <div class="bg-white p-4 rounded-lg shadow mb-4">
      <h2 class="text-xl font-semibold mb-2">Summary</h2>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="p-3 bg-blue-50 rounded">
          <div class="text-sm text-gray-600">Total Employees</div>
          <div class="text-xl font-bold">{{ filteredWages.length }}</div>
        </div>
        <div class="p-3 bg-green-50 rounded">
          <div class="text-sm text-gray-600">Total Gross Salary</div>
          <div class="text-xl font-bold">₹{{ totalGrossSalary.toLocaleString() }}</div>
        </div>
        <div class="p-3 bg-red-50 rounded">
          <div class="text-sm text-gray-600">Total Deductions</div>
          <div class="text-xl font-bold">₹{{ totalDeductions.toLocaleString() }}</div>
        </div>
        <div class="p-3 bg-purple-50 rounded">
          <div class="text-sm text-gray-600">Total Net Salary</div>
          <div class="text-xl font-bold">₹{{ totalNetSalary.toLocaleString() }}</div>
        </div>
      </div>
    </div>

    <!-- Wages Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Site</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Per Day</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Gross</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Deductions</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Benefits</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Net</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Date</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="wage in filteredWages" :key="wage._id">
              <td class="px-6 py-4 whitespace-nowrap">{{ wage.employeeName }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ wage.project }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ wage.site }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right">{{ wage.wage_Days }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right">₹{{ wage.pDayWage }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right">₹{{ wage.gross_salary.toLocaleString() }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-red-600">
                ₹{{ (wage.epf_deduction + wage.esic_deduction + wage.other_deduction).toLocaleString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-green-600">
                ₹{{ wage.other_benefit.toLocaleString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right font-medium">
                ₹{{ wage.net_salary.toLocaleString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right">{{ new Date(wage.paid_date).toLocaleDateString() }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { DocumentArrowDownIcon } from '@heroicons/vue/24/outline'
import ExcelJS from 'exceljs'

const selectedMonth = ref(new Date().toISOString().slice(0, 7))
const employeeFilter = ref('')
const projectFilter = ref('')
const chequeFilter = ref('')
const wages = ref([])

// Get unique cheque numbers
const uniqueChequeNumbers = computed(() => {
  const chequeNos = wages.value.map(wage => wage.cheque_no).filter(Boolean)
  return [...new Set(chequeNos)].sort()
})

// Filter wages based on search criteria
const filteredWages = computed(() => {
  return wages.value.filter(wage => {
    const nameMatch = wage.employeeName.toLowerCase().includes(employeeFilter.value.toLowerCase())
    const projectMatch = wage.project.toLowerCase().includes(projectFilter.value.toLowerCase())
    const chequeMatch = !chequeFilter.value || wage.cheque_no === chequeFilter.value
    return nameMatch && projectMatch && chequeMatch
  })
})

// Load wages data
const loadWages = async () => {
  try {
    const token = useCookie('token').value
    const { data } = await useFetch('/api/wages', {
      headers: { Authorization: `Bearer ${token}` },
      params: { month: selectedMonth.value }
    })

    if (data.value?.success) {
      wages.value = data.value.wages
      console.log(data.value.wages)
    } else {
      console.error('Error loading wages:', data.value?.message)
    }
  } catch (error) {
    console.error('Error loading wages:', error)
  }
}

// Calculate summary values
const totalGrossSalary = computed(() => {
  return filteredWages.value.reduce((sum, wage) => sum + wage.gross_salary, 0)
})

const totalDeductions = computed(() => {
  return filteredWages.value.reduce((sum, wage) => {
    return sum + wage.epf_deduction + wage.esic_deduction + wage.other_deduction
  }, 0)
})

const totalNetSalary = computed(() => {
  return filteredWages.value.reduce((sum, wage) => sum + wage.net_salary, 0)
})

// Load wages on component mount
onMounted(() => {
  loadWages()
})

const exportToExcel = async () => {
  try {
    const token = useCookie('token').value
    
    // Format month to 'MonthName-YYYY'
    const [year, month] = selectedMonth.value.split('-')
    const formattedMonth = new Date(year, month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).replace(' ', '-')

    const response = await $fetch('/api/wages/export', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: {
        month: selectedMonth.value
      },
      responseType: 'blob'
    })

    // Create a URL for the blob
    const url = window.URL.createObjectURL(new Blob([response]))

    // Create a temporary link and trigger download
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `wages-report-${selectedMonth.value}.xlsx`)
    document.body.appendChild(link)
    link.click()

    // Clean up
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error exporting to Excel:', error)
  }
}

const generateBankStatement = async () => {
  try {
    // Validate cheque number selection
    if (!chequeFilter.value) {
      alert('Please select a cheque number to generate bank statement')
      return
    }

    const token = useCookie('token').value
    
    // Call the bank-statement API endpoint
    const response = await $fetch('/api/wages/bank-statement', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: {
        month: selectedMonth.value,
        chequeNo: chequeFilter.value
      },
      responseType: 'blob'
    })

    // Create a URL for the blob
    const url = window.URL.createObjectURL(new Blob([response]))

    // Create a temporary link and trigger download
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `bank-statement-${chequeFilter.value}-${selectedMonth.value}.xlsx`)
    document.body.appendChild(link)
    link.click()

    // Clean up
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error generating bank statement:', error)
    alert('Error generating bank statement. Please check console for details.')
  }
}
</script>