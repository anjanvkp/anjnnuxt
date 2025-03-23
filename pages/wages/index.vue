<template>
  <div class="max-w-full mx-auto py-6 px-4 sm:px-6 lg:px-8 min-h-screen">
    <div class="flex flex-col h-full">
      <!-- Header Section -->
      <div class="mb-6">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Wages Management</h1>
      </div>

      <!-- Controls Section -->
      <div class="bg-white p-4 rounded-lg shadow mb-6 overflow-x-auto">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Select Month</label>
            <input 
              type="month" 
              v-model="selectedMonth" 
              :max="new Date().toISOString().slice(0, 7)"
              class="w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              @change="loadEmployees"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
            <input 
              type="date" 
              v-model="paymentDetails.paid_date" 
              class="w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Cheque Number</label>
            <input 
              type="text" 
              v-model="paymentDetails.cheque_no" 
              class="w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter cheque number"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Paid From Bank Account</label>
            <input 
              type="text" 
              v-model="paymentDetails.paid_from_bank_ac" 
              class="w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter bank account"
            >
          </div>
          <div class="flex items-end space-x-2">
            <button 
              @click="calculateAll" 
              class="flex-1 px-3 py-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
              :disabled="!employeeWages.length"
            >
              Calculate All
            </button>
            <button 
              @click="saveWages" 
              class="flex-1 px-3 py-2 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
              :disabled="!employeeWages.length"
            >
              Save Wages
            </button>
          </div>
        </div>
      </div>

      <!-- Table Section -->
      <div v-if="employeeWages.length" class="flex-1 bg-white rounded-lg shadow overflow-hidden">
        <div class="overflow-x-auto">
          <div class="inline-block min-w-full align-middle">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gradient-to-r from-teal-500 to-indigo-600 sticky top-0">
                <tr>
                  <th class="sticky top-0 px-2 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    <input 
                      type="checkbox" 
                      v-model="selectAll" 
                      @change="toggleSelectAll"
                      class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    >
                  </th>
                  <th class="sticky top-0 px-3 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Name</th>
                  <th class="sticky top-0 px-3 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Bank</th>
                  <th class="sticky top-0 px-3 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Branch</th>
                  <th class="sticky top-0 px-3 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Account</th>
                  <th class="sticky top-0 px-3 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">IFSC</th>
                  <th class="sticky top-0 px-3 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Per Day</th>
                  <th class="sticky top-0 px-3 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Days</th>
                  <th class="sticky top-0 px-3 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Gross</th>
                  <th class="sticky top-0 px-3 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">EPF</th>
                  <th class="sticky top-0 px-3 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">ESIC</th>
                  <th class="sticky top-0 px-3 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Deduct</th>
                  <th class="sticky top-0 px-3 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Benefit</th>
                  <th class="sticky top-0 px-3 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Net</th>
                  <th class="sticky top-0 px-3 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(wage, index) in employeeWages" :key="wage.masterRollId" class="hover:bg-gray-50">
                  <td class="px-2 py-2 whitespace-nowrap">
                    <input 
                      type="checkbox" 
                      v-model="wage.selected" 
                      class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    >
                  </td>
                  <td class="px-3 py-2 whitespace-nowrap text-sm">{{ wage.employeeName }}</td>
                  <td class="px-3 py-2 whitespace-nowrap text-sm">{{ wage.bank }}</td>
                  <td class="px-3 py-2 whitespace-nowrap text-sm">{{ wage.branch }}</td>
                  <td class="px-3 py-2 whitespace-nowrap text-sm">{{ wage.accountNo }}</td>
                  <td class="px-3 py-2 whitespace-nowrap text-sm">{{ wage.ifsc }}</td>
                  <td class="px-3 py-2 whitespace-nowrap">
                    <input 
                      type="number" 
                      v-model="wage.pDayWage" 
                      class="w-16 text-sm rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      @change="calculateWage(index)"
                    >
                  </td>
                  <td class="px-3 py-2 whitespace-nowrap">
                    <input 
                      type="number" 
                      v-model="wage.wage_Days" 
                      class="w-14 text-sm rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      @change="calculateWage(index)"
                    >
                  </td>
                  <td class="px-3 py-2 whitespace-nowrap text-sm">{{ wage.gross_salary }}</td>
                  <td class="px-3 py-2 whitespace-nowrap text-sm">{{ wage.epf_deduction }}</td>
                  <td class="px-3 py-2 whitespace-nowrap text-sm">{{ wage.esic_deduction }}</td>
                  <td class="px-3 py-2 whitespace-nowrap">
                    <input 
                      type="number" 
                      v-model="wage.other_deduction" 
                      class="w-16 text-sm rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      @change="calculateWage(index)"
                    >
                  </td>
                  <td class="px-3 py-2 whitespace-nowrap">
                    <input 
                      type="number" 
                      v-model="wage.other_benefit" 
                      class="w-16 text-sm rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      @change="calculateWage(index)"
                    >
                  </td>
                  <td class="px-3 py-2 whitespace-nowrap text-sm font-medium">{{ wage.net_salary }}</td>
                  <td class="px-3 py-2 whitespace-nowrap">
                    <button 
                      @click="calculateWage(index)" 
                      class="text-xs text-indigo-600 hover:text-indigo-900"
                    >
                      Calc
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- No Data States -->
      <div v-else-if="selectedMonth" class="flex-1 bg-white p-6 rounded-lg shadow text-center">
        <p class="text-gray-500 text-sm sm:text-base">No employee data available for the selected month.</p>
      </div>

      <div v-else class="flex-1 bg-white p-6 rounded-lg shadow text-center">
        <p class="text-gray-500 text-sm sm:text-base">Please select a month to load employee data.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useCookie, useFetch } from 'nuxt/app'

