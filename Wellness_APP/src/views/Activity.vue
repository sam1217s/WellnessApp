<template>
  <div class="activity-page">
    <div class="page-header">
      <h1>📊 Actividad y Métricas</h1>
      <p>Monitoreo detallado de tu bienestar físico durante la jornada laboral</p>
    </div>
    
    <!-- Métricas en tiempo real -->
    <div class="realtime-section">
      <h2>Métricas en Tiempo Real</h2>
      <div class="grid grid-3">
        <div class="card metric-card">
          <div class="metric-header">
            <span class="metric-icon">❤️</span>
            <span class="metric-title">Frecuencia Cardíaca</span>
          </div>
          <div class="metric-value" :class="healthStore.heartRateStatus.color">
            {{ healthStore.metrics.heartRate }}
          </div>
          <div class="metric-unit">BPM</div>
          <div class="metric-status">{{ healthStore.heartRateStatus.status }}</div>
        </div>
        
        <div class="card metric-card">
          <div class="metric-header">
            <span class="metric-icon">🌡️</span>
            <span class="metric-title">Temperatura</span>
          </div>
          <div class="metric-value status-healthy">
            {{ healthStore.metrics.temperature }}
          </div>
          <div class="metric-unit">°C</div>
          <div class="metric-status">Normal</div>
        </div>
        
        <div class="card metric-card">
          <div class="metric-header">
            <span class="metric-icon">🧠</span>
            <span class="metric-title">Nivel de Estrés</span>
          </div>
          <div class="metric-value" :class="healthStore.currentStressLevel.color">
            {{ healthStore.currentStressLevel.level }}
          </div>
          <div class="metric-unit">{{ healthStore.metrics.stressLevel }}/5</div>
          <div class="metric-status">{{ getStressAdvice() }}</div>
        </div>
      </div>
    </div>
    
    <!-- Actividad física -->
    <div class="activity-section">
      <h2>Actividad Física</h2>
      <div class="grid grid-2">
        <div class="card">
          <div class="card-title">🚶‍♂️ Pasos y Movimiento</div>
          <div class="activity-stats">
            <div class="stat-item">
              <div class="stat-value">{{ healthStore.metrics.steps.toLocaleString() }}</div>
              <div class="stat-label">Pasos hoy</div>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: getStepsProgress() + '%' }"></div>
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ healthStore.metrics.calories }}</div>
              <div class="stat-label">Calorías quemadas</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ calculateDistance() }} km</div>
              <div class="stat-label">Distancia recorrida</div>
            </div>
          </div>
        </div>
        
        <div class="card">
          <div class="card-title">💧 Hidratación y Descanso</div>
          <div class="hydration-stats">
            <div class="hydration-visual">
              <div class="water-glasses">
                <div v-for="n in 8" :key="n" 
                     class="water-glass" 
                     :class="{ 'filled': n <= healthStore.metrics.hydration }">
                  💧
                </div>
              </div>
              <div class="hydration-text">
                {{ healthStore.metrics.hydration }}/8 vasos
              </div>
            </div>
            <div class="sleep-info">
              <div class="stat-value">{{ healthStore.metrics.sleepHours }}h</div>
              <div class="stat-label">Sueño anoche</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Gráfico semanal detallado -->
    <div class="weekly-section">
      <h2>Tendencias Semanales</h2>
      <div class="card">
        <div class="chart-controls">
          <button v-for="metric in chartMetrics" :key="metric.key"
                  @click="selectedMetric = metric.key"
                  class="btn"
                  :class="selectedMetric === metric.key ? 'btn-primary' : 'btn-outline'">
            {{ metric.label }}
          </button>
        </div>
        <div class="chart-container">
          <WeeklyChart :data="healthStore.weeklyData" :metric="selectedMetric" />
        </div>
      </div>
    </div>
    
    <!-- Pausas activas -->
    <div class="breaks-section">
      <h2>Pausas Activas</h2>
      <div class="grid grid-3">
        <div v-for="pause in activePauses" :key="pause.id" 
             class="card pause-card">
          <div class="pause-header">
            <span class="pause-icon">{{ pause.icon }}</span>
            <div class="pause-info">
              <div class="pause-title">{{ pause.title }}</div>
              <div class="pause-duration">{{ pause.duration }}</div>
            </div>
          </div>
          <div class="pause-description">{{ pause.description }}</div>
          <button @click="startPause(pause)" class="btn btn-success">
            Iniciar Pausa
          </button>
        </div>
      </div>
    </div>
    
    <!-- Historial de actividad -->
    <div class="history-section">
      <h2>Historial de Actividad</h2>
      <div class="card">
        <div class="activity-timeline">
          <div v-for="activity in activityHistory" :key="activity.id" 
               class="timeline-item">
            <div class="timeline-time">{{ activity.time }}</div>
            <div class="timeline-content">
              <div class="timeline-title">{{ activity.title }}</div>
              <div class="timeline-description">{{ activity.description }}</div>
            </div>
            <div class="timeline-badge" :class="`badge-${activity.type}`">
              {{ activity.icon }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useHealthStore } from '../stores/health'
