<template>
  <div class="weekly-chart">
    <canvas ref="chartCanvas" width="600" height="300"></canvas>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'

export default {
  name: 'WeeklyChart',
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
    
    const getMetricData = () => {
      switch (props.metric) {
        case 'steps':
          return {
            values: props.data.map(d => d.steps),
            label: 'Pasos',
            color: '#2563eb',
            unit: ''
          }
        case 'heartRate':
          return {
            values: props.data.map(d => d.heartRate),
            label: 'Frecuencia Cardíaca',
            color: '#dc2626',
            unit: 'BPM'
          }
        case 'stress':
          return {
            values: props.data.map(d => d.stress),
            label: 'Nivel de Estrés',
            color: '#f59e0b',
            unit: '/5'
          }
        default:
          return {
            values: props.data.map(d => d.steps),
            label: 'Pasos',
            color: '#2563eb',
            unit: ''
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
      
      // Configuración del gráfico
      const padding = 50
      const chartWidth = width - padding * 2
      const chartHeight = height - padding * 2
      
      // Obtener datos del métrica seleccionada
      const metricData = getMetricData()
      const values = metricData.values
      const maxValue = Math.max(...values)
      const minValue = Math.min(...values)
      const valueRange = maxValue - minValue || 1
      
      // Configurar estilos
      ctx.font = '14px Inter, sans-serif'
      ctx.lineWidth = 2
      
      // Dibujar título
      ctx.fillStyle = '#1f2937'
      ctx.font = 'bold 16px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(`${metricData.label} - Últimos 7 días`, width / 2, 25)
      
      // Dibujar líneas de grid
      ctx.strokeStyle = '#e5e7eb'
      ctx.lineWidth = 1
      ctx.font = '12px Inter, sans-serif'
      
      // Líneas horizontales
      for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i
        ctx.beginPath()
        ctx.moveTo(padding, y)
        ctx.lineTo(width - padding, y)
        ctx.stroke()
        
        // Etiquetas del eje Y
        const value = Math.round(maxValue - (valueRange / 5) * i)
        ctx.fillStyle = '#6b7280'
        ctx.textAlign = 'right'
        ctx.fillText(value + metricData.unit, padding - 10, y + 4)
      }
      
      // Líneas verticales
      props.data.forEach((point, index) => {
        const x = padding + (chartWidth / (props.data.length - 1)) * index
        ctx.beginPath()
        ctx.moveTo(x, padding)
        ctx.lineTo(x, height - padding)
        ctx.stroke()
        
        // Etiquetas del eje X
        ctx.fillStyle = '#6b7280'
        ctx.textAlign = 'center'
        ctx.fillText(point.day, x, height - padding + 20)
      })
      
      // Crear gradiente para el área
      const gradient = ctx.createLinearGradient(0, padding, 0, height - padding)
      gradient.addColorStop(0, metricData.color + '20')
      gradient.addColorStop(1, metricData.color + '05')
      
      // Dibujar área bajo la curva
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.moveTo(padding, height - padding)
      
      values.forEach((value, index) => {
        const x = padding + (chartWidth / (values.length - 1)) * index
        const y = padding + chartHeight - ((value - minValue) / valueRange) * chartHeight
        ctx.lineTo(x, y)
      })
      
      ctx.lineTo(width - padding, height - padding)
      ctx.closePath()
      ctx.fill()
      
      // Dibujar línea de datos
      ctx.strokeStyle = metricData.color
      ctx.lineWidth = 3
      ctx.beginPath()
      
      values.forEach((value, index) => {
        const x = padding + (chartWidth / (values.length - 1)) * index
        const y = padding + chartHeight - ((value - minValue) / valueRange) * chartHeight
        
        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      
      ctx.stroke()
      
      // Dibujar puntos
      ctx.fillStyle = metricData.color
      values.forEach((value, index) => {
        const x = padding + (chartWidth / (values.length - 1)) * index
        const y = padding + chartHeight - ((value - minValue) / valueRange) * chartHeight
        
        ctx.beginPath()
        ctx.arc(x, y, 5, 0, 2 * Math.PI)
        ctx.fill()
        
        // Punto destacado (blanco en el centro)
        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.arc(x, y, 2, 0, 2 * Math.PI)
        ctx.fill()
        ctx.fillStyle = metricData.color
      })
      
      // Dibujar valores en los puntos
      ctx.fillStyle = '#1f2937'
      ctx.font = 'bold 12px Inter, sans-serif'
      ctx.textAlign = 'center'
      
      values.forEach((value, index) => {
        const x = padding + (chartWidth / (values.length - 1)) * index
        const y = padding + chartHeight - ((value - minValue) / valueRange) * chartHeight
        
        ctx.fillText(value + metricData.unit, x, y - 15)
      })
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
.weekly-chart {
  width: 100%;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}

canvas {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}
</style>