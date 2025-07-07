import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getFromStorage, saveToStorage } from '../utils/localStorage'

export const useHealthStore = defineStore('health', () => {
  const metrics = ref(getFromStorage('healthMetrics') || {
    heartRate: 72,
    bloodPressure: { systolic: 120, diastolic: 80 },
    steps: 8542,
    calories: 2140,
    stressLevel: 3,
    temperature: 36.5,
    sleepHours: 7.5,
    hydration: 6
  })
  
  const alerts = ref(getFromStorage('healthAlerts') || [
    {
      id: 1,
      type: 'warning',
      title: 'Pausa Activa Recomendada',
      message: 'Has estado sentado por más de 2 horas',
      timestamp: new Date().toISOString(),
      read: false
    },
    {
      id: 2,
      type: 'info',
      title: 'Hidratación',
      message: 'Recuerda tomar agua cada 30 minutos',
      timestamp: new Date().toISOString(),
      read: false
    }
  ])
  
  const weeklyData = ref(getFromStorage('weeklyHealthData') || [
    { day: 'Lun', steps: 8200, heartRate: 75, stress: 2 },
    { day: 'Mar', steps: 9100, heartRate: 73, stress: 3 },
    { day: 'Mié', steps: 7800, heartRate: 76, stress: 4 },
    { day: 'Jue', steps: 8900, heartRate: 71, stress: 2 },
    { day: 'Vie', steps: 8542, heartRate: 72, stress: 3 },
    { day: 'Sáb', steps: 6200, heartRate: 70, stress: 1 },
    { day: 'Dom', steps: 5800, heartRate: 69, stress: 1 }
  ])
  
  const recommendations = ref(getFromStorage('recommendations') || [
    {
      id: 1,
      title: 'Ejercicio de Respiración',
      description: 'Realiza 5 respiraciones profundas para reducir el estrés',
      duration: '2 min',
      category: 'stress'
    },
    {
      id: 2,
      title: 'Estiramiento de Cuello',
      description: 'Gira suavemente el cuello para relajar tensiones',
      duration: '3 min',
      category: 'posture'
    },
    {
      id: 3,
      title: 'Caminar',
      description: 'Da una caminata corta por la oficina',
      duration: '5 min',
      category: 'activity'
    }
  ])
  
  const unreadAlerts = computed(() => alerts.value.filter(alert => !alert.read))
  const currentStressLevel = computed(() => {
    const level = metrics.value.stressLevel
    if (level <= 2) return { level: 'Bajo', color: 'status-healthy' }
    if (level <= 4) return { level: 'Medio', color: 'status-warning' }
    return { level: 'Alto', color: 'status-danger' }
  })
  
  const heartRateStatus = computed(() => {
    const hr = metrics.value.heartRate
    if (hr >= 60 && hr <= 100) return { status: 'Normal', color: 'status-healthy' }
    if (hr < 60) return { status: 'Bajo', color: 'status-warning' }
    return { status: 'Alto', color: 'status-danger' }
  })
  
  const updateMetrics = (newMetrics) => {
    metrics.value = { ...metrics.value, ...newMetrics }
    saveToStorage('healthMetrics', metrics.value)
  }
  
  const addAlert = (alert) => {
    const newAlert = {
      ...alert,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      read: false
    }
    alerts.value.unshift(newAlert)
    saveToStorage('healthAlerts', alerts.value)
  }
  
  const markAlertAsRead = (alertId) => {
    const alert = alerts.value.find(a => a.id === alertId)
    if (alert) {
      alert.read = true
      saveToStorage('healthAlerts', alerts.value)
    }
  }
  
  const completeRecommendation = (recommendationId) => {
    addAlert({
      type: 'success',
      title: 'Recomendación Completada',
      message: '¡Felicitaciones! Has completado una actividad de bienestar'
    })
  }
  
  const simulateRealtimeData = () => {
    setInterval(() => {
      const variations = {
        heartRate: Math.floor(Math.random() * 10) - 5,
        steps: Math.floor(Math.random() * 100),
        stressLevel: (Math.random() - 0.5) * 0.5
      }
      
      updateMetrics({
        heartRate: Math.max(60, Math.min(100, metrics.value.heartRate + variations.heartRate)),
        steps: Math.max(0, metrics.value.steps + variations.steps),
        stressLevel: Math.max(1, Math.min(5, metrics.value.stressLevel + variations.stressLevel))
      })
    }, 30000) // Actualizar cada 30 segundos
  }
  
  return {
    metrics,
    alerts,
    weeklyData,
    recommendations,
    unreadAlerts,
    currentStressLevel,
    heartRateStatus,
    updateMetrics,
    addAlert,
    markAlertAsRead,
    completeRecommendation,
    simulateRealtimeData
  }
})