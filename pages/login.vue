<template>
  <div class="h-screen relative flex items-center justify-center overflow-hidden bg-[url('https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center"
  style="height: calc(100vh - 80px); margin-top: -25px; margin-bottom: -60px;">
    <!-- Background Image Container -->
   

    <div v-if="mounted">
      <!-- Login Card with increased horizontal width (800px on medium and up) -->
      <div class="relative z-10 w-full md:w-[800px] px-4">
        <div class="bg-white/15 backdrop-blur-xl rounded-2xl p-9 shadow-2xl border-2 border-white/30">
          <!-- Card Header -->
          <div class="mb-9 text-center">
            <h1 class="text-4xl font-bold text-white mb-2">Welcome Back</h1>
            <p class="text-white/90 text-lg">Sign in to continue your journey</p>
          </div>

          <!-- Login Form -->
          <form class="space-y-5" @submit.prevent="handleLogin">
            <!-- Username Field -->
            <div>
              <label class="block text-base font-medium text-white/90 mb-2">Username</label>
              <div class="relative">
                <input 
                  v-model="username"
                  type="text"
                  class="w-full px-4 py-2 bg-white/25 backdrop-blur-md rounded-xl border-2 border-white/40 text-white placeholder-white/60 focus:ring-2 focus:ring-white/60 focus:outline-none text-base transition-all duration-300 h-10"
                  placeholder="Enter your username"
                />
                <span class="absolute right-4 top-2">
                  <EnvelopeIcon class="w-5 h-5 text-white/60" />
                </span>
              </div>
            </div>

            <!-- Password Field -->
            <div>
              <label class="block text-base font-medium text-white/90 mb-2">Password</label>
              <div class="relative">
                <input 
                  v-model="password"
                  type="password"
                  class="w-full px-4 py-2 bg-white/25 backdrop-blur-md rounded-xl border-2 border-white/40 text-white placeholder-white/60 focus:ring-2 focus:ring-white/60 focus:outline-none text-base transition-all duration-300 h-10"
                  placeholder="Enter your password"
                />
                <span class="absolute right-4 top-2">
                  <LockClosedIcon class="w-5 h-5 text-white/60" />
                </span>
              </div>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              class="w-full py-2 bg-white/20 backdrop-blur-md text-white rounded-xl font-semibold text-base hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/60 transition-all duration-300">
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else class="relative z-10 w-full md:w-[800px] px-4">
      <div class="bg-white/15 backdrop-blur-xl rounded-2xl p-9 shadow-2xl border-2 border-white/30">
        <div class="text-center py-8 text-white/80">
          Loading...
        </div>
      </div>
    </div>
  </div>
</template>







<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useCookie } from '#app'

const router = useRouter()
const mounted = ref(false)
const username = ref('')
const password = ref('')
const errorMsg = ref('')

import { EnvelopeIcon, LockClosedIcon } from '@heroicons/vue/24/outline'



onMounted(() => {
  // Mark component as mounted on the client.
  mounted.value = true

  // Check if a token already exists, and if so, redirect to the dashboard.
  const token = useCookie('token').value
  if (token) {
    router.push('/dashboard')
  }
})

async function handleLogin() {
  errorMsg.value = ''
  try {
    // Attempt login via API
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { username: username.value, password: password.value }
    })

    // Save received tokens using cookies.
    const accessCookie = useCookie('token')
    accessCookie.value = response.accessToken

    const refreshCookie = useCookie('refreshToken')
    refreshCookie.value = response.refreshToken

    // Redirect to the dashboard after successful login.
    router.push('/dashboard')
  } catch (error: any) {
    errorMsg.value = error.data?.message || 'Login failed'
  }
}
</script>

<style>
/* Add custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  @apply bg-white/10;
}

::-webkit-scrollbar-thumb {
  @apply bg-white/30 rounded-full;
}

/* Smooth transitions */
* {
  @apply transition-colors duration-200;
}
</style>