<template>
  <div class="container mx-auto pt-10 px-4">
    <h1 class="text-4xl font-bold mb-6">Admin Panel</h1>
    
    <!-- Tabs for different admin functions -->
    <div class="mb-6 border-b">
      <div class="flex">
        <button 
          @click="activeTab = 'firms'" 
          :class="[activeTab === 'firms' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500', 'px-4 py-2 font-medium']"
        >
          Manage Firms
        </button>
        <button 
          @click="activeTab = 'users'" 
          :class="[activeTab === 'users' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500', 'px-4 py-2 font-medium']"
        >
          Manage Users
        </button>
        <button 
          @click="activeTab = 'codes'" 
          :class="[activeTab === 'codes' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500', 'px-4 py-2 font-medium']"
        >
          Manager Codes
        </button>
      </div>
    </div>
    
    <!-- Firms Management Tab -->
    <div v-if="activeTab === 'firms'" class="space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-semibold">Firms</h2>
      </div>
      
      <!-- Pending Firms Section -->
      <div v-if="pendingFirms.length > 0" class="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-6">
        <h3 class="text-lg font-semibold text-yellow-800 mb-2">Pending Approval ({{ pendingFirms.length }})</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white">
            <thead class="bg-gray-100">
              <tr>
                <th class="py-2 px-4 text-left">Name</th>
                <th class="py-2 px-4 text-left">Code</th>
                <th class="py-2 px-4 text-left">Description</th>
                <th class="py-2 px-4 text-left">Created</th>
                <th class="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="firm in pendingFirms" :key="firm._id" class="border-t">
                <td class="py-2 px-4">{{ firm.name }}</td>
                <td class="py-2 px-4">{{ firm.code }}</td>
                <td class="py-2 px-4">{{ firm.description || '-' }}</td>
                <td class="py-2 px-4">{{ formatDate(firm.createdAt) }}</td>
                <td class="py-2 px-4 flex space-x-2">
                  <button @click="approveFirm(firm._id)" class="bg-green-500 text-white px-2 py-1 rounded text-sm hover:bg-green-600">
                    Approve
                  </button>
                  <button @click="rejectFirm(firm._id)" class="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600">
                    Reject
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- All Firms List -->
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white">
          <thead class="bg-gray-100">
            <tr>
              <th class="py-2 px-4 text-left">Name</th>
              <th class="py-2 px-4 text-left">Code</th>
              <th class="py-2 px-4 text-left">Status</th>
              <th class="py-2 px-4 text-left">Description</th>
              <th class="py-2 px-4 text-left">Created</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="firm in firms" :key="firm._id" class="border-t">
              <td class="py-2 px-4">{{ firm.name }}</td>
              <td class="py-2 px-4">{{ firm.code }}</td>
              <td class="py-2 px-4">
                <span 
                  :class="{
                    'bg-green-100 text-green-800': firm.status === 'approved',
                    'bg-yellow-100 text-yellow-800': firm.status === 'pending',
                    'bg-red-100 text-red-800': firm.status === 'rejected'
                  }"
                  class="px-2 py-1 rounded-full text-xs font-medium"
                >
                  {{ firm.status }}
                </span>
              </td>
              <td class="py-2 px-4">{{ firm.description || '-' }}</td>
              <td class="py-2 px-4">{{ formatDate(firm.createdAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Users Management Tab -->
    <div v-if="activeTab === 'users'">
      <!-- ... existing users management code ... -->
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-semibold">Users</h2>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white">
          <thead class="bg-gray-100">
            <tr>
              <th class="py-2 px-4 text-left">Username</th>
              <th class="py-2 px-4 text-left">Full Name</th>
              <th class="py-2 px-4 text-left">Email</th>
              <th class="py-2 px-4 text-left">Role</th>
              <th class="py-2 px-4 text-left">Firm</th>
              <th class="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user._id" class="border-t">
              <td class="py-2 px-4">{{ user.username }}</td>
              <td class="py-2 px-4">{{ user.fullname }}</td>
              <td class="py-2 px-4">{{ user.email }}</td>
              <td class="py-2 px-4">
                <span 
                  :class="{
                    'bg-blue-100 text-blue-800': user.role === 'admin',
                    'bg-green-100 text-green-800': user.role === 'manager',
                    'bg-gray-100 text-gray-800': user.role === 'user'
                  }"
                  class="px-2 py-1 rounded-full text-xs font-medium"
                >
                  {{ user.role }}
                </span>
              </td>
              <td class="py-2 px-4">{{ getUserFirmName(user.firmId) }}</td>
              <td class="py-2 px-4 flex space-x-2">
                <button 
                  @click="editUser(user)" 
                  class="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
                >
                  Edit
                </button>
                <button 
                  @click="deleteUser(user._id)" 
                  class="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Manager Codes Tab -->
    <div v-if="activeTab === 'codes'">
      <!-- ... existing manager codes management code ... -->
      <div v-if="activeTab === 'codes'" class="space-y-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-semibold">Manager Codes</h2>
        <button 
          @click="generateManagerCodes(5)" 
          class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Generate 5 New Codes
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full bg-white">
          <thead class="bg-gray-100">
            <tr>
              <th class="py-2 px-4 text-left">Code</th>
              <th class="py-2 px-4 text-left">Status</th>
              <th class="py-2 px-4 text-left">Used By</th>
              <th class="py-2 px-4 text-left">Used At</th>
              <th class="py-2 px-4 text-left">Created At</th>
              <th class="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="code in managerCodes" :key="code._id" class="border-t">
              <td class="py-2 px-4 font-mono">{{ code.code }}</td>
              <td class="py-2 px-4">
                <span 
                  :class="{
                    'bg-green-100 text-green-800': !code.used,
                    'bg-gray-100 text-gray-800': code.used
                  }"
                  class="px-2 py-1 rounded-full text-xs font-medium"
                >
                  {{ code.used ? 'Used' : 'Available' }}
                </span>
              </td>
              <td class="py-2 px-4">{{ code.usedBy ? getUserName(code.usedBy) : '-' }}</td>
              <td class="py-2 px-4">{{ code.usedAt ? formatDate(code.usedAt) : '-' }}</td>
              <td class="py-2 px-4">{{ formatDate(code.createdAt) }}</td>
              <td class="py-2 px-4">
                <button 
                  @click="deleteManagerCodes([code._id])" 
                  class="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    </div>

    <!-- Edit User Modal -->
    <div v-if="showEditUserModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg w-full max-w-2xl p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-semibold">Edit User</h3>
          <button @click="showEditUserModal = false" class="text-gray-500 hover:text-gray-700">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="updateUser" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input v-model="userForm.username" type="text" required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input v-model="userForm.fullname" type="text" required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input v-model="userForm.email" type="email" required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select v-model="userForm.role" required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                <option value="user">User</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Firm</label>
              <select v-model="userForm.firmId" required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                <option value="" disabled>Select a firm</option>
                <option v-for="firm in firms" :key="firm._id" :value="firm._id">{{ firm.name }}</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end space-x-3 mt-6">
            <button type="button" @click="showEditUserModal = false"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Cancel
            </button>
            <button type="submit"
              class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useToast } from '~/composables/useToast';

