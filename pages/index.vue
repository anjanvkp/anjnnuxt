<template>
  <div
    class="relative flex flex-col items-center justify-center bg-[url('/img1.jpg')] bg-cover bg-center"
    style="height: calc(100vh - 80px); margin-top: -25px; margin-bottom: -60px;"
  >
    <!-- Content -->
    <h1 class="text-4xl font-bold mb-4 text-white shadow-lg">Welcome to your Nuxt3 application!</h1>
    <p class="text-lg text-white shadow-md">Enjoy building with Nuxt3.</p>
  </div>
</template>

<script setup lang="ts">
// No additional code needed unless required
</script>

<style scoped>
/* Reset margins and paddings to ensure no gaps */
body {
  margin: 0;
  padding: 0;
}

/* Make sure the container aligns with the top */
.relative {
  margin-top: 0;
}
</style>
