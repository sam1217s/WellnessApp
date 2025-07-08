<template>
  <div class="app">
    <Navbar v-if="isAuthenticated" 
            :mobile-menu-open="mobileMenuOpen" 
            @toggle-mobile-menu="toggleMobileMenu" />
    <div class="app-content" :class="{ 
      'with-sidebar': isAuthenticated,
      'sidebar-expanded': mobileMenuOpen
    }">
      <Sidebar v-if="isAuthenticated" :mobile-open="mobileMenuOpen" @close-mobile="closeMobileMenu" />
      <main class="main-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useAuthStore } from './stores/auth'
import Navbar from './components/common/Navbar.vue'
import Sidebar from './components/common/Sidebar.vue'

export default {
  name: 'App',
  components: {
    Navbar,
    Sidebar
  },
  setup() {
    const authStore = useAuthStore()
    const mobileMenuOpen = ref(false)
    
    const isAuthenticated = computed(() => authStore.isAuthenticated)
    
    const toggleMobileMenu = () => {
      mobileMenuOpen.value = !mobileMenuOpen.value
    }
    
    const closeMobileMenu = () => {
      mobileMenuOpen.value = false
    }
    
    return {
      isAuthenticated,
      mobileMenuOpen,
      toggleMobileMenu,
      closeMobileMenu
    }
  }
}
</script>

<style>
.app {
  min-height: 100vh;
  background: #f8fffe;
}

.app-content {
  display: flex;
  min-height: calc(100vh - 60px);
}

.app-content.with-sidebar {
  margin-top: 60px;
}

.main-content {
  flex: 1;
  padding: 20px;
  margin-left: 0;
  transition: margin-left 0.3s ease;
}

.with-sidebar .main-content {
  margin-left: 70px;
  transition: margin-left 0.3s ease;
}

.with-sidebar.sidebar-expanded .main-content {
  margin-left: 250px;
}

@media (min-width: 769px) {
  .with-sidebar.sidebar-expanded .main-content {
    margin-left: 250px;
  }
}

@media (max-width: 768px) {
  .with-sidebar .main-content {
    margin-left: 0;
  }
  
  .with-sidebar.sidebar-expanded .main-content {
    margin-left: 0;
  }
}
</style>