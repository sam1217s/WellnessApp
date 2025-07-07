<template>
  <div class="rewards-page">
    <div class="page-header">
      <h1>🎁 Sistema de Recompensas</h1>
      <p>Gana puntos completando actividades saludables y canjea recompensas</p>
    </div>
    
    <!-- Estado del usuario -->
    <div class="user-status">
      <div class="grid grid-4">
        <div class="card metric-card">
          <div class="metric-value status-healthy">{{ rewardsStore.userPoints }}</div>
          <div class="metric-label">Puntos Disponibles</div>
        </div>
        <div class="card metric-card">
          <div class="metric-value status-healthy">{{ rewardsStore.level }}</div>
          <div class="metric-label">Nivel Actual</div>
        </div>
        <div class="card metric-card">
          <div class="metric-value status-healthy">#{{ rewardsStore.currentRank }}</div>
          <div class="metric-label">Posición Ranking</div>
        </div>
        <div class="card metric-card">
          <div class="metric-value status-healthy">{{ rewardsStore.nextLevelPoints }}</div>
          <div class="metric-label">Puntos para Siguiente Nivel</div>
        </div>
      </div>
    </div>
    
    <!-- Progreso de nivel -->
    <div class="level-progress">
      <div class="card">
        <div class="card-title">🚀 Progreso de Nivel</div>
        <div class="level-info">
          <div class="level-current">Nivel {{ rewardsStore.level }}</div>
          <div class="level-next">Nivel {{ rewardsStore.level + 1 }}</div>
        </div>
        <div class="progress-bar level-bar">
          <div class="progress-fill" :style="{ width: getLevelProgress() + '%' }"></div>
        </div>
        <div class="level-text">
          {{ rewardsStore.userPoints }} / {{ (rewardsStore.level + 1) * 500 }} puntos
        </div>
      </div>
    </div>
    
    <!-- Retos activos -->
    <div class="challenges-section">
      <h2>🎯 Retos Activos</h2>
      <div class="grid grid-2">
        <div v-for="challenge in rewardsStore.availableChallenges" :key="challenge.id" 
             class="card challenge-card">
          <div class="challenge-header">
            <div class="challenge-category">{{ getCategoryIcon(challenge.category) }}</div>
            <div class="challenge-points">+{{ challenge.points }} pts</div>
          </div>
          <div class="challenge-title">{{ challenge.title }}</div>
          <div class="challenge-description">{{ challenge.description }}</div>
          <div class="challenge-progress">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: challenge.progress + '%' }"></div>
            </div>
            <div class="progress-text">{{ challenge.progress }}% completado</div>
          </div>
          <button v-if="challenge.progress >= 100" 
                  @click="completeChallenge(challenge.id)"
                  class="btn btn-success">
            🏆 Reclamar Recompensa
          </button>
          <button v-else 
                  class="btn btn-outline" 
                  disabled>
            En Progreso...
          </button>
        </div>
      </div>
    </div>
    
    <!-- Retos completados -->
    <div v-if="rewardsStore.completedChallenges > 0" class="completed-challenges">
      <h2>✅ Retos Completados</h2>
      <div class="grid grid-3">
        <div v-for="challenge in getCompletedChallenges()" :key="challenge.id" 
             class="card completed-challenge-card">
          <div class="challenge-header">
            <div class="challenge-category">{{ getCategoryIcon(challenge.category) }}</div>
            <div class="challenge-points completed">+{{ challenge.points }} pts</div>
          </div>
          <div class="challenge-title">{{ challenge.title }}</div>
          <div class="completion-badge">🏆 Completado</div>
        </div>
      </div>
    </div>
    
    <!-- Tienda de recompensas -->
    <div class="rewards-shop">
      <h2>🛍️ Tienda de Recompensas</h2>
      <div class="grid grid-3">
        <div v-for="reward in rewardsStore.rewards" :key="reward.id" 
             class="card reward-card">
          <div class="reward-icon">{{ reward.icon }}</div>
          <div class="reward-title">{{ reward.title }}</div>
          <div class="reward-description">{{ reward.description }}</div>
          <div class="reward-cost">💰 {{ reward.cost }} puntos</div>
          <button @click="redeemReward(reward.id)" 
                  class="btn"
                  :class="canAfford(reward.cost) ? 'btn-primary' : 'btn-outline'"
                  :disabled="!canAfford(reward.cost)">
            {{ canAfford(reward.cost) ? 'Canjear' : 'Insuficientes puntos' }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Ranking de equipo -->
    <div class="leaderboard-section">
      <h2>🏆 Ranking del Equipo</h2>
      <div class="card">
        <div class="leaderboard">
          <div v-for="(user, index) in rewardsStore.leaderboard" :key="user.id" 
               class="leaderboard-item" 
               :class="{ 'current-user': user.isCurrentUser }">
            <div class="rank-position">
              <span v-if="index === 0" class="rank-medal">🥇</span>
              <span v-else-if="index === 1" class="rank-medal">🥈</span>
              <span v-else-if="index === 2" class="rank-medal">🥉</span>
              <span v-else class="rank-number">#{{ index + 1 }}</span>
            </div>
            <div class="user-avatar">{{ user.avatar }}</div>
            <div class="user-info">
              <div class="user-name">{{ user.name }}</div>
              <div class="user-department">{{ user.department }}</div>
            </div>
            <div class="user-points">{{ user.points }} pts</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Historial de recompensas -->
    <div v-if="rewardsStore.redeemedRewards.length > 0" class="rewards-history">
      <h2>📋 Historial de Canjes</h2>
      <div class="card">
        <div class="history-list">
          <div v-for="reward in rewardsStore.redeemedRewards" :key="reward.id" 
               class="history-item">
            <div class="history-icon">{{ reward.icon }}</div>
            <div class="history-info">
              <div class="history-title">{{ reward.title }}</div>
              <div class="history-date">{{ formatDate(reward.redeemedAt) }}</div>
            </div>
            <div class="history-cost">-{{ reward.cost }} pts</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRewardsStore } from '../stores/rewards'
