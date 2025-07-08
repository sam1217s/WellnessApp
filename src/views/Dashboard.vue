<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>Panel de Bienestar</h1>
      <p>Bienvenido/a {{ authStore.user?.name }} - {{ getCurrentGreeting() }}</p>
    </div>
    
    <!-- Métricas principales -->
    <div class="metrics-grid grid grid-4">
      <div class="card metric-card">
        <div class="metric-value" :class="healthStore.heartRateStatus.color">
          {{ healthStore.metrics.heartRate }}
        </div>
        <div class="metric-label">Frecuencia Cardíaca</div>
        <div class="metric-status">{{ healthStore.heartRateStatus.status }}</div>
      </div>
      
      <div class="card metric-card">
        <div class="metric-value status-healthy">
          {{ healthStore.metrics.steps.toLocaleString() }}
        </div>
        <div class="metric-label">Pasos Hoy</div>
        <div class="metric-status">Meta: 10,000</div>
      </div>
      
      <div class="card metric-card">
        <div class="metric-value" :class="healthStore.currentStressLevel.color">
          {{ healthStore.currentStressLevel.level }}
        </div>
        <div class="metric-label">Nivel de Estrés</div>
        <div class="metric-status">{{ healthStore.metrics.stressLevel }}/5</div>
      </div>
      
      <div class="card metric-card">
        <div class="metric-value status-healthy">
          {{ healthStore.metrics.hydration }}
        </div>
        <div class="metric-label">Vasos de Agua</div>
        <div class="metric-status">Meta: 8</div>
      </div>
    </div>
    
    <!-- Alertas activas -->
    <div v-if="healthStore.unreadAlerts.length > 0" class="alerts-section">
      <div class="card">
        <div class="card-title">🚨 Alertas Activas</div>
        <div class="alerts-list">
          <div v-for="alert in healthStore.unreadAlerts.slice(0, 3)" :key="alert.id" 
               class="alert-item" :class="`alert-${alert.type}`">
            <div class="alert-content">
              <div class="alert-title">{{ alert.title }}</div>
              <div class="alert-message">{{ alert.message }}</div>
            </div>
            <button @click="markAsRead(alert.id)" class="btn btn-outline btn-sm">
              Entendido
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Gráfico de actividad semanal -->
    <div class="grid grid-2">
      <div class="card">
        <div class="card-title">📈 Actividad Semanal</div>
        <ActivityChart :data="healthStore.weeklyData" />
      </div>
      
      <div class="card">
        <div class="card-title">🎯 Retos Activos</div>
        <div class="challenges-preview">
          <div v-for="challenge in rewardsStore.availableChallenges.slice(0, 3)" 
               :key="challenge.id" 
               class="challenge-item">
            <div class="challenge-header">
              <div class="challenge-title">{{ challenge.title }}</div>
              <div class="challenge-points">+{{ challenge.points }} pts</div>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: challenge.progress + '%' }"></div>
            </div>
            <div class="progress-text">{{ challenge.progress }}% completado</div>
          </div>
          <router-link to="/rewards" class="btn btn-primary btn-sm">
            Ver Todos los Retos
          </router-link>
        </div>
      </div>
    </div>
    
    <!-- Recomendaciones personalizadas -->
    <div class="card">
      <div class="card-title">💡 Recomendaciones Personalizadas</div>
      <div class="recommendations-grid">
        <div v-for="rec in healthStore.recommendations" :key="rec.id" 
             class="recommendation-card">
          <div class="rec-header">
            <div class="rec-title">{{ rec.title }}</div>
            <div class="rec-duration">{{ rec.duration }}</div>
          </div>
          <div class="rec-description">{{ rec.description }}</div>
          <button @click="completeRecommendation(rec.id)" 
                  class="btn btn-success btn-sm">
            Completar
          </button>
        </div>
      </div>
    </div>
    
    <!-- Estado de bienestar general -->
    <div class="wellness-status card">
      <div class="card-title">🌟 Estado de Bienestar General</div>
      <div class="wellness-score">
        <div class="score-circle">
          <div class="score-value">{{ calculateWellnessScore() }}</div>
          <div class="score-label">/ 100</div>
        </div>
        <div class="score-breakdown">
          <div class="score-item">
            <span class="score-category">Actividad Física</span>
            <div class="score-bar">
              <div class="score-fill" :style="{ width: getActivityScore() + '%' }"></div>
            </div>
          </div>
          <div class="score-item">
            <span class="score-category">Salud Cardiovascular</span>
            <div class="score-bar">
              <div class="score-fill" :style="{ width: getHeartScore() + '%' }"></div>
            </div>
          </div>
          <div class="score-item">
            <span class="score-category">Gestión del Estrés</span>
            <div class="score-bar">
              <div class="score-fill" :style="{ width: getStressScore() + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useHealthStore } from '../stores/health'
import { useRewardsStore } from '../stores/rewards'
import ActivityChart from '../components/dashboard/ActivityChart.vue'

