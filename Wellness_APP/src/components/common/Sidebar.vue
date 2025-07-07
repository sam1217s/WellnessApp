<template>
  <aside class="sidebar">
    <nav class="sidebar-nav">
      <router-link 
        v-for="item in menuItems" 
        :key="item.name"
        :to="item.path"
        class="nav-item"
        :class="{ 'active': $route.name === item.name }"
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
</template>

<script>
import { computed } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useHealthStore } from '../../stores/health'
import { useRewardsStore } from '../../stores/rewards'

export default {
  name: 'Sidebar',
  setup() {
    const authStore = useAuthStore()
    const healthStore = useHealthStore()
    const rewardsStore = useRewardsStore()
    
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
    
    return {
      menuItems,
      rewardsStore
    }
  }
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 60px;
  width: 250px;
  height: calc(100vh - 60px);
  background: var(--white);
  border-right: 1px solid var(--border-light);
  display: flex;
  flex-direction: column;
  z-index: 999;
}

.sidebar-nav {
  flex: 1;
  padding: 20px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  text-decoration: none;
  color: var(--text-gray);
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
  position: relative;
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
  margin-right: 12px;
  width: 24px;
  text-align: center;
}

.nav-label {
  flex: 1;
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
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid var(--border-light);
}

.user-stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  background: var(--light-green);
  border-radius: 8px;
}

.stat-icon {
  font-size: 20px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-weight: 600;
  color: var(--text-dark);
  font-size: 14px;
}

.stat-label {
  font-size: 12px;
  color: var(--text-gray);
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .sidebar.open {
    transform: translateX(0);
  }
}
</style>