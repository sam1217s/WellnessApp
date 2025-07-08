<template>
  <div class="admin-page">
    <div class="page-header">
      <h1>⚙️ Panel de Administración</h1>
      <p>Gestión y monitoreo del bienestar del equipo</p>
    </div>
    
    <!-- Métricas generales -->
    <div class="admin-metrics">
      <div class="grid grid-4">
        <div class="card metric-card">
          <div class="metric-value status-healthy">{{ employeeStats.total }}</div>
          <div class="metric-label">Empleados Activos</div>
        </div>
        <div class="card metric-card">
          <div class="metric-value status-healthy">{{ teamStats.averageSteps }}</div>
          <div class="metric-label">Promedio Pasos/Día</div>
        </div>
        <div class="card metric-card">
          <div class="metric-value status-healthy">{{ teamStats.completedChallenges }}</div>
          <div class="metric-label">Retos Completados</div>
        </div>
        <div class="card metric-card">
          <div class="metric-value" :class="getWellnessStatusColor()">
            {{ teamStats.wellnessScore }}%
          </div>
          <div class="metric-label">Índice de Bienestar</div>
        </div>
      </div>
    </div>
    
    <!-- Alertas del sistema -->
    <div class="system-alerts">
      <div class="card">
        <div class="card-title">🚨 Alertas del Sistema</div>
        <div class="alerts-list">
          <div v-for="alert in systemAlerts" :key="alert.id" 
               class="alert-item" :class="`alert-${alert.severity}`">
            <div class="alert-icon">{{ getAlertIcon(alert.severity) }}</div>
            <div class="alert-content">
              <div class="alert-title">{{ alert.title }}</div>
              <div class="alert-message">{{ alert.message }}</div>
              <div class="alert-time">{{ formatTime(alert.timestamp) }}</div>
            </div>
            <button @click="resolveAlert(alert.id)" class="btn btn-outline btn-sm">
              Resolver
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Reportes -->
    <div class="reports-section">
      <h2>📈 Reportes y Exportación</h2>
      <div class="grid grid-3">
        <div class="card report-card">
          <div class="report-icon">📊</div>
          <div class="report-title">Reporte de Empleados</div>
          <div class="report-description">
            Lista completa de empleados registrados
          </div>
          <button @click="exportData()" class="btn btn-primary">
            📤 Exportar CSV
          </button>
        </div>
        
        <div class="card report-card">
          <div class="report-icon">📋</div>
          <div class="report-title">Estadísticas Generales</div>
          <div class="report-description">
            Resumen de métricas del sistema
          </div>
          <button @click="generateReport('general')" class="btn btn-primary">
            📋 Generar Reporte
          </button>
        </div>
        
        <div class="card report-card">
          <div class="report-icon">👥</div>
          <div class="report-title">Análisis por Departamento</div>
          <div class="report-description">
            Distribución y rendimiento por área
          </div>
          <button @click="generateReport('departments')" class="btn btn-primary">
            📈 Analizar
          </button>
        </div>
      </div>
    </div>
    
    <!-- Gestión de empleados -->
    <div class="employee-management">
      <h2>👥 Gestión de Empleados</h2>
      
      <!-- Registro de nuevo empleado -->
      <div class="grid grid-2 mb-6">
        <div class="card">
          <div class="card-title">➕ Registrar Nuevo Empleado</div>
          <form @submit.prevent="registerNewEmployee" class="employee-form">
            <div class="form-group">
              <label>Nombre Completo</label>
              <input v-model="newEmployee.name" 
                     type="text" 
                     class="form-input" 
                     placeholder="Ej: María González"
                     required />
            </div>
            <div class="form-group">
              <label>Correo Electrónico</label>
              <input v-model="newEmployee.email" 
                     type="email" 
                     class="form-input" 
                     placeholder="maria.gonzalez@empresa.com"
                     required />
            </div>
            <div class="form-group">
              <label>Contraseña</label>
              <input v-model="newEmployee.password" 
                     type="password" 
                     class="form-input" 
                     placeholder="Mínimo 6 caracteres"
                     minlength="6"
                     required />
            </div>
            <div class="form-group">
              <label>Departamento</label>
              <select v-model="newEmployee.department" class="form-input" required>
                <option value="">Seleccionar departamento</option>
                <option value="Marketing">Marketing</option>
                <option value="IT">Tecnología</option>
                <option value="RRHH">Recursos Humanos</option>
                <option value="Ventas">Ventas</option>
                <option value="Finanzas">Finanzas</option>
                <option value="Operaciones">Operaciones</option>
                <option value="Salud">Salud Ocupacional</option>
                <option value="Mantenimiento">Mantenimiento</option>
              </select>
            </div>
            <div class="form-group">
              <label>Cargo/Posición</label>
              <input v-model="newEmployee.position" 
                     type="text" 
                     class="form-input" 
                     placeholder="Ej: Analista Senior" />
            </div>
            <button type="submit" class="btn btn-success" :disabled="registering">
              <span v-if="registering">⏳ Registrando...</span>
              <span v-else>👤 Registrar Empleado</span>
            </button>
          </form>
        </div>
        
        <!-- Estadísticas de empleados -->
        <div class="card">
          <div class="card-title">📊 Estadísticas de Empleados</div>
          <div class="employee-stats">
            <div class="stat-item">
              <div class="stat-value">{{ employeeStats.total }}</div>
              <div class="stat-label">Total Empleados</div>
            </div>
            <div class="stat-item">
              <div class="stat-value status-healthy">{{ employeeStats.active }}</div>
              <div class="stat-label">Activos</div>
            </div>
            <div class="stat-item">
              <div class="stat-value status-warning">{{ employeeStats.inactive }}</div>
              <div class="stat-label">Inactivos</div>
            </div>
            <div class="stat-item">
              <div class="stat-value status-healthy">{{ employeeStats.newThisMonth }}</div>
              <div class="stat-label">Nuevos este mes</div>
            </div>
          </div>
          
          <!-- Distribución por departamento -->
          <div class="department-distribution">
            <h4>Distribución por Departamento</h4>
            <div class="department-list">
              <div v-for="dept in departmentDistribution" :key="dept.name" 
                   class="department-item">
                <div class="department-name">{{ dept.name }}</div>
                <div class="department-count">{{ dept.count }} empleados</div>
                <div class="department-bar">
                  <div class="department-fill" 
                       :style="{ width: (dept.count / employeeStats.total * 100) + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Lista de empleados -->
      <div class="card">
        <div class="employee-controls">
          <input v-model="searchTerm" 
                 placeholder="Buscar empleado..." 
                 class="search-input" />
          <select v-model="departmentFilter" class="department-filter">
            <option value="">Todos los departamentos</option>
            <option v-for="dept in departments" :key="dept" :value="dept">
              {{ dept }}
            </option>
          </select>
          <select v-model="statusFilter" class="status-filter">
            <option value="">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
        </div>
        
        <div class="employee-table">
          <div class="table-header">
            <div class="col-name">Empleado</div>
            <div class="col-department">Departamento</div>
            <div class="col-position">Cargo</div>
            <div class="col-status">Estado</div>
            <div class="col-created">Registro</div>
            <div class="col-actions">Acciones</div>
          </div>
          
          <div v-for="employee in filteredEmployees" :key="employee.id" 
               class="table-row" :class="{ 'inactive-row': !employee.isActive }">
            <div class="col-name">
              <div class="employee-info">
                <div class="employee-avatar">{{ getEmployeeAvatar(employee.name) }}</div>
                <div>
                  <div class="employee-name">{{ employee.name }}</div>
                  <div class="employee-email">{{ employee.email }}</div>
                </div>
              </div>
            </div>
            <div class="col-department">
              <span class="department-tag">{{ employee.department }}</span>
            </div>
            <div class="col-position">{{ employee.position || 'No especificado' }}</div>
            <div class="col-status">
              <span class="status-badge" :class="employee.isActive ? 'status-active' : 'status-inactive'">
                {{ employee.isActive ? 'Activo' : 'Inactivo' }}
              </span>
            </div>
            <div class="col-created">
              <div class="created-date">{{ formatDate(employee.createdAt) }}</div>
            </div>
            <div class="col-actions">
              <div class="action-buttons">
                <button @click="viewEmployeeDetails(employee)" 
                        class="btn btn-outline btn-sm">
                  👁️ Ver
                </button>
                <button v-if="employee.isActive" 
                        @click="deactivateEmployee(employee.id)" 
                        class="btn btn-outline btn-sm btn-warning">
                  ⏸️ Desactivar
                </button>
                <button v-else 
                        @click="reactivateEmployee(employee.id)" 
                        class="btn btn-outline btn-sm btn-success">
                  ▶️ Activar
                </button>
              </div>
            </div>
          </div>
          
          <!-- Estado vacío -->
          <div v-if="filteredEmployees.length === 0" class="empty-state">
            <div class="empty-icon">👥</div>
            <div class="empty-title">No se encontraron empleados</div>
            <div class="empty-message">
              {{ searchTerm || departmentFilter || statusFilter ? 
                 'Intenta ajustar los filtros de búsqueda' : 
                 'Registra el primer empleado usando el formulario anterior' }}
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Configuración de retos -->
    <div class="challenge-management">
      <h2>🎯 Gestión de Retos</h2>
      <div class="grid grid-2">
        <div class="card">
          <div class="card-title">Crear Nuevo Reto</div>
          <form @submit.prevent="createChallenge" class="challenge-form">
            <div class="form-group">
              <label>Título del Reto</label>
              <input v-model="newChallenge.title" 
                     type="text" 
                     class="form-input" 
                     required />
            </div>
            <div class="form-group">
              <label>Descripción</label>
              <textarea v-model="newChallenge.description" 
                        class="form-input" 
                        rows="3" 
                        required></textarea>
            </div>
            <div class="form-group">
              <label>Puntos de Recompensa</label>
              <input v-model.number="newChallenge.points" 
                     type="number" 
                     class="form-input" 
                     min="1" 
                     required />
            </div>
            <div class="form-group">
              <label>Categoría</label>
              <select v-model="newChallenge.category" class="form-input" required>
                <option value="">Seleccionar categoría</option>
                <option value="activity">Actividad Física</option>
                <option value="breaks">Pausas Activas</option>
                <option value="health">Salud</option>
                <option value="wellness">Bienestar</option>
              </select>
            </div>
            <button type="submit" class="btn btn-primary">
              Crear Reto
            </button>
          </form>
        </div>
        
        <div class="card">
          <div class="card-title">Retos Activos</div>
          <div class="active-challenges">
            <div v-for="challenge in activeChallenges" :key="challenge.id" 
                 class="challenge-item">
              <div class="challenge-info">
                <div class="challenge-name">{{ challenge.title }}</div>
                <div class="challenge-participants">
                  {{ challenge.participants }} participantes
                </div>
              </div>
              <div class="challenge-actions">
                <button @click="editChallenge(challenge)" 
                        class="btn btn-outline btn-sm">
                  Editar
                </button>
                <button @click="deactivateChallenge(challenge.id)" 
                        class="btn btn-outline btn-sm">
                  Desactivar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useHealthStore } from '../stores/health'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'Admin',
  setup() {
    const healthStore = useHealthStore()
    const authStore = useAuthStore()
    
    const searchTerm = ref('')
    const departmentFilter = ref('')
    const statusFilter = ref('')
    const registering = ref(false)
    
    const newEmployee = ref({
      name: '',
      email: '',
      password: '',
      department: '',
      position: ''
    })
    
    const newChallenge = ref({
      title: '',
      description: '',
      points: 50,
      category: ''
    })
    
    const activeChallenges = ref([
      {
        id: 1,
        title: 'Camina 10,000 pasos',
        participants: 18
      },
      {
        id: 2,
        title: 'Pausas Activas Diarias',
        participants: 12
      },
      {
        id: 3,
        title: 'Hidratación Óptima',
        participants: 22
      }
    ])
    
    const teamStats = ref({
      averageSteps: 7850,
      completedChallenges: 156,
      wellnessScore: 78
    })
    
    const systemAlerts = ref([
      {
        id: 1,
        title: 'Empleado con Alto Nivel de Estrés',
        message: 'Monitoreo requerido en departamento de IT',
        severity: 'high',
        timestamp: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Baja Participación en Pausas Activas',
        message: 'Departamento de Ventas tiene 40% de participación',
        severity: 'medium',
        timestamp: new Date().toISOString()
      },
      {
        id: 3,
        title: 'Meta de Pasos Alcanzada',
        message: 'Marketing superó la meta grupal esta semana',
        severity: 'low',
        timestamp: new Date().toISOString()
      }
    ])
    
    // Obtener usuarios reales del store
    const allUsers = computed(() => authStore.getAllUsers())
    const employees = computed(() => allUsers.value.filter(user => user.role === 'employee'))
    
    // Estadísticas de empleados
    const employeeStats = computed(() => {
      const total = employees.value.length
      const active = employees.value.filter(emp => emp.isActive).length
      const inactive = total - active
      
      const thisMonth = new Date()
      thisMonth.setDate(1)
      thisMonth.setHours(0, 0, 0, 0)
      
      const newThisMonth = employees.value.filter(emp => 
        new Date(emp.createdAt) >= thisMonth
      ).length
      
      return { total, active, inactive, newThisMonth }
    })
    
    // Distribución por departamento
    const departmentDistribution = computed(() => {
      const deptCounts = {}
      employees.value.forEach(emp => {
        deptCounts[emp.department] = (deptCounts[emp.department] || 0) + 1
      })
      
      return Object.entries(deptCounts).map(([name, count]) => ({
        name,
        count
      })).sort((a, b) => b.count - a.count)
    })
    
    const departments = computed(() => {
      return [...new Set(employees.value.map(emp => emp.department))]
    })
    
    const filteredEmployees = computed(() => {
      return employees.value.filter(emp => {
        const matchesSearch = emp.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
                            emp.email.toLowerCase().includes(searchTerm.value.toLowerCase())
        const matchesDepartment = !departmentFilter.value || emp.department === departmentFilter.value
        const matchesStatus = !statusFilter.value || 
                            (statusFilter.value === 'active' && emp.isActive) ||
                            (statusFilter.value === 'inactive' && !emp.isActive)
        return matchesSearch && matchesDepartment && matchesStatus
      })
    })
    
    // Funciones para gestión de empleados
    const registerNewEmployee = async () => {
      if (!newEmployee.value.name || !newEmployee.value.email || !newEmployee.value.password) {
        healthStore.addAlert({
          type: 'warning',
          title: 'Campos Requeridos',
          message: 'Por favor completa todos los campos obligatorios'
        })
        return
      }
      
      registering.value = true
      
      try {
        const result = await authStore.registerEmployee(newEmployee.value)
        
        if (result.success) {
          healthStore.addAlert({
            type: 'success',
            title: 'Empleado Registrado',
            message: `${result.employee.name} ha sido registrado exitosamente`
          })
          
          // Limpiar formulario
          newEmployee.value = {
            name: '',
            email: '',
            password: '',
            department: '',
            position: ''
          }
        } else {
          healthStore.addAlert({
            type: 'warning',
            title: 'Error en Registro',
            message: result.error
          })
        }
      } catch (error) {
        healthStore.addAlert({
          type: 'warning',
          title: 'Error',
          message: 'Error inesperado al registrar empleado'
        })
      } finally {
        registering.value = false
      }
    }
    
    const deactivateEmployee = async (employeeId) => {
      if (confirm('¿Estás seguro de que deseas desactivar este empleado?')) {
        const result = await authStore.deactivateUser(employeeId)
        
        if (result.success) {
          healthStore.addAlert({
            type: 'info',
            title: 'Empleado Desactivado',
            message: 'El empleado ha sido desactivado exitosamente'
          })
        } else {
          healthStore.addAlert({
            type: 'warning',
            title: 'Error',
            message: result.error
          })
        }
      }
    }
    
    const reactivateEmployee = async (employeeId) => {
      const result = await authStore.reactivateUser(employeeId)
      
      if (result.success) {
        healthStore.addAlert({
          type: 'success',
          title: 'Empleado Reactivado',
          message: 'El empleado ha sido reactivado exitosamente'
        })
      } else {
        healthStore.addAlert({
          type: 'warning',
          title: 'Error',
          message: result.error
        })
      }
    }
    
    const viewEmployeeDetails = (employee) => {
      healthStore.addAlert({
        type: 'info',
        title: 'Detalles del Empleado',
        message: `Información de ${employee.name} - ${employee.department}`
      })
    }
    
    const getEmployeeAvatar = (name) => {
      const avatars = ['👨‍💼', '👩‍💼', '👨‍💻', '👩‍💻', '👨‍⚕️', '👩‍⚕️', '👨‍🔧', '👩‍🔧']
      const index = name.length % avatars.length
      return avatars[index]
    }
    
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }
    
    const getWellnessStatusColor = () => {
      const score = teamStats.value.wellnessScore
      if (score >= 80) return 'status-healthy'
      if (score >= 60) return 'status-warning'
      return 'status-danger'
    }
    
    const getAlertIcon = (severity) => {
      const icons = {
        high: '🔴',
        medium: '🟡',
        low: '🟢'
      }
      return icons[severity] || '⚠️'
    }
    
    const formatTime = (timestamp) => {
      const date = new Date(timestamp)
      return date.toLocaleString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit'
      })
    }
    
    const resolveAlert = (alertId) => {
      const index = systemAlerts.value.findIndex(alert => alert.id === alertId)
      if (index !== -1) {
        systemAlerts.value.splice(index, 1)
        healthStore.addAlert({
          type: 'success',
          title: 'Alerta Resuelta',
          message: 'La alerta ha sido marcada como resuelta'
        })
      }
    }
    
    const generateReport = (type) => {
      healthStore.addAlert({
        type: 'info',
        title: 'Generando Reporte',
        message: `Preparando reporte de ${type}. Te notificaremos cuando esté listo.`
      })
    }
    
    const exportData = () => {
      const csvData = employees.value.map(emp => ({
        name: emp.name,
        department: emp.department,
        email: emp.email,
        position: emp.position || 'No especificado',
        status: emp.isActive ? 'Activo' : 'Inactivo',
        created: formatDate(emp.createdAt)
      }))
      
      const csvString = [
        ['Nombre', 'Departamento', 'Email', 'Cargo', 'Estado', 'Fecha Registro'],
        ...csvData.map(row => [row.name, row.department, row.email, row.position, row.status, row.created])
      ].map(row => row.join(',')).join('\n')
      
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'empleados_wellness.csv'
      a.click()
      window.URL.revokeObjectURL(url)
      
      healthStore.addAlert({
        type: 'success',
        title: 'Datos Exportados',
        message: 'Lista de empleados exportada exitosamente'
      })
    }
    
    const createChallenge = () => {
      if (newChallenge.value.title && newChallenge.value.description) {
        activeChallenges.value.push({
          id: Date.now(),
          title: newChallenge.value.title,
          participants: 0
        })
        
        healthStore.addAlert({
          type: 'success',
          title: 'Reto Creado',
          message: `El reto "${newChallenge.value.title}" ha sido creado exitosamente`
        })
        
        // Limpiar formulario
        newChallenge.value = {
          title: '',
          description: '',
          points: 50,
          category: ''
        }
      }
    }
    
    const editChallenge = (challenge) => {
      healthStore.addAlert({
        type: 'info',
        title: 'Editar Reto',
        message: `Editando reto: ${challenge.title}`
      })
    }
    
    const deactivateChallenge = (challengeId) => {
      const index = activeChallenges.value.findIndex(c => c.id === challengeId)
      if (index !== -1) {
        activeChallenges.value.splice(index, 1)
        healthStore.addAlert({
          type: 'info',
          title: 'Reto Desactivado',
          message: 'El reto ha sido desactivado exitosamente'
        })
      }
    }
    
    return {
      searchTerm,
      departmentFilter,
      statusFilter,
      registering,
      newEmployee,
      newChallenge,
      activeChallenges,
      teamStats,
      systemAlerts,
      allUsers,
      employees,
      employeeStats,
      departmentDistribution,
      departments,
      filteredEmployees,
      registerNewEmployee,
      deactivateEmployee,
      reactivateEmployee,
      viewEmployeeDetails,
      getEmployeeAvatar,
      formatDate,
      getWellnessStatusColor,
      getAlertIcon,
      formatTime,
      resolveAlert,
      generateReport,
      exportData,
      createChallenge,
      editChallenge,
      deactivateChallenge
    }
  }
}
</script>