// Define page meta
definePageMeta({
  requiresAuth: true,
});

// State variables
const selectedMonth = ref('');
const employeeWages = ref([]);
const selectAll = ref(true);
const paymentDetails = reactive({
  paid_date: '',
  cheque_no: '',
  paid_from_bank_ac: ''
});

// Load employees from MasterRoll when month is selected
const loadEmployees = async () => {
  if (!selectedMonth.value) return;
  
  try {
    const token = useCookie('token').value;
    
    // Parse the selected month
    const [year, month] = selectedMonth.value.split('-');
    const startOfMonth = new Date(parseInt(year), parseInt(month) - 1, 1);
    const lastDayOfMonth = new Date(parseInt(year), parseInt(month), 0);
    console.log('Last day of selected month:', lastDayOfMonth);

    // Get all employees from master roll first
    const { data: response } = await useFetch('/api/master-roll', {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Filter by status - only active employees and those who joined before or on the last day of selected month
    const activeEmployees = response.value.employees.filter(emp => {
      const joinDate = emp.dateOfJoining ? new Date(emp.dateOfJoining) : null;
      return emp.status === 'active' && joinDate && joinDate <= lastDayOfMonth;
    });
    console.log(`Debug: Found ${activeEmployees.length} active employees with valid join date`);

    // First, get all wages to determine if this month has entries and what the latest month is
    const { data: allWagesData } = await useFetch('/api/wages', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    let shouldShowAllEmployees = false;
    
    if (allWagesData.value && allWagesData.value.wages) {
      // Check if the selected month exists in wages records
      const selectedMonthExists = allWagesData.value.wages.some(wage => {
        const wageMonth = new Date(wage.salary_month).toISOString().substring(0, 7);
        return wageMonth === selectedMonth.value;
      });
      
      // Get the last month with wage records
      const wageDates = allWagesData.value.wages.map(wage => new Date(wage.salary_month));
      const lastWageDate = wageDates.length > 0 ? new Date(Math.max(...wageDates)) : null;
      const lastWageMonth = lastWageDate ? lastWageDate.toISOString().substring(0, 7) : null;
      
      console.log(`Debug: Selected month: ${selectedMonth.value}, Last wage month: ${lastWageMonth}`);
      console.log(`Debug: Selected month exists in wages? ${selectedMonthExists}`);
      
      // Implement the exact logic:
      // "If selected month is not present in wages model salary_month AND 
      // selected month is greater than last month in wages model salary_month, then show all employees"
      shouldShowAllEmployees = !selectedMonthExists && 
                               (!lastWageMonth || selectedMonth.value > lastWageMonth);
    } else {
      // No wages records at all, show all employees
      shouldShowAllEmployees = true;
    }
    
    console.log(`Debug: Should show all employees? ${shouldShowAllEmployees}`);
    
    let employeesToShow = [];
    
    if (shouldShowAllEmployees) {
      // Show all active employees
      employeesToShow = [...activeEmployees];
      console.log(`Debug: Showing all ${employeesToShow.length} active employees`);
    } else {
      // Check which employees already have wages for this month
      const { data: wagesData } = await useFetch('/api/wages', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          month: selectedMonth.value
        }
      });
      
      // Create a set of employee IDs who have wages for this month
      const paidEmployeeIds = new Set();
      if (wagesData.value && wagesData.value.wages) {
        wagesData.value.wages.forEach(wage => {
          if (wage.masterRollId) {
            paidEmployeeIds.add(wage.masterRollId);
          }
        });
      }
      
      console.log(`Debug: Found ${paidEmployeeIds.size} employees with wages for ${selectedMonth.value}`);
      
      // Filter out employees who already have wages for this month
      employeesToShow = activeEmployees.filter(emp => !paidEmployeeIds.has(emp._id));
      console.log(`Debug: After filtering, showing ${employeesToShow.length} employees`);
    }
    
    console.log(`Month: ${selectedMonth.value}, Active employees: ${activeEmployees.length}, Employees to show: ${employeesToShow.length}`);
    
    // Transform remaining employees to wage format with default values
    employeeWages.value = employeesToShow.map(emp => ({
      masterRollId: emp._id,
      employeeName: emp.employeeName,
      bank: emp.bank,
      branch: emp.branch || '',
      accountNo: emp.accountNo,
      ifsc: emp.ifsc,
      pDayWage: Number(emp.pDayWage) || 0,
      wage_Days: 26, // Default value
      project: emp.project || '',
      site: emp.site || '',
      gross_salary: 0,
      epf_deduction: 0,
      esic_deduction: 0,
      other_deduction: 0,
      other_benefit: 0,
      net_salary: 0,
      selected: true // Default selected
    }));

    // Calculate initial values
    calculateAll();
  } catch (error) {
    console.error('Error loading employees:', error);
  }
};

// Toggle select all employees
const toggleSelectAll = () => {
  employeeWages.value.forEach(wage => {
    wage.selected = selectAll.value;
  });
};

// Watch for changes in individual selections
watch(
  () => employeeWages.value.map(w => w.selected),
  () => {
    selectAll.value = employeeWages.value.length > 0 && 
      employeeWages.value.every(w => w.selected);
  },
  { deep: true }
);

// Calculate wage for a single employee
const calculateWage = (index) => {
  const wage = employeeWages.value[index];
  
  // Calculate gross salary
  wage.gross_salary = Number(wage.pDayWage) * Number(wage.wage_Days);
  
  // Calculate EPF deduction (12%) with proper rounding and max cap of 1800
  const epfValue = wage.gross_salary * 0.12;
  const roundedEpf = Math.floor(epfValue) + (epfValue % 1 >= 0.5 ? 1 : 0);
  wage.epf_deduction = Math.min(roundedEpf, 1800);
  
  // Calculate ESIC deduction (0.75%) - rounded up to nearest whole number
  wage.esic_deduction = Math.ceil(wage.gross_salary * 0.0075);
  
  wage.other_deduction = Number(wage.other_deduction) || 0;
  wage.other_benefit = Number(wage.other_benefit) || 0;
  
  // Calculate net salary
  wage.net_salary = wage.gross_salary - (wage.epf_deduction + wage.esic_deduction + wage.other_deduction) + wage.other_benefit;
  // Round to 2 decimal places
  wage.net_salary = Math.round(wage.net_salary * 100) / 100;
};

// Calculate wages for all employees
const calculateAll = () => {
  employeeWages.value.forEach((_, index) => {
    calculateWage(index);
  });
};

// Save wages to database
const saveWages = async () => {
  if (!selectedMonth.value || !paymentDetails.paid_date) {
    alert('Please select a month and payment date');
    return;
  }

  // Get selected wages only
  const selectedWages = employeeWages.value
    .filter(wage => wage.selected)
    .map(wage => ({
      ...wage,
      salary_month: new Date(selectedMonth.value),
      paid_date: paymentDetails.paid_date,
      cheque_no: paymentDetails.cheque_no,
      paid_from_bank_ac: paymentDetails.paid_from_bank_ac
    }));

  if (selectedWages.length === 0) {
    alert('Please select at least one employee');
    return;
  }

  try {
    const token = useCookie('token').value;
    const response = await $fetch('/api/wages', {
      method: 'POST',
      body: { wages: selectedWages },
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.success) {
      alert(`Successfully saved wages for ${response.count} employees`);
      // Reload employees to get updated data
      await loadEmployees();
    }
  } catch (error) {
    console.error('Error saving wages:', error);
    alert('Failed to save wages. Please try again.');
  }
};
</script>

<style>
/* Page container styles */
.max-w-full {
  max-height: calc(100vh - 120px); /* Account for header and margins */
}

/* Table container styles */
.overflow-x-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

/* Custom scrollbar styles */
.overflow-x-auto::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 4px;
}

/* Responsive table styles */
@media (max-width: 640px) {
  .sticky {
    position: sticky;
    background-color: inherit;
    z-index: 1;
  }
  
  input[type="number"] {
    min-width: 60px;
  }
  
  .whitespace-nowrap {
    font-size: 0.75rem;
  }
}

/* Input field hover states */
input:hover, select:hover {
  border-color: #6366f1;
}

/* Improve table header visibility */
thead {
  z-index: 2;
}
</style>
