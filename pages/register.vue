<template>
  <div class="h-screen relative flex items-center justify-center overflow-hidden bg-[url('https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center"
  style="height: calc(100vh - 80px); margin-top: -25px; margin-bottom: -60px;">
    <div v-if="mounted">
      <div class="relative z-10 w-full md:w-[800px] px-4">
        <div class="bg-white/15 backdrop-blur-xl rounded-2xl p-9 shadow-2xl border-2 border-white/30">
          <div class="mb-9 text-center">
            <h1 class="text-4xl font-bold text-white mb-2">Create Account</h1>
            <p class="text-white/90 text-lg">Join us to start your journey</p>
          </div>

          <form @submit.prevent="handleRegister" class="grid grid-cols-2 gap-x-4 gap-y-3">
            <div>
              <label class="block text-base font-medium text-white/90 mb-2">Username</label>
              <div class="relative">
                <input v-model="username" type="text" 
                  class="w-full px-4 py-2 bg-white/25 backdrop-blur-md rounded-xl border-2 border-white/40 text-white placeholder-white/60 focus:ring-2 focus:ring-white/60 focus:outline-none text-base transition-all duration-300 h-10"
                  placeholder="Choose your username" required>
                <span class="absolute right-4 top-2">
                  <UserIcon class="w-5 h-5 text-white/60" />
                </span>
              </div>
            </div>

            <div>
              <label class="block text-base font-medium text-white/90 mb-2">Email</label>
              <div class="relative">
                <input v-model="email" type="email" 
                  class="w-full px-4 py-2 bg-white/25 backdrop-blur-md rounded-xl border-2 border-white/40 text-white placeholder-white/60 focus:ring-2 focus:ring-white/60 focus:outline-none text-base transition-all duration-300 h-10"
                  placeholder="Enter your email" required>
                <span class="absolute right-4 top-2">
                  <EnvelopeIcon class="w-5 h-5 text-white/60" />
                </span>
              </div>
            </div>

            <div>
              <label class="block text-base font-medium text-white/90 mb-2">Full Name</label>
              <div class="relative">
                <input v-model="fullname" type="text" 
                  class="w-full px-4 py-2 bg-white/25 backdrop-blur-md rounded-xl border-2 border-white/40 text-white placeholder-white/60 focus:ring-2 focus:ring-white/60 focus:outline-none text-base transition-all duration-300 h-10"
                  placeholder="Enter your full name" required>
                <span class="absolute right-4 top-2">
                  <IdentificationIcon class="w-5 h-5 text-white/60" />
                </span>
              </div>
            </div>

            <div>
              <label class="block text-base font-medium text-white/90 mb-2">Password</label>
              <div class="relative">
                <input v-model="password" type="password" 
                  class="w-full px-4 py-2 bg-white/25 backdrop-blur-md rounded-xl border-2 border-white/40 text-white placeholder-white/60 focus:ring-2 focus:ring-white/60 focus:outline-none text-base transition-all duration-300 h-10"
                  placeholder="Choose your password" required>
                <span class="absolute right-4 top-2">
                  <LockClosedIcon class="w-5 h-5 text-white/60" />
                </span>
              </div>
            </div>

            <div>
              <label class="block text-base font-medium text-white/90 mb-2">Select Firm</label>
              <FirmAutocomplete @update:selectedFirm="handleFirmSelect" class="glass-input" />
              <div v-if="!selectedFirm && formSubmitted" class="text-red-400 text-sm mt-2">Please select a firm</div>
            </div>

            <div>
              <label class="block text-base font-medium text-white/90 mb-2">Manager Access Code (optional)</label>
              <div class="relative">
                <input v-model="managerCode" type="text" 
                  class="w-full px-4 py-2 bg-white/25 backdrop-blur-md rounded-xl border-2 border-white/40 text-white placeholder-white/60 focus:ring-2 focus:ring-white/60 focus:outline-none text-base transition-all duration-300 h-10"
                  placeholder="Enter code if you have one">
                <span class="absolute right-4 top-2">
                  <KeyIcon class="w-5 h-5 text-white/60" />
                </span>
              </div>
              <div class="text-sm text-white/70 mt-2">Leave empty to register as a regular user</div>
            </div>

            <div class="col-span-2">
              <button type="submit" 
                class="w-full py-3 bg-white/20 backdrop-blur-md text-white rounded-xl font-semibold text-base hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/60 transition-all duration-300 mt-4">
                Create Account
              </button>

              <div v-if="errorMsg" class="text-red-400 text-center mt-3 bg-white/10 backdrop-blur-md rounded-lg p-2">{{ errorMsg }}</div>
              <div v-if="successMsg" class="text-emerald-400 text-center mt-3 bg-white/10 backdrop-blur-md rounded-lg p-2">{{ successMsg }}</div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { UserIcon, EnvelopeIcon, LockClosedIcon, IdentificationIcon, KeyIcon } from '@heroicons/vue/24/outline';

const mounted = ref(false);
onMounted(() => {
  mounted.value = true;
});

const username = ref('');
const email = ref('');
const fullname = ref('');
const password = ref('');
const role = ref('user');
const managerCode = ref('');
const errorMsg = ref('');
const successMsg = ref('');
const selectedFirm = ref<any>(null);
const formSubmitted = ref(false);
const router = useRouter();

const MANAGER_ACCESS_CODE = 'MGR2024';

function handleFirmSelect(firm: any) {
  selectedFirm.value = firm;
}

async function handleRegister() {
  errorMsg.value = '';
  successMsg.value = '';
  formSubmitted.value = true;
  
  if (!selectedFirm.value) {
    errorMsg.value = 'Please select a firm';
    return;
  }
  try {
    const response = await $fetch('/api/auth/register', {
      method: 'POST',
      body: { 
        username: username.value, 
        email: email.value, 
        fullname: fullname.value, 
        password: password.value,
        firmId: selectedFirm.value._id,
        managerCode: managerCode.value
      }
    });
    
    successMsg.value = response.message;
    // Redirect to login after registration
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  } catch (error: any) {
    errorMsg.value = error.data.message;
  }
}
</script>

<style scoped>
.glass-input :deep(.border) {
  @apply bg-white/25 backdrop-blur-md border-white/40 text-white placeholder-white/60;
}

.glass-input :deep(input) {
  @apply bg-white/25 backdrop-blur-md text-white placeholder-white/60;
}

.glass-input :deep(.suggestions) {
  @apply bg-white/20 backdrop-blur-md border-white/40;
}

.glass-input :deep(.suggestion-item) {
  @apply text-white hover:bg-white/20;
}
</style>