<style scoped>
.admin-page {
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

.admin-metrics,
.system-alerts,
.reports-section,
.employee-management,
.challenge-management {
  margin-bottom: 40px;
}

.admin-metrics h2,
.reports-section h2,
.employee-management h2,
.challenge-management h2 {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 20px;
}

.mb-6 {
  margin-bottom: 24px;
}

/* Formulario de empleado */
.employee-form,
.challenge-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-weight: 500;
  color: var(--text-dark);
  font-size: 14px;
}

.form-input {
  padding: 8px 12px;
  border: 1px solid var(--border-light);
  border-radius: 6px;
  font-size: 14px;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-blue);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

/* Estadísticas de empleados */
.employee-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-item {
  text-align: center;
  padding: 16px;
  background: var(--light-gray);
  border-radius: 8px;
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
}

/* Distribución por departamento */
.department-distribution h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: var(--text-dark);
}

.department-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.department-item {
  padding: 8px 0;
}

.department-name {
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 4px;
}

.department-count {
  font-size: 12px;
  color: var(--text-gray);
  margin-bottom: 8px;
}

.department-bar {
  height: 4px;
  background: var(--border-light);
  border-radius: 2px;
  overflow: hidden;
}

.department-fill {
  height: 100%;
  background: var(--primary-blue);
  border-radius: 2px;
  transition: width 0.3s ease;
}

