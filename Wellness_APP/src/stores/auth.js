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
      // Obtener usuarios del storage o crear usuarios por defecto
      let users = getFromStorage('users')
      if (!users) {
        users = [
          {
            id: 1,
            email: 'admin@wellness.com',
            password: 'admin123',
            name: 'Administrador',
            role: 'admin',
            department: 'Sistemas',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 2,
            email: 'empleado@wellness.com',
            password: 'emp123',
            name: 'Juan Pérez',
            role: 'employee',
            department: 'Recursos Humanos',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]
        saveToStorage('users', users)
      }
      
      const foundUser = users.find(u => 
        u.email === credentials.email && 
        u.password === credentials.password &&
        u.isActive === true
      )
      
      if (foundUser) {
        // Verificar que el rol coincida con lo esperado si se proporciona
        if (credentials.expectedRole) {
          const userRole = foundUser.role === 'admin' ? 'admin' : 'employee'
          if (userRole !== credentials.expectedRole) {
            throw new Error(`Este usuario no tiene permisos de ${credentials.expectedRole === 'admin' ? 'administrador' : 'empleado'}`)
          }
        }
        
        const userToken = `token_${foundUser.id}_${Date.now()}`
        const userData = { ...foundUser }
        delete userData.password
        
        user.value = userData
        token.value = userToken
        
        saveToStorage('user', userData)
        saveToStorage('token', userToken)
        
        return { success: true, user: userData }
      } else {
        throw new Error('Credenciales inválidas o usuario inactivo')
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
  
  const registerEmployee = async (employeeData) => {
    try {
      const users = getFromStorage('users') || []
      
      // Verificar si el email ya existe
      const existingUser = users.find(u => u.email === employeeData.email)
      if (existingUser) {
        throw new Error('El correo electrónico ya está registrado')
      }
      
      // Crear nuevo empleado
      const newEmployee = {
        id: Date.now(),
        name: employeeData.name,
        email: employeeData.email,
        password: employeeData.password,
        role: 'employee',
        department: employeeData.department,
        position: employeeData.position || '',
        isActive: true,
        createdAt: new Date().toISOString(),
        createdBy: user.value?.id
      }
      
      users.push(newEmployee)
      saveToStorage('users', users)
      
      return { success: true, employee: newEmployee }
    } catch (error) {
      console.error('Error registrando empleado:', error)
      return { success: false, error: error.message }
    }
  }
  
  const getAllUsers = () => {
    return getFromStorage('users') || []
  }
  
  const updateUser = async (userId, userData) => {
    try {
      const users = getFromStorage('users') || []
      const userIndex = users.findIndex(u => u.id === userId)
      
      if (userIndex === -1) {
        throw new Error('Usuario no encontrado')
      }
      
      users[userIndex] = { ...users[userIndex], ...userData, updatedAt: new Date().toISOString() }
      saveToStorage('users', users)
      
      return { success: true, user: users[userIndex] }
    } catch (error) {
      console.error('Error actualizando usuario:', error)
      return { success: false, error: error.message }
    }
  }
  
  const deactivateUser = async (userId) => {
    try {
      const users = getFromStorage('users') || []
      const userIndex = users.findIndex(u => u.id === userId)
      
      if (userIndex === -1) {
        throw new Error('Usuario no encontrado')
      }
      
      users[userIndex].isActive = false
      users[userIndex].deactivatedAt = new Date().toISOString()
      users[userIndex].deactivatedBy = user.value?.id
      
      saveToStorage('users', users)
      
      return { success: true }
    } catch (error) {
      console.error('Error desactivando usuario:', error)
      return { success: false, error: error.message }
    }
  }
  
  const reactivateUser = async (userId) => {
    try {
      const users = getFromStorage('users') || []
      const userIndex = users.findIndex(u => u.id === userId)
      
      if (userIndex === -1) {
        throw new Error('Usuario no encontrado')
      }
      
      users[userIndex].isActive = true
      users[userIndex].reactivatedAt = new Date().toISOString()
      users[userIndex].reactivatedBy = user.value?.id
      
      saveToStorage('users', users)
      
      return { success: true }
    } catch (error) {
      console.error('Error reactivando usuario:', error)
      return { success: false, error: error.message }
    }
  }
  
  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    initializeAuth,
    registerEmployee,
    getAllUsers,
    updateUser,
    deactivateUser,
    reactivateUser
  }
})