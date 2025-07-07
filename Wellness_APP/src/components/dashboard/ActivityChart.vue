<template>
  <div class="activity-chart">
    <canvas ref="chartCanvas" width="400" height="200"></canvas>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'

export default {
  name: 'ActivityChart',
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const chartCanvas = ref(null)
    
    const drawChart = () => {
      const canvas = chartCanvas.value
      if (!canvas) return
      
      const ctx = canvas.getContext('2d')
      const { width, height } = canvas
      
      // Limpiar canvas
      ctx.clearRect(0, 0, width, height)
      
      // Configuración del gráfico
      const padding = 40
      const chartWidth = width - padding * 2
      const chartHeight = height - padding * 2
      
      // Datos para el gráfico
      const steps = props.data.map(d => d.steps)
      const maxSteps = Math.max(...steps)
      const minSteps = Math.min(...steps)
      const stepRange = maxSteps - minSteps || 1
      
      // Configurar estilos
      ctx.font = '12px Inter, sans-serif'
      ctx.lineWidth = 2
      
      // Dibujar líneas de grid
      ctx.strokeStyle = '#e5e7eb'
      ctx.lineWidth = 1
      
      // Líneas horizontales
      for (let i = 0; i <= 4; i++) {
        const y = padding + (chartHeight / 4) * i
        ctx.beginPath()
        ctx.moveTo(padding, y)
        ctx.lineTo(width - padding, y)
        ctx.stroke()
        
        // Etiquetas del eje Y
        const value = Math.round(maxSteps - (stepRange / 4) * i)
        ctx.fillStyle = '#6b7280'
        ctx.textAlign = 'right'
        ctx.fillText(value.toLocaleString(), padding - 10, y + 4)
      }
      
      // Dibujar línea de datos
      ctx.strokeStyle = '#2563eb'
      ctx.lineWidth = 3
      ctx.beginPath()
      
      props.data.forEach((point, index) => {
        const x = padding + (chartWidth / (props.data.length - 1)) * index
        const y = padding + chartHeight - ((point.steps - minSteps) / stepRange) * chartHeight
        
        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      
      ctx.stroke()
      
      // Dibujar puntos
      ctx.fillStyle = '#2563eb'
      props.data.forEach((point, index) => {
        const x = padding + (chartWidth / (props.data.length - 1)) * index
        const y = padding + chartHeight - ((point.steps - minSteps) / stepRange) * chartHeight
        
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, 2 * Math.PI)
        ctx.fill()
        
        // Etiquetas del eje X
        ctx.fillStyle = '#6b7280'
        ctx.textAlign = 'center'
        ctx.fillText(point.day, x, height - padding + 20)
      })
      
      // Área bajo la curva (gradiente)
      const gradient = ctx.createLinearGradient(0, padding, 0, height - padding)
      gradient.addColorStop(0, 'rgba(37, 99, 235, 0.1)')
      gradient.addColorStop(1, 'rgba(37, 99, 235, 0.01)')
      
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.moveTo(padding, height - padding)
      
      props.data.forEach((point, index) => {
        const x = padding + (chartWidth / (props.data.length - 1)) * index
        const y = padding + chartHeight - ((point.steps - minSteps) / stepRange) * chartHeight
        ctx.lineTo(x, y)
      })
      
      ctx.lineTo(width - padding, height - padding)
      ctx.closePath()
      ctx.fill()
    }
    
    onMounted(() => {
      drawChart()
    })
    
    watch(() => props.data, () => {
      drawChart()
    }, { deep: true })
    
    return {
      chartCanvas
    }
  }
}
</script>

<style scoped>
.activity-chart {
  width: 100%;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
}

canvas {
  max-width: 100%;
  height: auto;
}
</style>