/* Alertas */
.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.alert-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid;
}

.alert-high {
  background: #fef2f2;
  border-left-color: #ef4444;
}

.alert-medium {
  background: #fefcbf;
  border-left-color: #f59e0b;
}

.alert-low {
  background: var(--light-green);
  border-left-color: var(--success-green);
}

.alert-icon {
  font-size: 20px;
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
  margin-bottom: 4px;
}

.alert-time {
  color: var(--text-gray);
  font-size: 12px;
}

/* Controles de empleados */
.employee-controls {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.search-input,
.department-filter,
.status-filter {
  padding: 8px 12px;
  border: 1px solid var(--border-light);
  border-radius: 6px;
  font-size: 14px;
}

.search-input {
  flex: 1;
  min-width: 200px;
}

.department-filter,
.status-filter {
  min-width: 180px;
}

/* Tabla de empleados */
.employee-table {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border-light);
}

.table-header,
.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1.5fr;
  gap: 16px;
  padding: 12px 16px;
  align-items: center;
}

.table-header {
  background: var(--light-gray);
  font-weight: 600;
  color: var(--text-dark);
  font-size: 14px;
}

.table-row {
  border-top: 1px solid var(--border-light);
  transition: background 0.2s ease;
}

.table-row:hover {
  background: var(--light-gray);
}

