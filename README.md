# 💚 WellnessApp - Monitoreo Inteligente de Bienestar Laboral

## 📋 Descripción

WellnessApp es una aplicación web progresiva diseñada para el monitoreo del bienestar físico y mental de los trabajadores durante la jornada laboral. Utiliza tecnología moderna para promover hábitos saludables a través de un sistema de incentivos y gamificación.

## ✨ Características Principales

### 🏠 Dashboard Principal
- **Métricas en tiempo real**: Frecuencia cardíaca, pasos, nivel de estrés, hidratación
- **Alertas inteligentes**: Notificaciones personalizadas para pausas activas
- **Estado de bienestar general**: Puntuación integral basada en múltiples métricas
- **Recomendaciones personalizadas**: Actividades sugeridas según el perfil del usuario

### 📊 Monitoreo de Actividad
- **Seguimiento detallado**: Pasos, calorías, distancia, temperatura corporal
- **Gráficos interactivos**: Visualización de tendencias semanales
- **Pausas activas**: Biblioteca de ejercicios y técnicas de relajación
- **Historial completo**: Registro de todas las actividades y logros

### 🎁 Sistema de Recompensas
- **Gamificación completa**: Puntos, niveles, rankings y desafíos
- **Retos personalizados**: Metas adaptadas a cada sector empresarial
- **Tienda de recompensas**: Canje de puntos por beneficios reales
- **Competencia saludable**: Rankings de equipo y reconocimientos

### ⚙️ Panel de Administración
- **Gestión de empleados**: Monitoreo del estado de bienestar del equipo
- **Alertas del sistema**: Identificación temprana de riesgos de salud
- **Estadísticas por departamento**: Análisis comparativo de métricas
- **Creación de retos**: Herramientas para diseñar desafíos personalizados
- **Reportes automáticos**: Exportación de datos y análisis de tendencias

## 🎨 Diseño y UX