export default {
  name: 'Dashboard',
  components: {
    ActivityChart
  },
  setup() {
    const authStore = useAuthStore()
    const healthStore = useHealthStore()
    const rewardsStore = useRewardsStore()
    
    const getCurrentGreeting = () => {
      const hour = new Date().getHours()
      if (hour < 12) return 'Buenos días'
      if (hour < 18) return 'Buenas tardes'
      return 'Buenas noches'
    }
    
    const markAsRead = (alertId) => {
      healthStore.markAlertAsRead(alertId)
    }
    
    const completeRecommendation = (recId) => {
      healthStore.completeRecommendation(recId)
      rewardsStore.updateChallengeProgress(2, rewardsStore.challenges.find(c => c.id === 2)?.progress + 33)
    }
    
    const calculateWellnessScore = () => {
      const activityScore = getActivityScore()
      const heartScore = getHeartScore()
      const stressScore = getStressScore()
      return Math.round((activityScore + heartScore + stressScore) / 3)
    }
    
    const getActivityScore = () => {
      const steps = healthStore.metrics.steps
      return Math.min(100, Math.round((steps / 10000) * 100))
    }
    
    const getHeartScore = () => {
      const hr = healthStore.metrics.heartRate
      if (hr >= 60 && hr <= 100) return 90
      if (hr >= 50 && hr <= 110) return 70
      return 50
    }
    
    const getStressScore = () => {
      const stress = healthStore.metrics.stressLevel
      return Math.max(0, 100 - (stress - 1) * 25)
    }
    
    onMounted(() => {
      // Inicializar simulación de datos en tiempo real
      healthStore.simulateRealtimeData()
    })
    
    return {
      authStore,
      healthStore,
      rewardsStore,
      getCurrentGreeting,
      markAsRead,
      completeRecommendation,
      calculateWellnessScore,
      getActivityScore,
      getHeartScore,
      getStressScore
    }
  }
}
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
  animation: fadeInUp 0.6s ease-out;
}

.dashboard-header {
  margin-bottom: 32px;
}

.dashboard-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-dark);
  margin: 0 0 8px 0;
}

.dashboard-header p {
  color: var(--text-gray);
  font-size: 16px;
  margin: 0;
}

.metrics-grid {
  margin-bottom: 32px;
}

.metric-status {
  font-size: 12px;
  color: var(--text-gray);
  margin-top: 4px;
}

.alerts-section {
  margin-bottom: 32px;
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.alert-item {
  display: flex;
  justify-content: between;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid;
}

.alert-warning {
  background: #fef3c7;
  border-left-color: #f59e0b;
}

.alert-info {
  background: var(--light-blue);
  border-left-color: var(--primary-blue);
}

.alert-success {
  background: var(--light-green);
  border-left-color: var(--success-green);
}

.alert-content {
  flex: 1;
}

.alert-title {
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 4px;
}

.alert-message {
  color: var(--text-gray);
  font-size: 14px;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 12px;
}

.challenges-preview {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.challenge-item {
  padding: 16px;
  background: var(--light-gray);
  border-radius: 8px;
}

.challenge-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.challenge-title {
  font-weight: 600;
  color: var(--text-dark);
}

.challenge-points {
  color: var(--success-green);
  font-weight: 600;
  font-size: 14px;
}

.progress-bar {
  height: 8px;
  background: var(--border-light);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 4px;
}

.progress-fill {
  height: 100%;
  background: var(--success-green);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: var(--text-gray);
}

.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.recommendation-card {
  padding: 16px;
  background: var(--light-green);
  border-radius: 8px;
}

.rec-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.rec-title {
  font-weight: 600;
  color: var(--text-dark);
}

.rec-duration {
  color: var(--text-gray);
  font-size: 12px;
  background: var(--white);
  padding: 2px 8px;
  border-radius: 12px;
}

.rec-description {
  color: var(--text-gray);
  font-size: 14px;
  margin-bottom: 12px;
}

.wellness-status {
  margin-top: 32px;
}

.wellness-score {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 32px;
  align-items: center;
}

.score-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: conic-gradient(var(--success-green) 0deg, var(--success-green) 252deg, var(--border-light) 252deg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.score-circle::before {
  content: '';
  position: absolute;
  width: 80px;
  height: 80px;
  background: var(--white);
  border-radius: 50%;
}

.score-value {
  font-size: 32px;
  font-weight: 700;
  color: var(--success-green);
  z-index: 1;
}

.score-label {
  font-size: 14px;
  color: var(--text-gray);
  z-index: 1;
}

.score-breakdown {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.score-item {
  display: flex;
  align-items: center;
  gap: 16px;
}

.score-category {
  min-width: 180px;
  font-weight: 500;
  color: var(--text-dark);
}

.score-bar {
  flex: 1;
  height: 8px;
  background: var(--border-light);
  border-radius: 4px;
  overflow: hidden;
}

.score-fill {
  height: 100%;
  background: var(--primary-blue);
  border-radius: 4px;
  transition: width 0.3s ease;
}

@media (max-width: 768px) {
  .wellness-score {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .score-item {
    flex-direction: column;
    gap: 8px;
  }
  
  .score-category {
    min-width: auto;
  }
  
  .recommendations-grid {
    grid-template-columns: 1fr;
  }
}
</style>