import { useHealthStore } from '../stores/health'

export default {
  name: 'Rewards',
  setup() {
    const rewardsStore = useRewardsStore()
    const healthStore = useHealthStore()
    
    const getLevelProgress = () => {
      const currentLevelPoints = rewardsStore.level * 500
      const nextLevelPoints = (rewardsStore.level + 1) * 500
      const progress = ((rewardsStore.userPoints - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100
      return Math.max(0, Math.min(100, progress))
    }
    
    const getCategoryIcon = (category) => {
      const icons = {
        activity: '🏃‍♂️',
        breaks: '⏰',
        health: '💊',
        wellness: '🧘‍♀️',
        hydration: '💧',
        nutrition: '🥗'
      }
      return icons[category] || '⭐'
    }
    
    const getCompletedChallenges = () => {
      return rewardsStore.challenges.filter(c => c.completed)
    }
    
    const canAfford = (cost) => {
      return rewardsStore.userPoints >= cost
    }
    
    const completeChallenge = (challengeId) => {
      const pointsEarned = rewardsStore.completeChallenge(challengeId)
      if (pointsEarned > 0) {
        healthStore.addAlert({
          type: 'success',
          title: 'Reto Completado',
          message: `¡Felicitaciones! Has ganado ${pointsEarned} puntos`
        })
      }
    }
    
    const redeemReward = (rewardId) => {
      const success = rewardsStore.redeemReward(rewardId)
      if (success) {
        const reward = rewardsStore.rewards.find(r => r.id === rewardId)
        healthStore.addAlert({
          type: 'success',
          title: 'Recompensa Canjeada',
          message: `Has canjeado: ${reward.title}`
        })
      } else {
        healthStore.addAlert({
          type: 'warning',
          title: 'Canje Fallido',
          message: 'No tienes suficientes puntos para esta recompensa'
        })
      }
    }
    
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
    
    return {
      rewardsStore,
      getLevelProgress,
      getCategoryIcon,
      getCompletedChallenges,
      canAfford,
      completeChallenge,
      redeemReward,
      formatDate
    }
  }
}
</script>

<style scoped>
.rewards-page {
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

.user-status {
  margin-bottom: 32px;
}

.level-progress {
  margin-bottom: 32px;
}

.level-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.level-current,
.level-next {
  font-weight: 600;
  color: var(--text-dark);
}

.level-bar {
  height: 12px;
  margin-bottom: 8px;
}

.level-text {
  text-align: center;
  color: var(--text-gray);
  font-size: 14px;
}

.challenges-section,
.completed-challenges,
.rewards-shop,
.leaderboard-section,
.rewards-history {
  margin-bottom: 40px;
}

.challenges-section h2,
.completed-challenges h2,
.rewards-shop h2,
.leaderboard-section h2,
.rewards-history h2 {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 20px;
}

.challenge-card,
.completed-challenge-card,
.reward-card {
  text-align: center;
  transition: transform 0.2s ease;
}

.challenge-card:hover,
.reward-card:hover {
  transform: translateY(-2px);
}

.challenge-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.challenge-category {
  font-size: 24px;
}

.challenge-points {
  background: var(--success-green);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.challenge-points.completed {
  background: var(--text-gray);
}

.challenge-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 8px;
}

.challenge-description {
  color: var(--text-gray);
  font-size: 14px;
  margin-bottom: 16px;
}

.challenge-progress {
  margin-bottom: 16px;
}

.progress-text {
  font-size: 12px;
  color: var(--text-gray);
  margin-top: 4px;
}

.completion-badge {
  color: var(--success-green);
  font-weight: 600;
  font-size: 14px;
  margin-top: 12px;
}

.reward-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.reward-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 8px;
}

.reward-description {
  color: var(--text-gray);
  font-size: 14px;
  margin-bottom: 12px;
}

.reward-cost {
  color: var(--primary-blue);
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 16px;
}

.leaderboard {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.leaderboard-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: var(--light-gray);
  border-radius: 8px;
  transition: background 0.2s ease;
}

.leaderboard-item.current-user {
  background: var(--light-blue);
  border: 2px solid var(--primary-blue);
}

.rank-position {
  min-width: 40px;
  text-align: center;
}

.rank-medal {
  font-size: 20px;
}

.rank-number {
  font-weight: 600;
  color: var(--text-gray);
}

.user-avatar {
  font-size: 24px;
}

.user-info {
  flex: 1;
}

.user-name {
  font-weight: 600;
  color: var(--text-dark);
}

.user-department {
  font-size: 12px;
  color: var(--text-gray);
}

.user-points {
  font-weight: 600;
  color: var(--success-green);
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  background: var(--light-gray);
  border-radius: 8px;
}

.history-icon {
  font-size: 24px;
}

.history-info {
  flex: 1;
}

.history-title {
  font-weight: 600;
  color: var(--text-dark);
}

.history-date {
  font-size: 12px;
  color: var(--text-gray);
}

.history-cost {
  color: var(--primary-blue);
  font-weight: 600;
}

@media (max-width: 768px) {
  .level-info {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
  
  .leaderboard-item {
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .user-info {
    text-align: center;
  }
}
</style>