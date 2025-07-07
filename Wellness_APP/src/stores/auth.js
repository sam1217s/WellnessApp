import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getFromStorage, saveToStorage, removeFromStorage } from '../utils/localStorage'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(getFromStorage('user') || null)
  const token = ref(getFromStorage('token') || null)
  
  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  
  const login = async (credentials) => {
    try {
      // Simulación de login - en producción sería una llamada a API
      const users = getFromStorage('users') || [
        {
          id: 1,
          email: 'admin@wellness.com',
          password: 'admin123',
          name: 'Administrador',
          role: 'admin',
          department: 'Sistemas'
        },
        {
          id: 2,
          email: 'empleado@wellness.com',
          password: 'emp123',
          name: 'Juan Pérez',
          role: 'employee',
          department: 'Recursos Humanos'
        }
      ]
      
      const foundUser = users.find(u => 
        u.email === credentials.email && u.password === credentials.password
      )
      
      if (foundUser) {
        const userToken = `token_${foundUser.id}_${Date.now()}`
        const userData = { ...foundUser }
        delete userData.password
        
        user.value = userData
        token.value = userToken
        
        saveToStorage('user', userData)
        saveToStorage('token', userToken)
        
        return { success: true, user: userData }
      } else {
        throw new Error('Credenciales inválidas')
      }
    } catch (error) {
      console.error('Error en login:', error)
      return { success: false, error: error.message }
    }
  }
  
  const logout = () => {
    user.value = null
    token.value = null
    removeFromStorage('user')
    removeFromStorage('token')
  }
  
  const initializeAuth = () => {
    const storedUser = getFromStorage('user')
    const storedToken = getFromStorage('token')
    
    if (storedUser && storedToken) {
      user.value = storedUser
      token.value = storedToken
    }
  }
  
  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    initializeAuth
  }
})