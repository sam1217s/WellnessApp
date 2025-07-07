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
          <div class="metric-value status-healthy">{{ teamStats.totalEmployees }}</div>
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
    
    <!-- Estadísticas por departamento -->
    <div class="department-stats">
      <h2>📊 Estadísticas por Departamento</h2>
      <div class="grid grid-2">
        <div class="card">
          <div class="card-title">Actividad Física por Departamento</div>
          <div class="department-chart">
            <DepartmentChart :data="departmentData" metric="steps" />
          </div>
        </div>
        <div class="card">
          <div class="card-title">Nivel de Estrés por Departamento</div>
          <div class="department-chart">
            <DepartmentChart :data="departmentData" metric="stress" />
          </div>
        </div>
      </div>
    </div>
    
    <!-- Lista de empleados -->
    <div class="employee-management">
      <h2>👥 Gestión de Empleados</h2>
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
        </div>
        
        <div class="employee-table">
          <div class="table-header">
            <div class="col-name">Empleado</div>
            <div class="col-department">Departamento</div>
            <div class="col-status">Estado</div>
            <div class="col-metrics">Métricas Hoy</div>
            <div class="col-actions">Acciones</div>
          </div>
          
          <div v-for="employee in filteredEmployees" :key="employee.id" 
               class="table-row">
            <div class="col-name">
              <div class="employee-info">
                <div class="employee-avatar">{{ employee.avatar }}</div>
                <div>
                  <div class="employee-name">{{ employee.name }}</div>
                  <div class="employee-email">{{ employee.email }}</div>
                </div>
              </div>
            </div>
            <div class="col-department">{{ employee.department }}</div>
            <div class="col-status">
              <span class="status-badge" :class="`status-${employee.status}`">
                {{ getStatusText(employee.status) }}
              </span>
            </div>
            <div class="col-metrics">
              <div class="metric-mini">
                <span>{{ employee.todaySteps }}</span> pasos
              </div>
              <div class="metric-mini">
                Estrés: <span :class="getStressClass(employee.stressLevel)">
                  {{ employee.stressLevel }}/5
                </span>
              </div>
            </div>
            <div class="col-actions">
              <button @click="viewEmployeeDetails(employee)" 
                      class="btn btn-outline btn-sm">
                Ver Detalles
              </button>
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
    
    <!-- Reportes -->
    <div class="reports-section">
      <h2>📈 Reportes y Exportación</h2>
      <div class="grid grid-3">
        <div class="card report-card">
          <div class="report-icon">📊</div>
          <div class="report-title">Reporte Semanal</div>
          <div class="report-description">
            Estadísticas de bienestar de la última semana
          </div>
          <button @click="generateReport('weekly')" class="btn btn-primary">
            Generar Reporte
          </button>
        </div>
        
        <div class="card report-card">
          <div class="report-icon">📋</div>
          <div class="report-title">Reporte Mensual</div>
          <div class="report-description">
            Análisis completo del mes anterior
          </div>
          <button @click="generateReport('monthly')" class="btn btn-primary">
            Generar Reporte
          </button>
        </div>
        
        <div class="card report-card">
          <div class="report-icon">📤</div>
          <div class="report-title">Exportar Datos</div>
          <div class="report-description">
            Exportar datos anonimizados en CSV
          </div>
          <button @click="exportData()" class="btn btn-primary">
            Exportar CSV
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useHealthStore } from '../stores/health'
import DepartmentChart from '../components/admin/DepartmentChart.vue'

