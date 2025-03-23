<template>
  <nav class="w-full fixed top-0 bg-gradient-to-r from-teal-400 via-indigo-500 to-teal-400 shadow py-4 px-6 z-50">
    <div class="container mx-auto flex justify-between items-center">
      <!-- Brand / Logo -->
      <div class="font-bold text-xl text-white drop-shadow">
        My Nuxt3 App
      </div>

      <!-- Add in template section after the brand/logo div -->
      <div v-if="isAuthenticated" class="hidden md:flex items-center space-x-4 text-sm text-white">
        <div class="flex flex-row items-center space-x-3">
          <span>Token: {{ tokenTimeLeft }}</span>
          <span>Session: {{ refreshTimeLeft }}</span>
        </div>
      </div>

      <!-- Hamburger Menu Icon for Mobile -->
      <button class="text-white focus:outline-none md:hidden" @click="toggleMenu" aria-label="Toggle menu">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>

      <!-- Desktop Navigation Links -->
      <div class="hidden md:flex space-x-4">
        <NuxtLink to="/" class="text-white hover:text-teal-200 transition duration-300">Home</NuxtLink>
        <NuxtLink to="/about" class="text-white hover:text-teal-200 transition duration-300">About</NuxtLink>
        <NuxtLink to="/contact" class="text-white hover:text-teal-200 transition duration-300">Contact</NuxtLink>

        <template v-if="isAuthenticated">
          <NuxtLink to="/dashboard" class="text-white hover:text-teal-200 transition duration-300">Dashboard</NuxtLink>
          <NuxtLink to="/documents" class="text-white hover:text-teal-200 transition duration-300">Docs</NuxtLink>
          <NuxtLink to="/notes" class="text-white hover:text-teal-200 transition duration-300">Notes</NuxtLink>
          <NuxtLink v-if="isAdmin" to="/admin" class="text-white hover:text-teal-200 transition duration-300">Admin
            Panel</NuxtLink>

          <!-- Wages Dropdown -->
          <div class="relative inline-block text-left">
            <button @click="toggleWagesDropdown"
              class="text-white hover:text-teal-200 transition duration-300 focus:outline-none inline-flex items-center">
              Wages
              <svg class="ml-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div v-show="isWagesDropdownOpen"
              class="absolute z-50 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <div class="py-1">
                <NuxtLink to="/wages/master_roll"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100 hover:text-indigo-900"
                  @click="isWagesDropdownOpen = false">
                  Master Roll
                </NuxtLink>
                <NuxtLink to="/wages"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100 hover:text-indigo-900"
                  @click="isWagesDropdownOpen = false">
                  Wages Management
                </NuxtLink>
                <NuxtLink to="/wages/report"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100 hover:text-indigo-900"
                  @click="isWagesDropdownOpen = false">
                  Wages Report
                </NuxtLink>
              </div>
            </div>
          </div>

          <NuxtLink to="/nse" class="text-white hover:text-teal-200 transition duration-300">NSE</NuxtLink>
          <NuxtLink to="/documents" class="text-white hover:text-teal-200 transition duration-300">Docs</NuxtLink>
          <NuxtLink to="/notes" class="text-white hover:text-teal-200 transition duration-300">Notes</NuxtLink>
          <button @click="handleLogout"
            class="text-white hover:text-teal-200 transition duration-300 focus:outline-none">
            Logout
          </button>
        </template>
        <template v-else>
          <NuxtLink to="/login" class="text-white hover:text-teal-200 transition duration-300">Login</NuxtLink>
          <NuxtLink to="/register" class="text-white hover:text-teal-200 transition duration-300">Register</NuxtLink>
        </template>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-if="isMenuOpen" class="md:hidden bg-gradient-to-r from-teal-400 via-indigo-500 to-teal-400 py-4 px-6">
      <NuxtLink to="/" class="block text-white hover:text-teal-200 transition duration-300 mb-2" @click="isMenuOpen = false">Home</NuxtLink>
      <NuxtLink to="/about" class="block text-white hover:text-teal-200 transition duration-300 mb-2" @click="isMenuOpen = false">About</NuxtLink>
      <NuxtLink to="/contact" class="block text-white hover:text-teal-200 transition duration-300 mb-2" @click="isMenuOpen = false">Contact
      </NuxtLink>

      <template v-if="isAuthenticated">
        <NuxtLink to="/documents" class="block text-white hover:text-teal-200 transition duration-300 mb-2" @click="isMenuOpen = false">Documents
        </NuxtLink>
        <NuxtLink to="/notes" class="block text-white hover:text-teal-200 transition duration-300 mb-2" @click="isMenuOpen = false">Notes</NuxtLink>
        <NuxtLink to="/wages" class="block text-white hover:text-teal-200 transition duration-300 mb-2" @click="isMenuOpen = false">Wages</NuxtLink>
        <NuxtLink to="/wages/master_roll" class="block text-white hover:text-teal-200 transition duration-300 mb-2" @click="isMenuOpen = false">
          Master Roll</NuxtLink>
        <NuxtLink to="/wages/report" class="block text-white hover:text-teal-200 transition duration-300 mb-2" @click="isMenuOpen = false">Wages
          Report</NuxtLink>
        <NuxtLink to="/dashboard" class="block text-white hover:text-teal-200 transition duration-300 mb-2" @click="isMenuOpen = false">Dashboard
        </NuxtLink>
        <NuxtLink v-if="isAdmin" to="/admin" class="block text-white hover:text-teal-200 transition duration-300 mb-2" @click="isMenuOpen = false">
          Admin Panel</NuxtLink>
        <button @click="handleLogout"
          class="block text-white hover:text-teal-200 transition duration-300 focus:outline-none">
          Logout
        </button>
      </template>
      <template v-else>
        <NuxtLink to="/login" class="block text-white hover:text-teal-200 transition duration-300 mb-2" @click="isMenuOpen = false">Login</NuxtLink>
        <NuxtLink to="/register" class="block text-white hover:text-teal-200 transition duration-300 mb-2" @click="isMenuOpen = false">Register
        </NuxtLink>
      </template>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useCookie, useRouter } from '#app'



