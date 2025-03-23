<template>
  <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <!-- Toast component for notifications -->
    <Toast v-if="toast" :message="toast.message" :type="toast.type" :show="!!toast" />
    
    <div class="px-4 py-6 sm:px-0">
      <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-6 space-y-4 md:space-y-0">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900">Master Roll</h1>
        <div class="flex flex-wrap gap-2 md:gap-4">
          <button @click="showAddModal = true"
            class="inline-flex items-center px-3 py-2 md:px-4 md:py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
            <UserPlusIcon class="h-5 w-5 mr-2" />
            Add Employee
          </button>
          <button @click="downloadTemplate"
            class="inline-flex items-center px-3 py-2 md:px-4 md:py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 w-full sm:w-auto">
            <DocumentArrowDownIcon class="h-5 w-5 mr-2" />
            Download Template
          </button>
          <button @click="downloadMasterRoll"
            class="inline-flex items-center px-3 py-2 md:px-4 md:py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 w-full sm:w-auto">
            <DocumentTextIcon class="h-5 w-5 mr-2" />
            Download Master Roll
          </button>
          <label
            class="inline-flex items-center px-3 py-2 md:px-4 md:py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer w-full sm:w-auto">
            <ArrowDownTrayIcon class="h-5 w-5 mr-2" />
            Upload Excel
            <input type="file" @change="handleFileUpload" accept=".xlsx,.xls" class="hidden">
          </label>
        </div>
      </div>

      <!-- Data Table -->
      <div class="mt-8 flex flex-col">
        <!-- Search Box -->
        <div class="mb-4 px-4">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
            </div>
            <input
              v-model="searchTerm"
              type="text"
              placeholder="Search employees..."
              class="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <!-- Desktop Table (hidden on small screens) -->
              <table class="min-w-full divide-y divide-gray-200 hidden md:table">
                <thead class="bg-gradient-to-r from-teal-500 to-indigo-600">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Employee
                      Name</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Father/Husband Name</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Phone</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Date of
                      Joining</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Category
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="employee in filteredEmployees" :key="employee._id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">{{ employee.employeeName }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ employee.fatherHusbandName }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ employee.phoneNo }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(employee.dateOfJoining) }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ employee.status || 'Active' }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ employee.category }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <button @click="editEmployee(employee)"
                        class="text-indigo-600 hover:text-indigo-900 mr-3 inline-flex items-center">
                        <PencilIcon class="h-4 w-4 mr-1" />
                        Edit
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              
              <!-- Mobile Card View (visible only on small screens) -->
              <div class="md:hidden">
                <div v-for="employee in filteredEmployees" :key="employee._id" 
                  class="bg-white border-b border-gray-200 p-4 hover:bg-gray-50">
                  <div class="flex justify-between items-center mb-2">
                    <h3 class="text-lg font-medium text-gray-900">{{ employee.employeeName }}</h3>
                    <button @click="editEmployee(employee)"
                      class="text-indigo-600 hover:text-indigo-900 inline-flex items-center">
                      <PencilIcon class="h-4 w-4 mr-1" />
                      Edit
                    </button>
                  </div>
                  <div class="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span class="text-gray-500">Father/Husband:</span>
                      <span class="ml-1">{{ employee.fatherHusbandName }}</span>
                    </div>
                    <div>
                      <span class="text-gray-500">Phone:</span>
                      <span class="ml-1">{{ employee.phoneNo }}</span>
                    </div>
                    <div>
                      <span class="text-gray-500">Joined:</span>
                      <span class="ml-1">{{ formatDate(employee.dateOfJoining) }}</span>
                    </div>
                    <div>
                      <span class="text-gray-500">Status:</span>
                      <span class="ml-1">{{ employee.status || 'Active' }}</span>
                    </div>
                    <div>
                      <span class="text-gray-500">Category:</span>
                      <span class="ml-1">{{ employee.category }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit Modal -->
      <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
        <div class="bg-white rounded-lg w-full lg:w-4/5 max-w-2xl lg:max-w-none my-4">
          <!-- Modal Header -->
          <div class="bg-gradient-to-r from-teal-500 to-indigo-600 p-4 rounded-t-lg flex justify-between items-center sticky top-0">
            <h2 class="text-xl font-bold text-white">Edit Employee</h2>
            <button @click="showEditModal = false" class="text-white hover:text-red-200 transition-colors">
              <XMarkIcon class="h-6 w-6" />
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-4 md:p-6 overflow-y-auto max-h-[70vh]">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Employee Name</label>
                <input v-model="editingEmployee.employeeName"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 blink-focus">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Father/Husband Name</label>
                <input v-model="editingEmployee.fatherHusbandName"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 blink-focus">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input type="date" :value="formatDateForInput(editingEmployee.dateOfBirth)"
                  @input="e => editingEmployee.dateOfBirth = (e.target as HTMLInputElement).value"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 blink-focus">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Date of Joining</label>
                <input type="date" :value="formatDateForInput(editingEmployee.dateOfJoining)"
                  @input="e => editingEmployee.dateOfJoining = (e.target as HTMLInputElement).value"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 blink-focus">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Aadhar</label>
                <input v-model="editingEmployee.aadhar"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 blink-focus">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">PAN</label>
                <input v-model="editingEmployee.pan"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 blink-focus">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Address</label>
                <input v-model="editingEmployee.address"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 blink-focus">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Phone Number</label>
                <input v-model="editingEmployee.phoneNo"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 blink-focus">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Bank</label>
                <input v-model="editingEmployee.bank"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 blink-focus">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Branch</label>
                <input v-model="editingEmployee.branch"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 blink-focus">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Account Number</label>
                <input v-model="editingEmployee.accountNo"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 blink-focus">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">IFSC</label>
                <input v-model="editingEmployee.ifsc"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 blink-focus">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">UAN</label>
                <input v-model="editingEmployee.uan"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 blink-focus">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">ESIC Number</label>
                <input v-model="editingEmployee.esicNo"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 blink-focus">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">S Kalyan Number</label>
                <input v-model="editingEmployee.sKalyanNo"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 blink-focus">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Per Day Wage</label>
                <input type="number" v-model="editingEmployee.pDayWage"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 blink-focus">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Project</label>
                <input v-model="editingEmployee.project"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 blink-focus">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Site</label>
                <input v-model="editingEmployee.site"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 blink-focus">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Category</label>
                <select v-model="editingEmployee.category" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 blink-focus">
                  <option value="HELPER">HELPER</option>
                  <option value="TECHNICIAN">TECHNICIAN</option>
                  <option value="ELECTRICIAN">ELECTRICIAN</option>
                  <option value="SEMI-SKILLED">SEMI-SKILLED</option>
                  <option value="HIGHLY-SKILLED">HIGHLY-SKILLED</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Status</label>
                <select v-model="editingEmployee.status" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 blink-focus">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="on Leave">On Leave</option>
                  <option value="terminated">Terminated</option>
                  <option value="left">Left Service</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Date of Exit</label>
                <input type="date" :value="formatDateForInput(editingEmployee.dateOfExit)"
                  @input="e => editingEmployee.dateOfExit = (e.target as HTMLInputElement).value"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 blink-focus">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Exit Remarks</label>
                <input v-model="editingEmployee.doeRem"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 blink-focus">
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="bg-gradient-to-r from-indigo-600 to-teal-500 p-4 rounded-b-lg flex justify-end space-x-3">
            <button @click="generateAppointmentLetter(editingEmployee)"
              class="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold shadow-md hover:from-yellow-500 hover:to-orange-600 focus:outline-none transition duration-300">
              <DocumentTextIcon class="h-5 w-5 mr-2" />
              Generate Appointment Letter
            </button>
            <button @click="showEditModal = false"
              class="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-red-400 to-red-600 text-white font-bold shadow-md hover:from-red-500 hover:to-red-700 focus:outline-none transition duration-300">
              <XMarkIcon class="h-5 w-5 mr-2" />
              Cancel
            </button>

            <!-- Save Button -->
            <button @click="updateEmployee"
              class="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-teal-400 to-blue-500 text-white font-bold shadow-lg hover:from-teal-500 hover:to-blue-600 focus:outline-none transform hover:scale-105 transition duration-300">
              <CheckIcon class="h-5 w-5 mr-2" />
              Save
            </button>
          </div>
        </div>
      </div>

      <!-- Add Employee Modal -->
      <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
        <div class="bg-white rounded-lg w-full lg:w-4/5 max-w-2xl lg:max-w-none my-4">
          <!-- Modal Header -->
          <div class="bg-gradient-to-r from-teal-500 to-indigo-600 p-4 rounded-t-lg flex justify-between items-center sticky top-0">
            <h2 class="text-xl font-bold text-white">Add New Employee</h2>
            <button @click="showAddModal = false" class="text-white hover:text-red-200 transition-colors">
              <XMarkIcon class="h-6 w-6" />
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-4 md:p-6 overflow-y-auto max-h-[70vh]">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Employee Name</label>
                <input v-model="newEmployee.employeeName"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 blink-focus">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Father/Husband Name</label>
                <input v-model="newEmployee.fatherHusbandName"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 blink-focus">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input type="date" v-model="newEmployee.dateOfBirth"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 blink-focus">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Date of Joining</label>
                <input type="date" v-model="newEmployee.dateOfJoining"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 blink-focus">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Aadhar</label>
                <input v-model="newEmployee.aadhar"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 blink-focus">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">PAN</label>
                <input v-model="newEmployee.pan"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 blink-focus">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Address</label>
                <input v-model="newEmployee.address"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 blink-focus">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Phone Number</label>
                <input v-model="newEmployee.phoneNo"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 blink-focus">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Bank</label>
                <input v-model="newEmployee.bank"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 blink-focus">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Branch</label>
                <input v-model="newEmployee.branch"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 blink-focus">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Account Number</label>
                <input v-model="newEmployee.accountNo"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 blink-focus">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">IFSC</label>
                <input v-model="newEmployee.ifsc"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 blink-focus">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">UAN</label>
                <input v-model="newEmployee.uan"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 blink-focus">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">ESIC Number</label>
                <input v-model="newEmployee.esicNo"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 blink-focus">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">S Kalyan Number</label>
                <input v-model="newEmployee.sKalyanNo"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 blink-focus">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Per Day Wage</label>
                <input type="number" v-model="newEmployee.pDayWage"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 blink-focus">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Project</label>
                <input v-model="newEmployee.project"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 blink-focus">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Site</label>
                <input v-model="newEmployee.site"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 blink-focus">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Category</label>
                <select v-model="newEmployee.category" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 blink-focus">
                  <option value="HELPER">HELPER</option>
                  <option value="TECHNICIAN">TECHNICIAN</option>
                  <option value="ELECTRICIAN">ELECTRICIAN</option>
                  <option value="SEMI-SKILLED">SEMI-SKILLED</option>
                  <option value="HIGHLY-SKILLED">HIGHLY-SKILLED</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Status</label>
                <select v-model="newEmployee.status" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 blink-focus">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="on Leave">On Leave</option>
                  <option value="terminated">Terminated</option>
                  <option value="left">Left Service</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Date of Exit</label>
                <input type="date" v-model="newEmployee.dateOfExit"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 blink-focus">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Exit Remarks</label>
                <input v-model="newEmployee.doeRem"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 blink-focus">
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="bg-gradient-to-r from-indigo-600 to-teal-500 p-4 rounded-b-lg flex justify-end space-x-3">
            <button @click="showAddModal = false"
              class="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-red-400 to-red-600 text-white font-bold shadow-md hover:from-red-500 hover:to-red-700 focus:outline-none transition duration-300">
              <XMarkIcon class="h-5 w-5 mr-2" />
              Cancel
            </button>

            <!-- Save Button -->
            <button @click="addEmployee"
              class="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-teal-400 to-blue-500 text-white font-bold shadow-lg hover:from-teal-500 hover:to-blue-600 focus:outline-none transform hover:scale-105 transition duration-300">
              <CheckIcon class="h-5 w-5 mr-2" />
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useToast } from '~/composables/useToast'
import { PencilIcon, UserPlusIcon, DocumentArrowDownIcon, ArrowDownTrayIcon, DocumentTextIcon, XMarkIcon, CheckIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline' // Import icons

definePageMeta({
  requiresAuth: true,
});


// Extract toast from useToast composable
const { toast, success, error } = useToast()

// Define employee interface
interface Employee {
  _id: string;
  employeeName: string;
  fatherHusbandName: string;
  dateOfBirth: string;
  dateOfJoining: string;
  dateOfExit: string;
  doeRem: string;
  aadhar: string;
  phoneNo: string;
  address: string;
  bank: string;
  branch: string;
  accountNo: string;
  ifsc: string;
  category: string;
  project: string;
  site: string;
  sKalyanNo: string;
  pan: string;
  uan: string;
  esicNo: string;
  pDayWage: string | number;
  status: string;
}

const employees = ref<Employee[]>([])
const showEditModal = ref(false)
const editingEmployee = reactive({
  _id: '',
  employeeName: '',
  fatherHusbandName: '',
  dateOfBirth: '',
  dateOfJoining: '',
  dateOfExit: '',
  doeRem: '',
  aadhar: '',
  phoneNo: '',
  address: '',
  bank: '',
  branch: '',
  accountNo: '',
  ifsc: '',
  category: 'UNSKILLED',
  project: '',
  site: '',
  sKalyanNo: '',
  pan: '',
  uan: '',
  esicNo: '',
  pDayWage: '',
  status: 'Active'
})

// Add new state variables for adding new employee
const showAddModal = ref(false)
const searchTerm = ref('')

// Computed property for filtered employees
const filteredEmployees = computed(() => {
  if (!searchTerm.value) {
    return employees.value
  }
  
  const search = searchTerm.value.toLowerCase()
  return employees.value.filter(employee => {
    return (
      employee.employeeName?.toLowerCase().includes(search) ||
      employee.fatherHusbandName?.toLowerCase().includes(search) ||
      employee.phoneNo?.toLowerCase().includes(search) ||
      employee.category?.toLowerCase().includes(search) ||
      employee.status?.toLowerCase().includes(search)
    )
  })
})
const newEmployee = ref({
  employeeName: '',
  fatherHusbandName: '',
  dateOfBirth: '',
  dateOfJoining: '',
  aadhar: '',
  pan: '',
  phoneNo: '',
  address: '',
  bank: '',
  branch: '',
  accountNo: '',
  ifsc: '',
  uan: '',
  esicNo: '',
  sKalyanNo: '',
  category: 'HELPER',
  pDayWage: 0,
  project: '',
  site: '',
  dateOfExit: '',
  doeRem: '',
  status: 'active'
})

// Fetch employees on mount
onMounted(async () => {
  try {
    console.log('Master Roll page mounted')

    // Fetch employees directly without auth
    const token = useCookie('token').value;
    const response = await $fetch('/api/master-roll', {
      headers: { Authorization: `Bearer ${token}` },
    });

    employees.value = response.employees as Employee[]
    console.log('Employees fetched successfully:', employees.value.length)
  } catch (error) {
    console.error('Error in Master Roll page:', error)
  }
})

// No middleware needed

const downloadTemplate = async () => {
  // Alert the user about the color scheme
  alert('Template color scheme:\n\n- Red headers: Required fields\n- Orange headers: Optional fields');
  
  try {
    const token = useCookie('token').value;
    const response = await fetch('/api/master-roll/template', {
      headers: { Authorization: `Bearer ${token}` },
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error('Failed to download the template');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    // Trigger file download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'MasterRollTemplate.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading template:', error);
    alert('Failed to download template. Please try again.');
  }
}

const handleFileUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  try {
    // Create FormData and append the file
    const formData = new FormData()
    formData.append('file', file)
    
    // Send the raw file to the server
    const token = useCookie('token').value;
    await $fetch('/api/master-roll/upload', {
      headers: { Authorization: `Bearer ${token}` },
      method: 'POST',
      body: formData
    })

    // Refresh the employee list
    const response = await $fetch('/api/master-roll')
    employees.value = response.employees as Employee[]
  } catch (error) {
    console.error('Error uploading employees:', error)
  }
}

const editEmployee = (employee: any) => {
  Object.assign(editingEmployee, employee)
  showEditModal.value = true
}

const updateEmployee = async () => {
  try {
    const token = useCookie('token').value;
    await $fetch(`/api/master-roll/${editingEmployee._id}`, {
      headers: { Authorization: `Bearer ${token}` },
      method: 'PUT',
      body: editingEmployee
    })

    showEditModal.value = false

    // Refresh the employee list
    const response = await $fetch('/api/master-roll')
    employees.value = response.employees as Employee[]
    
    // Show success toast notification
    success('Employee updated successfully')
  } catch (error1) {
    console.error('Error updating employee:', error1)
    // Show error toast notification
    error('Failed to update employee')
  }
}

const deleteEmployee = async (id: string) => {
  if (!confirm('Are you sure you want to delete this employee?')) return

  try {
    const token = useCookie('token').value;
    await $fetch(`/api/master-roll/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      method: 'DELETE'
    })

    // Refresh the employee list
    const response = await $fetch('/api/master-roll')
    employees.value = response.employees as Employee[]
  } catch (error) {
    console.error('Error deleting employee:', error)
  }
}

// Update the date formatting functions
const formatDate = (date: string) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-IN')
}

const formatDateForInput = (date: string) => {
  if (!date) return ''
  return new Date(date).toISOString().split('T')[0]
}

const downloadMasterRoll = async () => {
  try {
    const token = useCookie('token').value;
    const response = await fetch('/api/master-roll/download', {
      headers: { Authorization: `Bearer ${token}` },
      method: 'GET'
    })

    if (!response.ok) {
      throw new Error('Failed to download the Excel file');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    // Trigger file download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'master_roll.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading master roll:', error)
  }
}

// Create a simple notification function
const notify = (message: string, type: 'success' | 'error' = 'success') => {
  alert(type === 'success' ? `✅ ${message}` : `❌ ${message}`);
}

// Function to add a new employee
const addEmployee = async () => {
  try {
    const token = useCookie('token').value;
    const response = await $fetch('/api/master-roll', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: newEmployee.value
    })

    if (response.success) {
      // Add the new employee to the list
      employees.value.push(response.data)
      
      // Close the modal and reset the form
      showAddModal.value = false
      newEmployee.value = {
        employeeName: '',
        fatherHusbandName: '',
        dateOfBirth: '',
        dateOfJoining: '',
        aadhar: '',
        pan: '',
        phoneNo: '',
        address: '',
        bank: '',
        branch: '',
        accountNo: '',
        ifsc: '',
        uan: '',
        esicNo: '',
        sKalyanNo: '',
        category: 'UNSKILLED',
        pDayWage: 0,
        project: '',
        site: '',
        dateOfExit: '',
        doeRem: '',
        status: 'active'
      }
      
      // Show success notification
     success('Employee added successfully');
    } else {
      notify(response.message || 'Failed to add employee', 'error');
    }
  } catch (error1: any) {
    notify(error1.message || 'An error occurred', 'error');
  }
}

// Function to generate appointment letter
const generateAppointmentLetter = async (employee: any) => {
  try {
    // Calculate gross salary
    const perDayWage = parseFloat(employee.pDayWage) || 0;
    const grossSalary = perDayWage * 26;
    
    // Get current date for letter
    const currentDate = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
    
    // Get joining date formatted
    const joiningDate = employee.dateOfJoining ? 
      new Date(employee.dateOfJoining).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long', 
        year: 'numeric'
      }) : 'To be determined';
    
    // Get category/designation
    const designation = employee.category || 'UNSKILLED';
    
    // Create a temporary div to hold our letter content
    const container = document.createElement('div');
    container.style.padding = '20px';
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.fontSize = '11px';
    container.style.lineHeight = '1.3';
    container.style.marginTop = '20mm';
    container.style.marginBottom = '20mm';
    
    // Start with empty letterHtml - no company header
    let letterHtml = '';
    
    // Reference and Date
    letterHtml += `
      <div style="display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 10px;">
        <div>Ref: HR/APPT/${new Date().getFullYear()}/${employee._id?.slice(-5) || 'XXXXX'}</div>
        <div>Date: ${currentDate}</div>
      </div>
    `;
    
    // Title
    letterHtml += `
      <div style="text-align: center; margin-bottom: 15px;">
        <h2 style="font-size: 13px; text-transform: uppercase; margin: 0;">Appointment Letter</h2>
      </div>
    `;
    
    // Addressee
    letterHtml += `
      <div style="margin-bottom: 15px; line-height: 1.4;">
        <p style="margin: 0 0 3px 0;">To,</p>
        <p style="margin: 0 0 3px 0;">${employee.employeeName}</p>
        <p style="margin: 0 0 3px 0;">S/o ${employee.fatherHusbandName}</p>
        <p style="margin: 0 0 3px 0;">${employee.address || ''}</p>
      </div>
    `;
    
    // Letter Body
    letterHtml += `
      <div style="margin-bottom: 15px;">
        <p style="margin: 0 0 8px 0;">Dear ${employee.employeeName},</p>
        <p style="text-align: justify; margin: 0 0 8px 0; text-indent: 30px;">
          With reference to your application and subsequent interview, we are pleased to offer you the position of "${designation}" 
          in our organization effective from ${joiningDate}.
        </p>
        <p style="margin: 0 0 8px 0;">Your employment will be subject to the following terms and conditions:</p>
        <ul style="text-align: justify; padding-left: 20px; margin: 0 0 8px 0;">
          <li style="margin-bottom: 5px;">Designation: You will be designated as "${designation}".</li>
          <li style="margin-bottom: 5px;">Salary: Your gross salary will be Rs. ${grossSalary.toFixed(2)} per month (Rs. ${perDayWage.toFixed(2)} per day × 26 days). 
              Statutory deductions will be made as per government regulations.</li>
          <li style="margin-bottom: 5px;">Probation: You will be on probation for a period of three months from the date of joining.</li>
          <li style="margin-bottom: 5px;">Working Hours: Standard working hours are 8 hours per day, 6 days a week.</li>
          <li style="margin-bottom: 5px;">Leave: You will be entitled to leaves as per company policy.</li>
          <li style="margin-bottom: 5px;">Notice Period: During probation, employment can be terminated by either party with 7 days' notice. 
              Post probation, notice period will be 30 days.</li>
          <li style="margin-bottom: 5px;">Code of Conduct: You will be governed by the company's policies, rules, and regulations in force.</li>
        </ul>
      </div>
    `;
    
    // Required Documents
    letterHtml += `
      <div style="margin-bottom: 15px;">
        <p style="margin: 0 0 8px 0;"><strong>Required Documents:</strong></p>
        <ul style="padding-left: 20px; margin: 0 0 8px 0;">
          <li style="margin-bottom: 5px;">Bank account details for salary transfer</li>
          <li style="margin-bottom: 5px;">Previous UAN & ESIC number (if any)</li>
          <li style="margin-bottom: 5px;">Police verification record</li>
          <li style="margin-bottom: 5px;">Two passport-sized photographs</li>
          <li style="margin-bottom: 5px;">Copies of educational certificates</li>
          <li style="margin-bottom: 5px;">ID and address proof</li>
          <li style="margin-bottom: 5px;">Previous employment relieving letter (if applicable)</li>
        </ul>
      </div>
    `;
    
    // Acceptance and Closing
    letterHtml += `
      <div style="margin-bottom: 15px; text-align: justify;">
        <p style="margin: 0 0 8px 0; text-indent: 30px;">Please sign and return the duplicate copy of this letter as a token of your acceptance of the above terms and conditions.</p>
        <p style="margin: 0 0 8px 0; text-indent: 30px;">We welcome you to our organization and look forward to a long and mutually beneficial association.</p>
      </div>
    `;
    
    // Signatures
    letterHtml += `
      <div style="display: flex; justify-content: space-between; margin-top: 30px; font-size: 11px;">
        <div style="width: 45%;">
          <p style="margin: 0 0 25px 0;">For YOUR COMPANY NAME</p>
          <p style="margin: 0;">Authorized Signatory</p>
        </div>
        <div style="width: 45%; text-align: right;">
          <p style="margin: 0 0 25px 0;">I accept the terms and conditions</p>
          <p style="margin: 0;">(${employee.employeeName})</p>
        </div>
      </div>
    `;
    
    container.innerHTML = letterHtml;
    document.body.appendChild(container);
    
    // Load html2pdf dynamically with the correct path
    const html2pdf = await import("html2pdf.js/dist/html2pdf.bundle.min.js");
    
    // Generate and download PDF with A4 size and appropriate margins
    const opt = {
      margin: [20, 15, 20, 15], // [top, right, bottom, left] in mm
      filename: `Appointment_Letter_${employee.employeeName.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true }
    };
    
    html2pdf.default().from(container).set(opt).save().then(() => {
      // Remove the container element after PDF generation
      document.body.removeChild(container);
      notify('Appointment letter generated successfully');
    });
  } catch (error: any) {
    console.error('Error generating appointment letter:', error);
    notify('Failed to generate appointment letter', 'error');
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.blink-focus {
  transition: all 0.3s ease;
}

.blink-focus:focus {
  outline: none;
  animation: borderBlink 1.5s infinite;
  border-color: transparent !important;
}

@keyframes borderBlink {
  0% {
    box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.4);
    border-color: rgb(239, 68, 68) !important;
  }

  50% {
    box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.4);
    border-color: rgb(34, 197, 94) !important;
  }

  100% {
    box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.4);
    border-color: rgb(239, 68, 68) !important;
  }
}
</style>
