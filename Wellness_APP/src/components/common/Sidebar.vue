<template>
  <div>
    <!-- Overlay para móvil -->
    <div v-if="mobileOpen" class="mobile-overlay" @click="handleNavClick"></div>
    
    <aside class="sidebar" 
           :class="{ 
             'expanded': isExpanded || mobileOpen, 
             'mobile-open': mobileOpen 
           }" 
           @mouseenter="expandSidebar" 
           @mouseleave="collapseSidebar">
      <nav class="sidebar-nav">
        <router-link 
          v-for="item in menuItems" 
          :key="item.name"
          :to="item.path"
          class="nav-item"
          :class="{ 'active': $route.name === item.name }"
          :data-tooltip="item.label"
          @click="handleNavClick"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-label">{{ item.label }}</span>
          <span v-if="item.badge" class="nav-badge">{{ item.badge }}</span>
        </router-link>
      </nav>
      
      <div class="sidebar-footer">
        <div class="user-stats">
          <div class="stat-item">
            <span class="stat-icon">⭐</span>
            <div class="stat-info">
              <div class="stat-value">{{ rewardsStore.userPoints }}</div>
              <div class="stat-label">Puntos</div>
            </div>
          </div>
          <div class="stat-item">
            <span class="stat-icon">🏆</span>
            <div class="stat-info">
              <div class="stat-value">Nivel {{ rewardsStore.level }}</div>
              <div class="stat-label">Actual</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useHealthStore } from '../../stores/health'
import { useRewardsStore } from '../../stores/rewards'

export default {
  name: 'Sidebar',
  props: {
    mobileOpen: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close-mobile'],
  setup(props, { emit }) {
    const authStore = useAuthStore()
    const healthStore = useHealthStore()
    const rewardsStore = useRewardsStore()
    
    const isExpanded = ref(false)
    
    const menuItems = computed(() => {
      const baseItems = [
        {
          name: 'Dashboard',
          path: '/',
          label: 'Panel Principal',
          icon: '🏠'
        },
        {
          name: 'Activity',
          path: '/activity',
          label: 'Actividad',
          icon: '📊'
        },
        {
          name: 'Rewards',
          path: '/rewards',
          label: 'Recompensas',
          icon: '🎁',
          badge: rewardsStore.availableChallenges.length
        }
      ]
      
      if (authStore.isAdmin) {
        baseItems.push({
          name: 'Admin',
          path: '/admin',
          label: 'Administración',
          icon: '⚙️'
        })
      }
      
      return baseItems
    })
    
    const expandSidebar = () => {
      if (window.innerWidth > 768) {
        // En desktop, solo hover si no está forzado abierto por el botón
        if (!props.mobileOpen) {
          isExpanded.value = true
        }
      }
    }
    
    const collapseSidebar = () => {
      if (window.innerWidth > 768) {
        // En desktop, solo colapsar si no está forzado abierto por el botón
        if (!props.mobileOpen) {
          isExpanded.value = false
        }
      }
    }
    
    const handleNavClick = () => {
      // Cerrar menú móvil cuando se hace clic en un enlace
      if (window.innerWidth <= 768) {
        emit('close-mobile')
      }
    }
    
    return {
      menuItems,
      rewardsStore,
      isExpanded,
      expandSidebar,
      collapseSidebar,
      handleNavClick
    }
  }
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 60px;
  width: 70px;
  height: calc(100vh - 60px);
  background: var(--white);
  border-right: 1px solid var(--border-light);
  display: flex;
  flex-direction: column;
  z-index: 999;
  transition: width 0.3s ease;
  overflow: hidden;
}

.sidebar.expanded {
  width: 250px;
  box-shadow: var(--shadow-md);
}

@media (max-width: 768px) {
  .sidebar.expanded {
    transform: translateX(0);
    box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
  }
}

.sidebar-nav {
  flex: 1;
  padding: 20px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  text-decoration: none;
  color: var(--text-gray);
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
  position: relative;
  white-space: nowrap;
  min-height: 48px;
}

.nav-item:hover {
  background: var(--light-blue);
  color: var(--primary-blue);
}

.nav-item.active {
  background: var(--light-blue);
  color: var(--primary-blue);
  border-left-color: var(--primary-blue);
  font-weight: 600;
}

.nav-icon {
  font-size: 18px;
  width: 70px;
  text-align: center;
  flex-shrink: 0;
}

.nav-label {
  flex: 1;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
  margin-left: -50px;
}

.sidebar.expanded .nav-label {
  opacity: 1;
  transform: translateX(0);
  margin-left: 0;
}

.nav-badge {
  background: var(--primary-green);
  color: white;
  border-radius: 10px;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 600;
  min-width: 20px;
  text-align: center;
  margin-right: 15px;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.3s ease;
}

.sidebar.expanded .nav-badge {
  opacity: 1;
  transform: scale(1);
}

.sidebar-footer {
  padding: 20px 0;
  border-top: 1px solid var(--border-light);
  overflow: hidden;
}

.user-stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 15px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  background: var(--light-green);
  border-radius: 8px;
  min-height: 44px;
  min-width: 35px;
  transition: all 0.3s ease;
}

.sidebar:not(.expanded) .stat-item {
  justify-content: center;
  padding: 8px 4px;
  margin: 0 8px;
  gap: 0;
}

.stat-icon {
  font-size: 20px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.sidebar:not(.expanded) .stat-icon {
  width: 100%;
  height: 100%;
  padding-left: 38px;
}

.stat-info {
  flex: 1;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
}

.sidebar.expanded .stat-info {
  opacity: 1;
  transform: translateX(0);
}

.stat-value {
  font-weight: 600;
  color: var(--text-dark);
  font-size: 14px;
  line-height: 1.2;
}

.stat-label {
  font-size: 12px;
  color: var(--text-gray);
  line-height: 1;
}

/* Tooltip para modo colapsado */
.sidebar:not(.expanded) .nav-item {
  position: relative;
}

.sidebar:not(.expanded) .nav-item::after {
  content: attr(data-tooltip);
  position: absolute;
  left: 70px;
  top: 50%;
  transform: translateY(-50%);
  background: var(--text-dark);
  color: var(--white);
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  z-index: 1000;
}

.sidebar:not(.expanded) .nav-item:hover::after {
  opacity: 1;
}

/* Responsive design */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    width: 250px;
    box-shadow: none;
  }
  
  .sidebar.mobile-open {
    transform: translateX(0);
    box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
  }
  
  /* En móvil, mostrar siempre el contenido */
  .sidebar .nav-label,
  .sidebar .stat-info {
    opacity: 1;
    transform: translateX(0);
    margin-left: 0;
  }
  
  .sidebar .nav-badge {
    opacity: 1;
    transform: scale(1);
  }
}

/* Animación de entrada */
@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

.sidebar {
  animation: slideInLeft 0.3s ease-out;
}

/* Estados de hover mejorados */
.nav-item:hover .nav-icon {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}

.sidebar.expanded .nav-item:hover {
  padding-left: 5px;
}

/* Efecto de pulso para badges */
.nav-badge {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.sidebar.expanded .nav-badge {
  animation: none;
}

/* Overlay móvil */
.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
  display: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

@media (max-width: 768px) {
  .mobile-overlay {
    display: block;
    opacity: 1;
    animation: fadeIn 0.3s ease-out;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>