import { useRewardsStore } from '../stores/rewards'
import WeeklyChart from '../components/dashboard/WeeklyChart.vue'

export default {
  name: 'Activity',
  components: {
    WeeklyChart
  },
  setup() {
    const healthStore = useHealthStore()
    const rewardsStore = useRewardsStore()
    
    const selectedMetric = ref('steps')
    
    const chartMetrics = [
      { key: 'steps', label: 'Pasos' },
      { key: 'heartRate', label: 'Frecuencia Cardíaca' },
      { key: 'stress', label: 'Estrés' }
    ]
    
    const activePauses = ref([
      {
        id: 1,
        title: 'Estiramiento de Cuello',
        description: 'Ejercicios suaves para relajar la tensión cervical',
        duration: '3 min',
        icon: '🧘‍♀️',
        type: 'stretch'
      },
      {
        id: 2,
        title: 'Respiración Profunda',
        description: 'Técnica de respiración para reducir el estrés',
        duration: '2 min',
        icon: '🫁',
        type: 'breathing'
      },
      {
        id: 3,
        title: 'Ejercicios Oculares',
        description: 'Descanso visual para pantallas',
        duration: '1 min',
        icon: '👀',
        type: 'eye'
      },
      {
        id: 4,
        title: 'Caminata Corta',
        description: 'Movimiento activo por la oficina',
        duration: '5 min',
        icon: '🚶‍♂️',
        type: 'walk'
      },
      {
        id: 5,
        title: 'Estiramiento de Espalda',
        description: 'Ejercicios para aliviar tensión lumbar',
        duration: '4 min',
        icon: '🤸‍♀️',
        type: 'stretch'
      },
      {
        id: 6,
        title: 'Hidratación Activa',
        description: 'Recordatorio para tomar agua',
        duration: '1 min',
        icon: '💧',
        type: 'hydration'
      }
    ])
    
    const activityHistory = ref([
      {
        id: 1,
        time: '14:30',
        title: 'Pausa Activa Completada',
        description: 'Estiramiento de cuello - 3 minutos',
        type: 'success',
        icon: '✅'
      },
      {
        id: 2,
        time: '13:15',
        title: 'Meta de Pasos Alcanzada',
        description: '10,000 pasos completados',
        type: 'achievement',
        icon: '🏆'
      },
      {
        id: 3,
        time: '12:00',
        title: 'Alerta de Hidratación',
        description: 'Tiempo de tomar agua',
        type: 'reminder',
        icon: '💧'
      },
      {
        id: 4,
        time: '10:45',
        title: 'Ejercicio de Respiración',
        description: 'Sesión de relajación - 2 minutos',
        type: 'success',
        icon: '🧘‍♀️'
      },
      {
        id: 5,
        time: '09:30',
        title: 'Inicio de Jornada',
        description: 'Monitoreo activado',
        type: 'info',
        icon: '🕘'
      }
    ])
    
    const getStepsProgress = () => {
      return Math.min(100, (healthStore.metrics.steps / 10000) * 100)
    }
    
    const calculateDistance = () => {
      // Aproximadamente 0.0008 km por paso
      return (healthStore.metrics.steps * 0.0008).toFixed(1)
    }
    
    const getStressAdvice = () => {
      const level = healthStore.metrics.stressLevel
      if (level <= 2) return 'Excelente control'
      if (level <= 3) return 'Nivel manejable'
      if (level <= 4) return 'Considera una pausa'
      return 'Pausa recomendada'
    }
    
    const startPause = (pause) => {
      // Simular inicio de pausa activa
      healthStore.addAlert({
        type: 'info',
        title: 'Pausa Activa Iniciada',
        message: `Has iniciado: ${pause.title} (${pause.duration})`
      })
      
      // Actualizar progreso de retos
      rewardsStore.updateChallengeProgress(2, rewardsStore.challenges.find(c => c.id === 2)?.progress + 33)
      
      // Simular completación después de un tiempo
      setTimeout(() => {
        healthStore.addAlert({
          type: 'success',
          title: 'Pausa Completada',
          message: `¡Excelente! Has completado ${pause.title}`
        })
        
        // Agregar al historial
        activityHistory.value.unshift({
          id: Date.now(),
          time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
          title: 'Pausa Activa Completada',
          description: `${pause.title} - ${pause.duration}`,
          type: 'success',
          icon: '✅'
        })
      }, 3000)
    }
    
    return {
      healthStore,
      selectedMetric,
      chartMetrics,
      activePauses,
      activityHistory,
      getStepsProgress,
      calculateDistance,
      getStressAdvice,
      startPause
    }
  }
}
</script>

