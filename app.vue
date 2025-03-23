<template>
  <div class="min-h-screen flex flex-col">
    <!-- Fixed Navbar at the top -->
    <Navbar class="fixed top-0 left-0 w-full z-50" />

    <div class="flex flex-1">
      <!-- Sidebar -->
      <aside :class="[
        'fixed top-0 bottom-0 left-0 z-40 bg-gradient-to-b from-green-400 via-blue-500 to-purple-500 shadow-lg transition-all duration-300',
        isSidebarCollapsed ? 'w-16' : 'w-60'
      ]" aria-label="Sidebar">
        <!-- Sidebar Content: Adding padding to adjust links below the navbar -->
        <div class="pt-16 flex flex-col items-center md:items-start space-y-6 px-3">
          <!-- Loop through navigation links -->
          <template v-for="nav in visibleNavLinks" :key="nav.label">
            <!-- Regular links without children -->
            <NuxtLink v-if="!nav.children" :to="nav.to"
              class="flex items-center text-white hover:text-blue-200 transition duration-300 group w-full"
              :title="isSidebarCollapsed ? nav.label : ''">
              <!-- Icon -->
              <div class="w-8 h-8 flex items-center justify-center text-xl">
                <component :is="nav.icon" class="w-6 h-6 text-white" />
              </div>
              <!-- Label -->
              <span v-if="!isSidebarCollapsed" class="ml-3 text-sm font-medium group-hover:underline">
                {{ nav.label }}
              </span>
            </NuxtLink>
            <!-- Links with children (nested navigation) -->
            <div v-else class="w-full">
              <!-- Parent item -->
              <div class="flex items-center text-white hover:text-blue-200 transition duration-300 group w-full cursor-pointer"
                @click="toggleNestedMenu(nav.label)"
                :title="isSidebarCollapsed ? nav.label : ''">
                <div class="w-8 h-8 flex items-center justify-center text-xl">
                  <component :is="nav.icon" class="w-6 h-6 text-white" />
                </div>
                <span v-if="!isSidebarCollapsed" class="ml-3 text-sm font-medium group-hover:underline flex-grow">
                  {{ nav.label }}
                </span>
                <ChevronDownIcon v-if="!isSidebarCollapsed" class="h-4 w-4 transition-transform" :class="{ 'rotate-180': openNestedMenus.includes(nav.label) }" />
              </div>
              <!-- Nested items -->
              <div v-if="openNestedMenus.includes(nav.label)"
                :class="[isSidebarCollapsed ? 'ml-2' : 'ml-8', 'space-y-2 mt-2', !isSidebarCollapsed && 'border-l-2 border-white/20 pl-2']">
                <NuxtLink v-for="child in nav.children" :key="child.label" :to="child.to"
                  class="flex items-center text-white/80 hover:text-blue-200 transition duration-300 group"
                  :title="isSidebarCollapsed ? child.label : ''">
                  <div class="w-6 h-6 flex items-center justify-center">
                    <component :is="child.icon" class="w-4 h-4 text-white" />
                  </div>
                  <span v-if="!isSidebarCollapsed" class="text-sm font-medium group-hover:underline ml-2">{{ child.label }}</span>
                </NuxtLink>
              </div>
            </div>
          </template>
        </div>

        <!-- Collapse/Expand Button -->
        <div
          class="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-white p-1 rounded-full cursor-pointer shadow-lg transition-transform duration-300"
          :class="{ 'rotate-180': !isSidebarCollapsed }" @click="toggleSidebar">
          <ChevronRightIcon class="w-6 h-6" />
        </div>
      </aside>

      <!-- Main content area -->
      <main :class="[isSidebarCollapsed ? 'ml-16' : 'ml-60']" class="flex-1 pt-20 pb-20">
        <!-- Nuxt will render your page component here -->
        <NuxtPage />
      </main>
    </div>

    <!-- Fixed Footer at the bottom -->
    <Footer class="fixed bottom-0 left-0 w-full z-50" />
  </div>
</template>

<script setup>
import Navbar from '~/components/Navbar.vue'
import Footer from '~/components/Footer.vue'
import { ref, computed } from 'vue'
import { HomeIcon, InformationCircleIcon, PhoneIcon, UserIcon, DocumentTextIcon, ChevronRightIcon, ChevronDownIcon, BanknotesIcon, HeartIcon, DocumentDuplicateIcon, ChartBarIcon } from '@heroicons/vue/24/outline'

// Sidebar collapse state (default to collapsed)
const isSidebarCollapsed = ref(true)

// Toggle the sidebar between expanded and collapsed
function toggleSidebar() {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

// Authentication state (mocked as an example)
const tokenCookie = useCookie('token')

// isAuthenticated returns true if a token exists.
const isAuthenticated = computed(() => Boolean(tokenCookie.value))

// Navigation state
const openNestedMenus = ref([])

// Toggle nested menu
function toggleNestedMenu(label) {
  const index = openNestedMenus.value.indexOf(label)
  if (index === -1) {
    openNestedMenus.value.push(label)
  } else {
    openNestedMenus.value.splice(index, 1)
  }
}

// Navigation links with SVG icons
const navLinks = [
  {
    label: 'Home',
    to: '/',
    icon: HomeIcon,
    restricted: false
  },
  {
    label: 'About',
    to: '/about',
    icon: InformationCircleIcon,
    restricted: false
  },
  {
    label: 'Contact',
    to: '/contact',
    icon: PhoneIcon,
    restricted: false
  },
  {
    label: 'Profile',
    to: '/dashboard',
    icon: UserIcon,
    restricted: true
  },
  {
    label: 'Notes',
    to: '/notes',
    icon: DocumentTextIcon,
    restricted: true
  },
  {
    label: 'Docs',
    to: '/documents',
    icon: DocumentTextIcon,
    restricted: true
  },
  {
    label: 'Wages',
    icon: BanknotesIcon,
    restricted: true,
    children: [
      {
        label: 'Wages Management',
        to: '/wages',
        icon: HeartIcon
      },
      {
        label: 'Master Roll',
        to: '/wages/master_roll',
        icon: DocumentDuplicateIcon
      },
      {
        label: 'Wages Report',
        to: '/wages/report',
        icon: ChartBarIcon
      }
    ]
  }
]

// Filter navigation links based on authentication state
const visibleNavLinks = computed(() =>
  navLinks.filter((nav) => (nav.restricted ? isAuthenticated.value : true))
)
</script>

<style>
/* Additional styles for better sidebar and content alignment */
body {
  margin: 0;
  /* Remove default margin for better alignment */
}

main {
  transition: margin-left 0.3s ease;
  /* Smooth transition for content area */
}
</style>