interface Firm {
  _id: string;
  name: string;
  code: string;
  description?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

interface User {
  _id: string;
  username: string;
  fullname: string;
  email: string;
  role: 'user' | 'manager' | 'admin';
  firmId: string;
}

interface ManagerCode {
  _id: string;
  code: string;
  used: boolean;
  usedBy?: string;
  usedAt?: string;
  createdAt: string;
}

const toast = useToast();
const activeTab = ref('firms');

// Firms Management
const firms:any = ref<Firm[]>([]);
const pendingFirms = ref<Firm[]>([]);
const showCreateFirmModal = ref(false);
const showEditFirmModal = ref(false);
const firmForm = ref<Omit<Firm, '_id' | 'createdAt'> & { _id?: string }>({
  name: '',
  code: '',
  description: '',
  status: 'pending'
});

// Users Management
const users = ref<User[]>([]);
const showEditUserModal = ref(false);
const userForm = ref<Omit<User, '_id'> & { _id?: string }>({
  username: '',
  fullname: '',
  email: '',
  role: 'user',
  firmId: ''
});

// Manager Codes Management
const managerCodes = ref<ManagerCode[]>([]);

// Fetch Data Functions
async function fetchFirms() {
  try {
    const data:any = await $fetch('/api/firms');
    firms.value = data;
    pendingFirms.value = data.filter((firm:any) => firm.status === 'pending');
  } catch (error) {
    toast.error('Failed to fetch firms');
  }
}

async function fetchUsers() {
  try {
    const data:any = await $fetch('/api/users');
    users.value = data.users;
  } catch (error) {
    toast.error('Failed to fetch users');
  }
}

async function fetchManagerCodes() {
  try {
    const data:any = await $fetch('/api/manager-codes');
    managerCodes.value = data.codes;
  } catch (error) {
    toast.error('Failed to fetch manager codes');
  }
}

// Load initial data
onMounted(async () => {
  await fetchFirms();
  await fetchUsers();
  await fetchManagerCodes();
});

// Firm Management Functions
async function createFirm() {
  try {
    const response = await $fetch('/api/firms', {
      method: 'POST',
      body: firmForm.value
    });
    toast.success('Firm created successfully');
    showCreateFirmModal.value = false;
    await fetchFirms();
    firmForm.value = { _id: '', name: '', code: '', description: '', status: 'pending' };
  } catch (error) {
    toast.error('Failed to create firm');
  }
}

async function updateFirm() {
  try {
    const response = await $fetch(`/api/firms/${firmForm.value._id}`, {
      method: 'PUT',
      body: firmForm.value
    });
    toast.success('Firm updated successfully');
    showEditFirmModal.value = false;
    await fetchFirms();
  } catch (error) {
    toast.error('Failed to update firm');
  }
}

async function deleteFirm(id: string) {
  if (confirm('Are you sure you want to delete this firm?')) {
    try {
      await $fetch(`/api/firms/${id}`, { method: 'DELETE' });
      toast.success('Firm deleted successfully');
      await fetchFirms();
    } catch (error) {
      toast.error('Failed to delete firm');
    }
  }
}

async function approveFirm(id: string) {
  try {
    await $fetch(`/api/firms/${id}/approve`, { method: 'POST' });
    toast.success('Firm approved successfully');
    await fetchFirms();
  } catch (error) {
    toast.error('Failed to approve firm');
  }
}

async function rejectFirm(id: string) {
  try {
    await $fetch(`/api/firms/${id}/reject`, { method: 'POST' });
    toast.success('Firm rejected successfully');
    await fetchFirms();
  } catch (error) {
    toast.error('Failed to reject firm');
  }
}

function editFirm(firm: Firm) {
  firmForm.value = { ...firm };
  showEditFirmModal.value = true;
}

// User Management Functions
async function updateUser() {
  try {
    await $fetch(`/api/users/${userForm.value._id}`, {
      method: 'PUT',
      body: userForm.value
    });
    toast.success('User updated successfully');
    showEditUserModal.value = false;
    await fetchUsers();
  } catch (error) {
    toast.error('Failed to update user');
  }
}

async function deleteUser(id: string) {
  if (confirm('Are you sure you want to delete this user?')) {
    try {
      await $fetch(`/api/users/${id}`, { method: 'DELETE' });
      toast.success('User deleted successfully');
      await fetchUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  }
}

async function editUser(user: User) {
  userForm.value = { ...user };
  showEditUserModal.value = true;
}

// Manager Code Functions
async function generateManagerCodes(count: number) {
  try {
    await $fetch('/api/manager-codes', {
      method: 'POST',
      body: { count }
    });
    toast.success(`Generated ${count} manager code(s)`);
    await fetchManagerCodes();
  } catch (error) {
    toast.error('Failed to generate manager codes');
  }
}

async function deleteManagerCodes(codes: string[]) {
  try {
    await $fetch('/api/manager-codes', {
      method: 'DELETE',
      body: { codes }
    });
    toast.success('Manager codes deleted successfully');
    await fetchManagerCodes();
  } catch (error) {
    toast.error('Failed to delete manager codes');
  }
}

function getUserFirmName(firmId: string) {
  const firm = firms.value.find((f:any) => f._id === firmId);
  return firm ? firm.name : '-';
}

function getUserName(userId: string) {
  const user = users.value.find(u => u._id === userId);
  return user ? user.fullname : '-';
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString();
}

// Initial Data Load
onMounted(async () => {
  await Promise.all([
    fetchFirms(),
    fetchUsers(),
    fetchManagerCodes()
  ]);
});
</script>