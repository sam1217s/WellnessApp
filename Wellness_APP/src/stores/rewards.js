import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getFromStorage, saveToStorage } from '../utils/localStorage'

export const useRewardsStore = defineStore('rewards', () => {
  const userPoints = ref(getFromStorage('userPoints') || 1250)
  const level = ref(getFromStorage('userLevel') || 3)
  
  const challenges = ref(getFromStorage('challenges') || [
    {
      id: 1,
      title: 'Camina 10,000 pasos',
      description: 'Alcanza la meta diaria de pasos',
      points: 50,
      progress: 85,
      completed: false,
      category: 'activity'
    },
    {
      id: 2,
      title: 'Pausas Activas',
      description: 'Realiza 3 pausas activas durante el día',
      points: 30,
      progress: 67,
      completed: false,
      category: 'breaks'
    },
    {
      id: 3,
      title: 'Hidratación',
      description: 'Toma 8 vasos de agua hoy',
      points: 25,
      progress: 100,
      completed: true,
      category: 'health'
    },
    {
      id: 4,
      title: 'Ejercicios de Respiración',
      description: 'Completa 2 sesiones de respiración',
      points: 20,
      progress: 50,
      completed: false,
      category: 'wellness'
    }
  ])
  
  const leaderboard = ref(getFromStorage('leaderboard') || [
    { id: 1, name: 'Ana García', points: 2340, avatar: '👩‍💼', department: 'Marketing' },
    { id: 2, name: 'Carlos López', points: 2120, avatar: '👨‍💻', department: 'IT' },
    { id: 3, name: 'Juan Pérez', points: 1250, avatar: '👨‍💼', department: 'RRHH', isCurrentUser: true },
    { id: 4, name: 'María Silva', points: 1180, avatar: '👩‍⚕️', department: 'Salud' },
    { id: 5, name: 'Roberto Kim', points: 980, avatar: '👨‍🔧', department: 'Mantenimiento' }
  ])
  
  const rewards = ref(getFromStorage('availableRewards') || [
    {
      id: 1,
      title: 'Día Libre',
      description: 'Un día libre adicional',
      cost: 2000,
      category: 'time',
      icon: '🏖️',
      available: true
    },
    {
      id: 2,
      title: 'Desayuno Gratis',
      description: 'Desayuno cortesía de la empresa',
      cost: 300,
      category: 'food',
      icon: '🥐',
      available: true
    },
    {
      id: 3,
      title: 'Masaje Relajante',
      description: 'Sesión de masaje de 30 minutos',
      cost: 800,
      category: 'wellness',
      icon: '💆‍♀️',
      available: true
    },
    {
      id: 4,
      title: 'Parking Premium',
      description: 'Estacionamiento preferencial por una semana',
      cost: 150,
      category: 'convenience',
      icon: '🚗',
      available: true
    },
    {
      id: 5,
      title: 'Bono de $50',
      description: 'Bono en efectivo',
      cost: 1500,
      category: 'money',
      icon: '💰',
      available: true
    }
  ])
  
  const redeemedRewards = ref(getFromStorage('redeemedRewards') || [])
  
  const currentRank = computed(() => {
    const sorted = [...leaderboard.value].sort((a, b) => b.points - a.points)
    return sorted.findIndex(user => user.isCurrentUser) + 1
  })
  
  const nextLevelPoints = computed(() => {
    const pointsPerLevel = 500
    return (level.value * pointsPerLevel) - userPoints.value
  })
  
  const completedChallenges = computed(() => 
    challenges.value.filter(c => c.completed).length
  )
  
  const availableChallenges = computed(() => 
    challenges.value.filter(c => !c.completed)
  )
  
  const completeChallenge = (challengeId) => {
    const challenge = challenges.value.find(c => c.id === challengeId)
    if (challenge && !challenge.completed) {
      challenge.completed = true
      challenge.progress = 100
      userPoints.value += challenge.points
      
      // Verificar si sube de nivel
      const pointsPerLevel = 500
      const newLevel = Math.floor(userPoints.value / pointsPerLevel) + 1
      if (newLevel > level.value) {
        level.value = newLevel
        saveToStorage('userLevel', level.value)
      }
      
      saveToStorage('challenges', challenges.value)
      saveToStorage('userPoints', userPoints.value)
      
      return challenge.points
    }
    return 0
  }
  
  const redeemReward = (rewardId) => {
    const reward = rewards.value.find(r => r.id === rewardId)
    if (reward && reward.available && userPoints.value >= reward.cost) {
      userPoints.value -= reward.cost
      
      const redeemedReward = {
        ...reward,
        redeemedAt: new Date().toISOString()
      }
      
      redeemedRewards.value.push(redeemedReward)
      
      saveToStorage('userPoints', userPoints.value)
      saveToStorage('redeemedRewards', redeemedRewards.value)
      
      return true
    }
    return false
  }
  
  const updateChallengeProgress = (challengeId, progress) => {
    const challenge = challenges.value.find(c => c.id === challengeId)
    if (challenge && !challenge.completed) {
      challenge.progress = Math.min(100, progress)
      if (challenge.progress >= 100) {
        completeChallenge(challengeId)
      }
      saveToStorage('challenges', challenges.value)
    }
  }
  
  return {
    userPoints,
    level,
    challenges,
    leaderboard,
    rewards,
    redeemedRewards,
    currentRank,
    nextLevelPoints,
    completedChallenges,
    availableChallenges,
    completeChallenge,
    redeemReward,
    updateChallengeProgress
  }
})