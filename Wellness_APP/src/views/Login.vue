<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <div class="app-logo">
          <span class="logo-icon">💚</span>
          <h1>WellnessApp</h1>
        </div>
        <p class="login-subtitle">Monitoreo Inteligente de Bienestar Laboral</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email" class="form-label">Correo Electrónico</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            class="form-input"
            placeholder="tu@empresa.com"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="password" class="form-label">Contraseña</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            class="form-input"
            placeholder="••••••••"
            required
          />
        </div>
        
        <button 
          type="submit" 
          class="btn btn-primary login-btn"
          :disabled="loading"
        >
          <span v-if="loading">🔄 Iniciando sesión...</span>
          <span v-else>🚀 Iniciar Sesión</span>
        </button>
        
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </form>
      
      <div class="demo-credentials">
        <h3>Credenciales de Prueba:</h3>
        <div class="credential-item">
          <strong>Administrador:</strong>
          <code>admin@wellness.com / admin123</code>
        </div>
        <div class="credential-item">
          <strong>Empleado:</strong>
          <code>empleado@wellness.com / emp123</code>
        </div>
      </div>
      
      <div class="features-preview">
        <h3>Características Principales:</h3>
        <div class="features-grid">
          <div class="feature-item">
            <span class="feature-icon">📊</span>
            <span>Monitoreo en Tiempo Real</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🎯</span>
            <span>Metas Personalizadas</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🏆</span>
            <span>Sistema de Recompensas</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">👥</span>
            <span>Colaboración Grupal</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    const form = ref({
      email: '',
      password: ''
    })
    
    const loading = ref(false)
    const error = ref('')
    
    const handleLogin = async () => {
      loading.value = true
      error.value = ''
      
      try {
        const result = await authStore.login(form.value)
        
        if (result.success) {
          router.push('/')
        } else {
          error.value = result.error
        }
      } catch (err) {
        error.value = 'Error de conexión. Intenta nuevamente.'
      } finally {
        loading.value = false
      }
    }
    
    return {
      form,
      loading,
      error,
      handleLogin
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--light-blue) 0%, var(--light-green) 100%);
  padding: 20px;
}

.login-card {
  background: var(--white);
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 480px;
  animation: fadeInUp 0.6s ease-out;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.app-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 8px;
}

.logo-icon {
  font-size: 32px;
}

.app-logo h1 {
  font-size: 28px;
  font-weight: 700;
  color: var(--primary-blue);
  margin: 0;
}

.login-subtitle {
  color: var(--text-gray);
  font-size: 16px;
  margin: 0;
}

.login-form {
  margin-bottom: 32px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-weight: 500;
  color: var(--text-dark);
  margin-bottom: 6px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--border-light);
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-blue);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.login-btn {
  width: 100%;
  padding: 14px;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  background: #fef2f2;
  color: #dc2626;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
}

.demo-credentials {
  background: var(--light-gray);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.demo-credentials h3 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: var(--text-dark);
}

.credential-item {
  margin-bottom: 8px;
  font-size: 13px;
  color: var(--text-gray);
}

.credential-item code {
  background: var(--white);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
  color: var(--primary-blue);
}

.features-preview h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: var(--text-dark);
  text-align: center;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--text-gray);
}

.feature-icon {
  font-size: 16px;
}

@media (max-width: 768px) {
  .login-card {
    padding: 24px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>