<style scoped>
.activity-page {
  max-width: 1200px;
  margin: 0 auto;
  animation: fadeInUp 0.6s ease-out;
}

.page-header {
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-dark);
  margin: 0 0 8px 0;
}

.page-header p {
  color: var(--text-gray);
  font-size: 16px;
  margin: 0;
}

.realtime-section,
.activity-section,
.weekly-section,
.breaks-section,
.history-section {
  margin-bottom: 40px;
}

.realtime-section h2,
.activity-section h2,
.weekly-section h2,
.breaks-section h2,
.history-section h2 {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 20px;
}

.metric-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.metric-icon {
  font-size: 20px;
}

.metric-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-gray);
}

.metric-unit {
  font-size: 14px;
  color: var(--text-gray);
  margin-top: 4px;
}

.activity-stats,
.hydration-stats {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--primary-blue);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: var(--text-gray);
  margin-bottom: 8px;
}

.hydration-visual {
  text-align: center;
}

.water-glasses {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.water-glass {
  font-size: 24px;
  opacity: 0.3;
  transition: opacity 0.3s ease;
}

.water-glass.filled {
  opacity: 1;
}

.hydration-text {
  font-size: 16px;
  font-weight: 600;
  color: var(--primary-blue);
}

.sleep-info {
  text-align: center;
}

.chart-controls {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.chart-container {
  height: 300px;
}

.pause-card {
  text-align: center;
}

.pause-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.pause-icon {
  font-size: 24px;
}

.pause-info {
  flex: 1;
  text-align: left;
}

.pause-title {
  font-weight: 600;
  color: var(--text-dark);
}

.pause-duration {
  font-size: 12px;
  color: var(--text-gray);
}

.pause-description {
  color: var(--text-gray);
  font-size: 14px;
  margin-bottom: 16px;
  text-align: left;
}

.activity-timeline {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.timeline-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: var(--light-gray);
  border-radius: 8px;
}

.timeline-time {
  font-weight: 600;
  color: var(--text-gray);
  min-width: 60px;
}

.timeline-content {
  flex: 1;
}

.timeline-title {
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 4px;
}

.timeline-description {
  font-size: 14px;
  color: var(--text-gray);
}

.timeline-badge {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.badge-success {
  background: var(--light-green);
}

.badge-achievement {
  background: #fef3c7;
}

.badge-reminder {
  background: var(--light-blue);
}

.badge-info {
  background: var(--border-light);
}

@media (max-width: 768px) {
  .pause-header {
    flex-direction: column;
    text-align: center;
  }
  
  .pause-info {
    text-align: center;
  }
  
  .timeline-item {
    flex-direction: column;
    text-align: center;
  }
  
  .timeline-time {
    min-width: auto;
  }
  
  .chart-controls {
    justify-content: center;
  }
}
</style>