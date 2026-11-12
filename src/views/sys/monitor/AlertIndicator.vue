<template>
  <div class="alert-indicator">
    <div class="indicator-dot" :class="alertLevel"></div>
    <span class="indicator-text">{{ alertText }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true,
    validator: (value) => ['cpu', 'memory', 'response', 'error'].includes(value)
  }
})

const thresholds = {
  cpu: { warning: 70, critical: 85, fatal: 95 },
  memory: { warning: 75, critical: 90, fatal: 95 },
  response: { warning: 1000, critical: 2000, fatal: 5000 },
  error: { warning: 5, critical: 10, fatal: 20 }
}

const alertLevel = computed(() => {
  const typeThresholds = thresholds[props.type]
  if (props.value >= typeThresholds.fatal) return 'fatal'
  if (props.value >= typeThresholds.critical) return 'critical'
  if (props.value >= typeThresholds.warning) return 'warning'
  return 'normal'
})

const alertText = computed(() => {
  switch(alertLevel.value) {
    case 'fatal': return '故障'
    case 'critical': return '严重'
    case 'warning': return '警告'
    default: return '正常'
  }
})
</script>

<style scoped>
.alert-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
}

.indicator-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.indicator-dot.normal {
  background-color: #48bb78;
  animation: none;
}

.indicator-dot.warning {
  background-color: #f6e05e;
}

.indicator-dot.critical {
  background-color: #ed8936;
}

.indicator-dot.fatal {
  background-color: #f56565;
}

.indicator-text {
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.indicator-text.normal { color: #48bb78; }
.indicator-text.warning { color: #d69e2e; }
.indicator-text.critical { color: #ed8936; }
.indicator-text.fatal { color: #f56565; }

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}
</style>