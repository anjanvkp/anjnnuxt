<template>
  <!-- Dashboard Content -->
  <div class="bg-white rounded-xl shadow-md p-6 mb-8">
    <div v-if="mounted">
      <div class="flex items-center mb-6">
        <div class="bg-emerald-100 p-3 rounded-full mr-4">
          <svg class="h-8 w-8 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <h2 class="text-2xl font-bold text-slate-800">User Profile</h2>
          <p class="text-slate-600">Welcome back, {{ user?.fullname || 'User' }}!</p>
        </div>
        <button @click="handleLogout"
          class="ml-auto bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors duration-300">
          Logout
        </button>
      </div>

      <div class="border-t border-gray-200 pt-6">
        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-slate-50 p-4 rounded-lg">
            <h3 class="font-medium text-slate-700 mb-2">Account Information</h3>
            <p><span class="text-slate-500">Username:</span> {{ user?.username }}</p>
            <p><span class="text-slate-500">Email:</span> {{ user?.email }}</p>
            <p><span class="text-slate-500">Member since:</span> {{ formatDate(user?.createdAt) }}</p>
            <p>
              <span class="text-slate-500">Role:</span>
              {{ user?.role.charAt(0).toUpperCase() + user?.role.slice(1) }}
            </p>
          </div>
          <div class="bg-slate-50 p-4 rounded-lg">
            <h3 class="font-medium text-slate-700 mb-2">Recent Activity</h3>
            <p><span class="text-slate-500">Last login:</span> {{ formatDate(user?.lastLogin) || 'Now' }}</p>
          </div>
        </div>
      </div>
      
      <!-- Firm Users Table (Only visible to managers and admins) -->
      <div v-if="user?.role === 'manager' || user?.role === 'admin'" class="mt-8">
        <div class="border-t border-gray-200 pt-6">
          <h3 class="text-xl font-bold text-slate-800 mb-4">Users in Your Firm</h3>
          
          <div v-if="firmUsers.length > 0" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gradient-to-r from-teal-500 to-indigo-600">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Username</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Full Name</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Email</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Role</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Member Since</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="firmUser in firmUsers" :key="firmUser._id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">{{ firmUser.username }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ firmUser.fullname }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ firmUser.email }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      :class="{
                        'bg-blue-100 text-blue-800': firmUser.role === 'admin',
                        'bg-green-100 text-green-800': firmUser.role === 'manager',
                        'bg-gray-100 text-gray-800': firmUser.role === 'user'
                      }"
                      class="px-2 py-1 rounded-full text-xs font-medium"
                    >
                      {{ firmUser.role }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(firmUser.createdAt) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="bg-slate-50 p-4 rounded-lg text-center">
            <p class="text-slate-600">No users found in your firm.</p>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center">
      <p>Loading...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useCookie } from '#app';
import type { User } from '~/types/user';

definePageMeta({
  requiresAuth: true,
});

const user: any = ref<User | null>(null);
const router = useRouter();
const mounted = ref(false);
const firmUsers = ref<any[]>([]);

async function fetchDashboard() {
  try {
    const token = useCookie('token').value;
    const response = await $fetch('/api/dashboard', {
      headers: { Authorization: `Bearer ${token}` },
    });
    user.value = response.user;
    
    // If user is a manager or admin, fetch firm users
    if (user.value?.role === 'manager' || user.value?.role === 'admin') {
      fetchFirmUsers();
    }
  } catch (error: any) {
    router.push('/login');
  }
}

async function fetchFirmUsers() {
  try {
    const token = useCookie('token').value;
    const response = await $fetch('/api/users/firm', {
      headers: { Authorization: `Bearer ${token}` },
    });
    firmUsers.value = response.users;
  } catch (error: any) {
    console.error('Error fetching firm users:', error);
  }
}

async function handleLogout() {
  try {
    await $fetch('/api/auth/logout', { method: 'POST' });
    useCookie('token').value = null;
    useCookie('refreshToken').value = null;
    router.push('/login');
  } catch (error) {
    console.error('Logout failed:', error);
    router.push('/login');
  }
}

function formatDate(dateString: any) {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(() => {
  mounted.value = true;
  fetchDashboard();
});
</script>