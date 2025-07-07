<template>
  <nav class="navbar">
    <div class="navbar-content">
      <div class="navbar-left">
        <h1 class="app-title">
          <span class="health-icon">💚</span>
          WellnessApp
        </h1>
      </div>
      
      <div class="navbar-right">
        <div class="alerts-badge" @click="toggleAlerts">
          <span class="icon">🔔</span>
          <span v-if="unreadCount > 0" class="badge">{{ unreadCount }}</span>
        </div>
        
        <div class="user-menu" @click="toggleUserMenu">
          <span class="user-avatar">{{ userInitials }}</span>
          <span class="user-name">{{ authStore.user?.name }}</span>
          <span class="dropdown-icon">⌄</span>
        </div>
        
        <!-- Dropdown de alertas -->
        <div v-if="showAlerts" class="alerts-dropdown">
          <div class="alerts-header">
            <h3>Notificaciones</h3>
            <button @click="markAllAsRead" class="btn-link">Marcar todas como leídas</button>
          </div>
          <div class="alerts-list">
            <div v-for="alert in healthStore.alerts.slice(0, 5)" :key="alert.id" 
                 class="alert-item" :class="{ 'unread': !alert.read }"
                 @click="markAsRead(alert.id)">
              <div class="alert-content">
                <div class="alert-title">{{ alert.title }}</div>
                <div class="alert-message">{{ alert.message }}</div>
                <div class="alert-time">{{ formatTime(alert.timestamp) }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Dropdown de usuario -->
        <div v-if="showUserMenu" class="user-dropdown">
          <div class="user-info">
            <div class="user-details">
              <div class="user-name-full">{{ authStore.user?.name }}</div>
              <div class="user-role">{{ authStore.user?.department }}</div>
            </div>
          </div>
          <div class="dropdown-divider"></div>
          <button @click="logout" class="dropdown-item logout">
            <span>🚪</span>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useHealthStore } from '../../stores/health'

export default {
  name: 'Navbar',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const healthStore = useHealthStore()
    
    const showAlerts = ref(false)
    const showUserMenu = ref(false)
    
    const unreadCount = computed(() => healthStore.unreadAlerts.length)
    
    const userInitials = computed(() => {
      const name = authStore.user?.name || ''
      return name.split(' ').map(n => n[0]).join('').toUpperCase()
    })
    
    const toggleAlerts = () => {
      showAlerts.value = !showAlerts.value
      showUserMenu.value = false
    }
    
    const toggleUserMenu = () => {
      showUserMenu.value = !showUserMenu.value
      showAlerts.value = false
    }
    
    const markAsRead = (alertId) => {
      healthStore.markAlertAsRead(alertId)
    }
    
    const markAllAsRead = () => {
      healthStore.alerts.forEach(alert => {
        if (!alert.read) healthStore.markAlertAsRead(alert.id)
      })
    }
    
    const logout = () => {
      authStore.logout()
      router.push('/login')
    }
    
    const formatTime = (timestamp) => {
      const date = new Date(timestamp)
      const now = new Date()
      const diffInMinutes = Math.floor((now - date) / (1000 * 60))
      
      if (diffInMinutes < 1) return 'Ahora'
      if (diffInMinutes < 60) return `${diffInMinutes}m`
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`
      return `${Math.floor(diffInMinutes / 1440)}d`
    }
    
    const handleClickOutside = (event) => {
      if (!event.target.closest('.alerts-badge') && !event.target.closest('.alerts-dropdown')) {
        showAlerts.value = false
      }
      if (!event.target.closest('.user-menu') && !event.target.closest('.user-dropdown')) {
        showUserMenu.value = false
      }
    }
    
    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })
    
    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })
    
    return {
      authStore,
      healthStore,
      showAlerts,
      showUserMenu,
      unreadCount,
      userInitials,
      toggleAlerts,
      toggleUserMenu,
      markAsRead,
      markAllAsRead,
      logout,
      formatTime
    }
  }
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: var(--white);
  border-bottom: 1px solid var(--border-light);
  box-shadow: var(--shadow);
  z-index: 1000;
}

.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.app-title {
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: 700;
  color: var(--primary-blue);
  margin: 0;
}

.health-icon {
  margin-right: 8px;
  font-size: 24px;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 20px;
  position: relative;
}

.alerts-badge {
  position: relative;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.2s ease;
}

.alerts-badge:hover {
  background: var(--light-gray);
}

.icon {
  font-size: 20px;
}

.badge {
  position: absolute;
  top: 0;
  right: 0;
  background: var(--primary-green);
  color: white;
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 12px;
  font-weight: 600;
  min-width: 18px;
  text-align: center;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background 0.2s ease;
}

.user-menu:hover {
  background: var(--light-gray);
}

.user-avatar {
  width: 32px;
  height: 32px;
  background: var(--primary-blue);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
}

.user-name {
  font-weight: 500;
  color: var(--text-dark);
}

.dropdown-icon {
  color: var(--text-gray);
  font-size: 14px;
}

.alerts-dropdown,
.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-light);
  min-width: 300px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 1001;
}

.alerts-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid var(--border-light);
}

.alerts-header h3 {
  margin: 0;
  font-size: 16px;
  color: var(--text-dark);
}

.btn-link {
  background: none;
  border: none;
  color: var(--primary-blue);
  cursor: pointer;
  font-size: 12px;
}

.alert-item {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-light);
  cursor: pointer;
  transition: background 0.2s ease;
}

.alert-item:hover {
  background: var(--light-gray);
}

.alert-item.unread {
  background: var(--light-blue);
}

.alert-title {
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 4px;
}

.alert-message {
  font-size: 14px;
  color: var(--text-gray);
  margin-bottom: 4px;
}

.alert-time {
  font-size: 12px;
  color: var(--text-gray);
}

.user-info {
  padding: 16px;
}

.user-name-full {
  font-weight: 600;
  color: var(--text-dark);
}

.user-role {
  font-size: 14px;
  color: var(--text-gray);
}

.dropdown-divider {
  height: 1px;
  background: var(--border-light);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s ease;
  color: var(--text-dark);
}

.dropdown-item:hover {
  background: var(--light-gray);
}

.dropdown-item.logout {
  color: #ef4444;
}

@media (max-width: 768px) {
  .user-name {
    display: none;
  }
  
  .alerts-dropdown,
  .user-dropdown {
    min-width: 250px;
  }
}
</style>