export default {
  name: 'Admin',
  components: {
    DepartmentChart
  },
  setup() {
    const healthStore = useHealthStore()
    
    const searchTerm = ref('')
    const departmentFilter = ref('')
    
    const newChallenge = ref({
      title: '',
      description: '',
      points: 50,
      category: ''
    })
    
    const teamStats = ref({
      totalEmployees: 24,
      averageSteps: 7850,
      completedChallenges: 156,
      wellnessScore: 78
    })
    
    const systemAlerts = ref([
      {
        id: 1,
        title: 'Empleado con Alto Nivel de Estrés',
        message: 'Juan Pérez ha reportado nivel de estrés 5/5 por 3 días consecutivos',
        severity: 'high',
        timestamp: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Baja Participación en Pausas Activas',
        message: 'Departamento de IT tiene solo 40% de participación esta semana',
        severity: 'medium',
        timestamp: new Date().toISOString()
      },
      {
        id: 3,
        title: 'Meta de Pasos Departamental',
        message: 'Marketing ha superado la meta de pasos por 5 días consecutivos',
        severity: 'low',
        timestamp: new Date().toISOString()
      }
    ])
    
    const employees = ref([
      {
        id: 1,
        name: 'Ana García',
        email: 'ana.garcia@empresa.com',
        department: 'Marketing',
        avatar: '👩‍💼',
        status: 'active',
        todaySteps: 9200,
        stressLevel: 2
      },
      {
        id: 2,
        name: 'Carlos López',
        email: 'carlos.lopez@empresa.com',
        department: 'IT',
        avatar: '👨‍💻',
        status: 'active',
        todaySteps: 6800,
        stressLevel: 3
      },
      {
        id: 3,
        name: 'Juan Pérez',
        email: 'juan.perez@empresa.com',
        department: 'RRHH',
        avatar: '👨‍💼',
        status: 'warning',
        todaySteps: 5400,
        stressLevel: 5
      },
      {
        id: 4,
        name: 'María Silva',
        email: 'maria.silva@empresa.com',
        department: 'Salud',
        avatar: '👩‍⚕️',
        status: 'active',
        todaySteps: 8900,
        stressLevel: 1
      },
      {
        id: 5,
        name: 'Roberto Kim',
        email: 'roberto.kim@empresa.com',
        department: 'Mantenimiento',
        avatar: '👨‍🔧',
        status: 'inactive',
        todaySteps: 0,
        stressLevel: 0
      }
    ])
    
    const departmentData = ref([
      { name: 'Marketing', steps: 8200, stress: 2.1, employees: 6 },
      { name: 'IT', steps: 6800, stress: 3.2, employees: 8 },
      { name: 'RRHH', steps: 7400, stress: 2.8, employees: 4 },
      { name: 'Salud', steps: 9100, stress: 1.9, employees: 3 },
      { name: 'Mantenimiento', steps: 7800, stress: 2.5, employees: 3 }
    ])
    
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
    
    const departments = computed(() => {
      return [...new Set(employees.value.map(emp => emp.department))]
    })
    
    const filteredEmployees = computed(() => {
      return employees.value.filter(emp => {
        const matchesSearch = emp.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
                            emp.email.toLowerCase().includes(searchTerm.value.toLowerCase())
        const matchesDepartment = !departmentFilter.value || emp.department === departmentFilter.value
        return matchesSearch && matchesDepartment
      })
    })
    
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
    
    const getStatusText = (status) => {
      const texts = {
        active: 'Activo',
        warning: 'Atención',
        inactive: 'Inactivo'
      }
      return texts[status] || 'Desconocido'
    }
    
    const getStressClass = (level) => {
      if (level <= 2) return 'status-healthy'
      if (level <= 3) return 'status-warning'
      return 'status-danger'
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
    
    const viewEmployeeDetails = (employee) => {
      healthStore.addAlert({
        type: 'info',
        title: 'Detalles del Empleado',
        message: `Mostrando información detallada de ${employee.name}`
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
    
    const generateReport = (type) => {
      healthStore.addAlert({
        type: 'info',
        title: 'Generando Reporte',
        message: `Generando reporte ${type}. Te notificaremos cuando esté listo.`
      })
    }
    
    const exportData = () => {
      // Simular exportación de datos
      const csvData = employees.value.map(emp => ({
        name: emp.name,
        department: emp.department,
        steps: emp.todaySteps,
        stress: emp.stressLevel
      }))
      
      const csvString = [
        ['Nombre', 'Departamento', 'Pasos', 'Estrés'],
        ...csvData.map(row => [row.name, row.department, row.steps, row.stress])
      ].map(row => row.join(',')).join('\n')
      
      const blob = new Blob([csvString], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'wellness_data.csv'
      a.click()
      window.URL.revokeObjectURL(url)
      
      healthStore.addAlert({
        type: 'success',
        title: 'Datos Exportados',
        message: 'Los datos han sido exportados exitosamente'
      })
    }
    
    return {
      searchTerm,
      departmentFilter,
      newChallenge,
      teamStats,
      systemAlerts,
      employees,
      departmentData,
      activeChallenges,
      departments,
      filteredEmployees,
      getWellnessStatusColor,
      getAlertIcon,
      getStatusText,
      getStressClass,
      formatTime,
      resolveAlert,
      viewEmployeeDetails,
      createChallenge,
      editChallenge,
      deactivateChallenge,
      generateReport,
      exportData
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
.department-stats,
.employee-management,
.challenge-management,
.reports-section {
  margin-bottom: 40px;
}

.admin-metrics h2,
.department-stats h2,
.employee-management h2,
.challenge-management h2,
.reports-section h2 {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 20px;
}

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

.department-chart {
  height: 250px;
}

.employee-controls {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.search-input,
.department-filter {
  padding: 8px 12px;
  border: 1px solid var(--border-light);
  border-radius: 6px;
  font-size: 14px;
}

.search-input {
  flex: 1;
  min-width: 200px;
}

.department-filter {
  min-width: 180px;
}

.employee-table {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border-light);
}

.table-header,
.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr 1fr;
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

.status-warning {
  background: #fef3c7;
  color: #f59e0b;
}

.status-inactive {
  background: var(--border-light);
  color: var(--text-gray);
}

.metric-mini {
  font-size: 12px;
  color: var(--text-gray);
  margin-bottom: 2px;
}

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

.btn-sm {
  padding: 6px 12px;
  font-size: 12px;
}

@media (max-width: 768px) {
  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .col-name::before {
    content: 'Empleado: ';
    font-weight: 600;
  }
  
  .col-department::before {
    content: 'Departamento: ';
    font-weight: 600;
  }
  
  .col-status::before {
    content: 'Estado: ';
    font-weight: 600;
  }
  
  .employee-controls {
    flex-direction: column;
  }
  
  .search-input,
  .department-filter {
    min-width: auto;
  }
}
</style>