.table-row.inactive-row {
  opacity: 0.6;
  background: #f9fafb;
}

.employee-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.employee-avatar {
  font-size: 20px;
}

.employee-name {
  font-weight: 600;
  color: var(--text-dark);
}

.employee-email {
  font-size: 12px;
  color: var(--text-gray);
}

.department-tag {
  background: var(--light-blue);
  color: var(--primary-blue);
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.status-active {
  background: var(--light-green);
  color: var(--success-green);
}

.status-inactive {
  background: var(--border-light);
  color: var(--text-gray);
}

.created-date {
  font-size: 12px;
  color: var(--text-gray);
}

.action-buttons {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.btn-warning {
  background: #fef3c7;
  color: #f59e0b;
  border-color: #f59e0b;
}

.btn-warning:hover {
  background: #fde68a;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 12px;
}

/* Estado vacío */
.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px 20px;
  color: var(--text-gray);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 8px;
}

.empty-message {
  font-size: 14px;
}

/* Reportes */
.report-card {
  text-align: center;
  transition: transform 0.2s ease;
}

.report-card:hover {
  transform: translateY(-2px);
}

.report-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.report-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 8px;
}

.report-description {
  color: var(--text-gray);
  font-size: 14px;
  margin-bottom: 16px;
}

/* Gestión de retos */
.active-challenges {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.challenge-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: var(--light-gray);
  border-radius: 8px;
}

.challenge-info {
  flex: 1;
}

.challenge-name {
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 4px;
}

.challenge-participants {
  font-size: 12px;
  color: var(--text-gray);
}

.challenge-actions {
  display: flex;
  gap: 8px;
}

/* Responsive */
@media (max-width: 768px) {
  .employee-stats {
    grid-template-columns: 1fr;
  }
  
  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .employee-controls {
    flex-direction: column;
  }
  
  .search-input,
  .department-filter,
  .status-filter {
    min-width: auto;
  }
  
  .action-buttons,
  .challenge-actions {
    justify-content: center;
  }
  
  .challenge-item {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
}
</style>