const router = useRouter()
const isMenuOpen = ref(false)
const isWagesDropdownOpen = ref(false)

// Fetch the access token from cookies for both server and client.
const tokenCookie = useCookie('token')
const refreshCookie = useCookie('refreshToken')

// Token timer state
const tokenTimeLeft = ref('')
const refreshTimeLeft = ref('')

// Function to decode JWT and get expiration time
const getTokenExpiration = (token: string | null | undefined): number | null => {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000; // Convert to milliseconds
  } catch {
    return null;
  }
};

// Update timer display
const updateTimers = () => {
  const now = Date.now()

  // Update access token timer
  const tokenExp = getTokenExpiration(tokenCookie.value)
  if (tokenExp) {
    const diff = tokenExp - now
    if (diff > 0) {
      const minutes = Math.floor(diff / 60000)
      const seconds = Math.floor((diff % 60000) / 1000)
      tokenTimeLeft.value = `${minutes}m ${seconds}s`
    } else {
      tokenTimeLeft.value = 'Expired'
    }
  }

  // Update refresh token timer
  const refreshExp = getTokenExpiration(refreshCookie.value)
  if (refreshExp) {
    const diff = refreshExp - now
    if (diff > 0) {
      const days = Math.floor(diff / (24 * 60 * 60 * 1000))
      const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
      const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000))
      const seconds = Math.floor((diff % (60 * 1000)) / 1000)
      refreshTimeLeft.value = `${days}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    } else {
      refreshTimeLeft.value = 'Expired'
      handleLogout()
    }
  }
}

// Start timer when component is mounted
onMounted(() => {
  document.addEventListener('click', closeWagesDropdown)
  // Update timers every second
  const timerInterval = setInterval(updateTimers, 1000)
  // Initial update
  updateTimers()

  // Cleanup interval on unmount
  onUnmounted(() => {
    document.removeEventListener('click', closeWagesDropdown)
    clearInterval(timerInterval)
  })
})

// isAuthenticated returns true if a token exists.
const isAuthenticated = computed(() => Boolean(tokenCookie.value))

// Check if user is admin
const isAdmin = computed(() => {
  const token = tokenCookie.value
  if (!token) return false
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.role === 'admin'
  } catch {
    return false
  }
})

// Toggle mobile menu
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

// Toggle wages dropdown
const toggleWagesDropdown = () => {
  isWagesDropdownOpen.value = !isWagesDropdownOpen.value
}

// Close dropdown when clicking outside
const closeWagesDropdown = (event: any) => {
  if (!event.target.closest('.relative')) {
    isWagesDropdownOpen.value = false
  }
}

// Handle logout
const handleLogout = async () => {
  try {
    await $fetch('/api/auth/logout', { method: 'POST' })
    tokenCookie.value = null
    router.push('/login')
  } catch (error) {
    console.error('Logout failed:', error)
    router.push('/login')
  }
}

onMounted(() => {
  document.addEventListener('click', closeWagesDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeWagesDropdown)
})
</script>