### Paleta de Colores Saludable
- **Azul Primario** (#2563eb): Confianza y profesionalismo
- **Verde Saludable** (#059669): Vitalidad y bienestar
- **Blanco** (#ffffff): Limpieza y claridad
- **Gris Suave** (#f8fffe): Tranquilidad y balance

### Principios de Diseño
- **Minimalismo**: Interfaz limpia y sin distracciones
- **Accesibilidad**: Contraste adecuado y navegación intuitiva
- **Responsividad**: Adaptación perfecta a dispositivos móviles
- **Micro-interacciones**: Animaciones sutiles que mejoran la experiencia

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Vue 3**: Framework progresivo con Composition API
- **Pinia**: Gestión de estado moderna y reactiva
- **Vue Router**: Navegación SPA con guards de autenticación
- **CSS Variables**: Sistema de diseño consistente
- **Canvas API**: Gráficos personalizados de alta performance

### Arquitectura
- **Componentes modulares**: Estructura escalable y mantenible
- **Stores especializados**: Separación clara de responsabilidades
- **LocalStorage**: Persistencia de datos sin backend
- **Responsive Design**: Mobile-first approach

## 📁 Estructura del Proyecto

```
wellness-app/
├── public/
│   └── index.html                 # Punto de entrada HTML
├── src/
│   ├── components/
│   │   ├── common/                # Componentes reutilizables
│   │   │   ├── Navbar.vue        # Barra de navegación
│   │   │   ├── Sidebar.vue       # Menú lateral
│   │   │   └── Card.vue          # Tarjeta base
│   │   ├── dashboard/             # Componentes del dashboard
│   │   │   ├── ActivityChart.vue # Gráfico de actividad
│   │   │   └── WeeklyChart.vue   # Gráfico semanal
│   │   └── admin/                 # Componentes de administración
│   │       └── DepartmentChart.vue # Gráfico departamental
│   ├── views/                     # Vistas principales
│   │   ├── Login.vue             # Página de login
│   │   ├── Dashboard.vue         # Panel principal
│   │   ├── Activity.vue          # Monitoreo de actividad
│   │   ├── Rewards.vue           # Sistema de recompensas
│   │   └── Admin.vue             # Panel de administración
│   ├── stores/                    # Gestión de estado Pinia
│   │   ├── auth.js               # Autenticación
│   │   ├── health.js             # Métricas de salud
│   │   └── rewards.js            # Sistema de recompensas
│   ├── router/
│   │   └── index.js              # Configuración de rutas
│   ├── assets/
│   │   └── styles.css            # Estilos globales
│   ├── utils/
│   │   └── localStorage.js       # Utilidades de almacenamiento
│   ├── App.vue                   # Componente raíz
│   └── main.js                   # Punto de entrada JavaScript
├── package.json                  # Dependencias del proyecto
├── vite.config.js               # Configuración de Vite
└── README.md                    # Documentación
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- **Node.js** (versión 16 o superior)
- **npm** o **yarn**

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/wellness-app.git
cd wellness-app
```

2. **Instalar dependencias**
```bash
npm install
# o
yarn install
```

3. **Ejecutar en modo desarrollo**
```bash
npm run dev
# o
yarn dev
```

4. **Compilar para producción**
```bash
npm run build
# o
yarn build
```

5. **Vista previa de producción**
```bash
npm run serve
# o
yarn serve
```

## 👥 Credenciales de Prueba

### Administrador
- **Email**: admin@wellness.com
- **Contraseña**: admin123

### Empleado
- **Email**: empleado@wellness.com
- **Contraseña**: emp123

## 🎯 Casos de Uso por Sector

### 🏥 Sector Salud
- Monitoreo de fatiga en turnos prolongados
- Alertas de agotamiento físico y emocional
- Pausas mentales guiadas para prevenir burnout

### 🎓 Educación
- Control de sedentarismo en docentes
- Pausas activas entre clases
- Monitoreo de esfuerzo vocal

### 🏗️ Construcción y Minería
- Alertas por sobreesfuerzo físico
- Monitoreo de hidratación en ambientes calurosos
- Detección de fatiga extrema

### 📞 Call Centers
- Técnicas de relajación para reducir estrés
- Pausas visuales para fatiga ocular
- Ejercicios posturales

## 🔒 Privacidad y Seguridad

- **Monitoreo limitado**: Solo durante horario laboral autorizado
- **Datos encriptados**: Toda la información sensible está protegida
- **Consentimiento informado**: Los usuarios deben aprobar el monitoreo
- **Configuración personalizable**: Cada empresa define sus parámetros

## 📊 Métricas Monitoreadas

### Actividad Física
- Pasos diarios
- Distancia recorrida
- Calorías quemadas
- Intensidad de actividad

### Variables Fisiológicas
- Frecuencia cardíaca
- Variabilidad cardíaca (HRV)
- Temperatura corporal
- Presión arterial (opcional)

### Bienestar Mental
- Nivel de estrés estimado
- Calidad de pausas
- Participación en actividades de bienestar

## 🎮 Sistema de Gamificación

### Puntos y Niveles
- **Puntos por actividad**: Cada acción saludable otorga puntos
- **Sistema de niveles**: Progresión basada en puntos acumulados
- **Multiplicadores**: Bonificaciones por consistencia

### Retos y Desafíos
- **Retos diarios**: Metas de corto plazo
- **Desafíos semanales**: Objetivos más ambiciosos
- **Competencias grupales**: Colaboración entre departamentos

### Recompensas
- **Días libres adicionales**
- **Bonificaciones económicas**
- **Servicios de bienestar** (masajes, membresías)
- **Reconocimientos públicos**

## 🔧 Configuración Personalizable

### Para Empresas
- Definición de horarios laborales
- Configuración de alertas y límites
- Personalización de recompensas
- Branding corporativo

### Para Empleados
- Preferencias de notificación
- Metas personales
- Configuración de privacidad
- Tipos de pausas preferidas

## 📈 Reportes y Analytics

### Para Administradores
- **Reportes semanales/mensuales** de bienestar del equipo
- **Alertas tempranas** de riesgos de salud
- **Análisis de tendencias** por departamento
- **ROI del programa** de bienestar

### Para Empleados
- **Progreso personal** en métricas de salud
- **Comparación anónima** con promedios del equipo
- **Historial de logros** y recompensas
- **Recomendaciones personalizadas**

## 🌟 Características Avanzadas

### Integración con Wearables
- Compatibilidad con smartbands y relojes inteligentes
- Sincronización automática de datos
- Soporte para múltiples fabricantes

### Inteligencia Artificial
- Recomendaciones personalizadas basadas en patrones
- Detección automática de anomalías
- Predicción de riesgos de salud

### Análisis Predictivo
- Identificación temprana de burnout
- Optimización de horarios de descanso
- Predicción de ausentismo

## 🤝 Contribución

### Cómo Contribuir
1. Fork del proyecto
2. Crear rama para nueva característica (`git checkout -b feature/AmazingFeature`)
3. Commit de cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

### Guías de Desarrollo
- Seguir las convenciones de naming de Vue.js
- Escribir comentarios claros en español
- Mantener la estructura de componentes modular
- Realizar testing antes de enviar PR

## 📱 PWA Support

La aplicación está preparada para funcionar como Progressive Web App:
- **Instalación en dispositivos móviles**
- **Funcionamiento offline** (funcionalidad básica)
- **Notificaciones push** (futuro)
- **Sincronización en background** (futuro)

## 🐛 Problemas Conocidos

- Los gráficos pueden tardar en cargar en dispositivos de baja potencia
- El localStorage tiene límite de almacenamiento (5-10MB)
- Algunas animaciones pueden ser lentas en navegadores antiguos

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o consultas:
- **Email**: soporte@wellnessapp.com
- **Documentación**: [docs.wellnessapp.com](https://docs.wellnessapp.com)
- **Issues**: GitHub Issues

---

**WellnessApp** - Transformando el bienestar laboral a través de la tecnología 💚
