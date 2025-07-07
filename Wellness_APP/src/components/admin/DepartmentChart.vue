<template>
  <div class="department-chart">
    <canvas ref="chartCanvas" width="400" height="250"></canvas>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'

export default {
  name: 'DepartmentChart',
  props: {
    data: {
      type: Array,
      required: true
    },
    metric: {
      type: String,
      default: 'steps'
    }
  },
  setup(props) {
    const chartCanvas = ref(null)
    
    const getMetricConfig = () => {
      switch (props.metric) {
        case 'steps':
          return {
            label: 'Promedio de Pasos',
            color: '#2563eb',
            unit: '',
            getValue: (dept) => dept.steps
          }
        case 'stress':
          return {
            label: 'Nivel de Estrés Promedio',
            color: '#f59e0b',
            unit: '/5',
            getValue: (dept) => dept.stress
          }
        default:
          return {
            label: 'Métrica',
            color: '#2563eb',
            unit: '',
            getValue: (dept) => dept.steps
          }
      }
    }
    
    const drawChart = () => {
      const canvas = chartCanvas.value
      if (!canvas) return
      
      const ctx = canvas.getContext('2d')
      const { width, height } = canvas
      
      // Limpiar canvas
      ctx.clearRect(0, 0, width, height)
      
      const config = getMetricConfig()
      const values = props.data.map(config.getValue)
      const maxValue = Math.max(...values)
      const minValue = Math.min(...values)
      const valueRange = maxValue - minValue || 1
      
      // Configuración
      const padding = 40
      const chartHeight = height - padding * 2
      const barWidth = (width - padding * 2) / props.data.length * 0.7
      const barSpacing = (width - padding * 2) / props.data.length * 0.3
      
      // Configurar estilos
      ctx.font = '12px Inter, sans-serif'
      
      // Dibujar título
      ctx.fillStyle = '#1f2937'
      ctx.font = 'bold 14px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(config.label, width / 2, 20)
      
      // Dibujar barras
      props.data.forEach((dept, index) => {
        const value = config.getValue(dept)
        const barHeight = ((value - minValue) / valueRange) * chartHeight
        
        const x = padding + index * (barWidth + barSpacing)
        const y = height - padding - barHeight
        
        // Crear gradiente para la barra
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight)
        gradient.addColorStop(0, config.color)
        gradient.addColorStop(1, config.color + '80')
        
        // Dibujar barra
        ctx.fillStyle = gradient
        ctx.fillRect(x, y, barWidth, barHeight)
        
        // Borde de la barra
        ctx.strokeStyle = config.color
        ctx.lineWidth = 2
        ctx.strokeRect(x, y, barWidth, barHeight)
        
        // Valor encima de la barra
        ctx.fillStyle = '#1f2937'
        ctx.font = 'bold 11px Inter, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(
          value.toFixed(props.metric === 'stress' ? 1 : 0) + config.unit,
          x + barWidth / 2,
          y - 8
        )
        
        // Nombre del departamento
        ctx.fillStyle = '#6b7280'
        ctx.font = '10px Inter, sans-serif'
        ctx.textAlign = 'center'
        
        // Dividir nombres largos en múltiples líneas
        const maxWidth = barWidth + barSpacing
        const words = dept.name.split(' ')
        let line = ''
        let lineY = height - padding + 15
        
        for (let i = 0; i < words.length; i++) {
          const testLine = line + words[i] + ' '
          const metrics = ctx.measureText(testLine)
          const testWidth = metrics.width
          
          if (testWidth > maxWidth && i > 0) {
            ctx.fillText(line, x + barWidth / 2, lineY)
            line = words[i] + ' '
            lineY += 12
          } else {
            line = testLine
          }
        }
        ctx.fillText(line, x + barWidth / 2, lineY)
        
        // Número de empleados (pequeño)
        ctx.fillStyle = '#9ca3af'
        ctx.font = '9px Inter, sans-serif'
        ctx.fillText(
          `(${dept.employees} emp)`,
          x + barWidth / 2,
          lineY + 12
        )
      })
      
      // Dibujar líneas de referencia
      ctx.strokeStyle = '#e5e7eb'
      ctx.lineWidth = 1
      
      // 3 líneas horizontales de referencia
      for (let i = 1; i <= 3; i++) {
        const y = height - padding - (chartHeight / 4) * i
        ctx.beginPath()
        ctx.moveTo(padding, y)
        ctx.lineTo(width - padding, y)
        ctx.stroke()
        
        // Etiquetas de valores de referencia
        const refValue = minValue + (valueRange / 4) * i
        ctx.fillStyle = '#9ca3af'
        ctx.font = '10px Inter, sans-serif'
        ctx.textAlign = 'right'
        ctx.fillText(
          refValue.toFixed(props.metric === 'stress' ? 1 : 0),
          padding - 10,
          y + 3
        )
      }
    }
    
    onMounted(() => {
      drawChart()
    })
    
    watch([() => props.data, () => props.metric], () => {
      drawChart()
    }, { deep: true })
    
    return {
      chartCanvas
    }
  }
}
</script>

<style scoped>
.department-chart {
  width: 100%;
  height: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
}

canvas {
  max-width: 100%;
  height: auto;
}
</style>