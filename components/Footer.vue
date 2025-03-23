<template>
  <footer class="fixed inset-x-0 bottom-0 w-full bg-gradient-to-r from-purple-500 via-pink-400 to-orange-400 shadow-lg py-1 px-6 z-50 flex items-center justify-between">
    <!-- Left-Aligned Links -->
    <div class="space-x-4">
      <NuxtLink to="/privacy-policy" class="text-white hover:text-orange-200 transition duration-300">
        Privacy Policy
      </NuxtLink>
      <NuxtLink to="/terms" class="text-white hover:text-orange-200 transition duration-300">
        Terms of Service
      </NuxtLink>
    </div>

    <!-- Center Text -->
    <p class="text-white text-xs font-bold">
      &copy; {{ new Date().getFullYear() }} My Nuxt3 App. All rights reserved.
    </p>

    <!-- Right-Aligned Links -->
    <div class="space-x-4">
      <NuxtLink to="/contact" class="text-white hover:text-orange-200 transition duration-300">
        Contact Us
      </NuxtLink>
      <NuxtLink to="/help" class="text-white hover:text-orange-200 transition duration-300">
        Help
      </NuxtLink>
    </div>
  </footer>
</template>

<script setup>
</script>