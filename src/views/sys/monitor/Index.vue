<template>
  <div class="performance-monitor">
    <!-- 顶部简洁标题栏 -->
    <div class="header">
      <div class="header-left">
        <h1 class="title">系统性能监控平台</h1>
        <div class="status-info">
          <span class="status-label">系统状态:</span>
          <span class="status-value" :class="overallStatus">{{ statusText }}</span>
          <span class="update-time">最后更新: {{ lastUpdateTime }}</span>

        </div>

      </div>
      <div class="header-right">
        <div><span class="update-time">*后台配置文件开启montior属性后才会监控</span></div>
        <!-- <button class="refresh-btn" @click="refreshData">
          <span>刷新</span>
        </button> -->
      </div>
    </div>

    <div class="main-content">

      <!-- 主监控区域 -->
      <div class="monitor-content">
        <!-- 关键指标卡片 -->
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-header">
              <!-- <span class="metric-icon">⚡</span> -->
              <img src="/static/01.png">
              <span class="metric-name">CPU使用率</span>
            </div>
            <div class="metric-value" :class="getUsageClass(metrics.cpuUsage)">
              {{ metrics.cpuUsage.toFixed(2) }}%
            </div>
            <AlertIndicator :value="metrics.cpuUsage" type="cpu" />
          </div>

          <div class="metric-card">
            <div class="metric-header">
              <!-- <span class="metric-icon">💾</span> -->
              <img src="/static/07.png">
              <span class="metric-name">内存使用率</span>
            </div>
            <div class="metric-value" :class="getUsageClass(metrics.memoryUsagePercentage)">
              {{ metrics.memoryUsagePercentage.toFixed(2) }}%
            </div>
            <AlertIndicator :value="metrics.memoryUsagePercentage" type="memory" />
          </div>
          <div class="metric-card">
            <div class="metric-header">
              <!-- <span class="metric-icon">🖥️</span> -->
              <img src="/static/06.png">
              <span class="metric-name">服务器信息</span>
            </div>
            <div class="metric-subtitle">
              主机: {{ metrics.hostName }}
            </div>
            <div class="metric-subtitle" style="padding-left: 8px;"> IP: {{ metrics.ip }}</div>
            <!-- <div class="metric-subtitle">MAC:{{ metrics.macAddress }}</div> -->
            <div class="metric-subtitle">架构: {{ metrics.systemArchitecture }}</div>
          </div>
          <div class="metric-card">
            <div class="metric-header">
              <!-- <span class="metric-icon">📊</span> -->
              <img src="/static/05.png">
              <span class="metric-name">应用信息</span>
            </div>
            <div class="metric-subtitle">版本: {{ metrics.systemVersion }}</div>
            <div class="metric-subtitle">CPU: {{ metrics.cpuCoreCount }}核</div>
            <div class="metric-subtitle">内存: {{ metrics.usedMemory || '0GB' }}/{{ metrics.totalMemory || '0GB' }}</div>
          </div>


        </div>
        <!-- 历史数据图表 -->
        <div class="main-card">
          <div class="card-title">
            <!-- <h2>📈 内存/CPU使用率</h2> -->
            <h2> <img src="/static/06.png">内存/CPU使用率</h2>

            <div class="time-selector">
              <button class="time-btn active" @click="fetchHistoricalData">刷新数据</button>
            </div>
          </div>

          <div class="chart-container">
            <div ref="chartRef" class="chart-content"></div>
          </div>
        </div>
        <!-- 磁盘信息 -->
        <div class="main-card" v-if="metrics.diskInfo && metrics.diskInfo.length > 0">
          <div class="card-title">
            <!-- <h2>💿 磁盘使用情况</h2> -->
            <h2> <img src="/static/04.png">磁盘使用情况</h2>
          </div>

          <div class="disk-grid">
            <div class="disk-card" v-for="(disk, index) in metrics.diskInfo" :key="index">
              <div class="disk-header">
                <span class="disk-name">{{ disk.DiskName }}</span>
                <span class="disk-type">{{ disk.TypeName }}</span>
              </div>
              <div class="disk-usage">
                <div class="usage-bar">
                  <div class="usage-fill" :style="{ width: (disk.AvailablePercent) + '%' }"
                    :class="getDiskUsageClass(disk.AvailablePercent)">
                  </div>
                </div>
                <div class="usage-text">
                  <span>已用: {{ formatBytes(disk.Used * 1024 * 1024 * 1024) }} ({{ disk.Used * 1.0?.toFixed(1) }}
                    GB)</span>
                  <span>可用: {{ formatBytes(disk.AvailableFreeSpace * 1024 * 1024 * 1024) }} ({{
                    disk.AvailableFreeSpace * 1.0?.toFixed(1) }} GB)</span>
                  <span>总共: {{ formatBytes(disk.TotalSize * 1024 * 1024 * 1024) }} ({{ disk.TotalSize * 1.0?.toFixed(1)
                  }}
                    GB)</span>
                </div>
              </div>
              <div class="disk-percentage">
                使用率: {{ (disk.AvailablePercent) * 1.0?.toFixed(1) }}%
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>

    <!-- 简洁底部 -->
    <div class="footer">
      <div class="footer-content">
        <span class="footer-text">监控系统 v1.0</span>
        <span class="footer-divider">|</span>
        <span class="footer-text">数据更新间隔: 20秒</span>
        <span class="footer-divider">|</span>
        <span class="footer-text">三级预警: 警告(黄色) / 严重(橙色) / 故障(红色)</span>
      </div>
    </div>
  </div>
</template>

<script setup>

defineOptions({ name: "monitor" })
import { ref, onMounted, onBeforeUnmount, computed, getCurrentInstance, onUnmounted, watch } from 'vue'
import AlertIndicator from './AlertIndicator.vue'
import * as signalR from '@microsoft/signalr'
import * as echarts from 'echarts'

//const API_BASE_URL = 'http://localhost:9100/api/Monitor'
const { proxy } = getCurrentInstance();


const connection = ref(null)
const isConnected = ref(false)
const isMonitoring = ref(false)
const isVisible = ref(true) // 添加页面可见性变量

const metrics = ref({
  hostName: "Unknown",
  ip: "127.0.0.1",
  macAddress: "-",
  cpuUsage: 0,
  memoryUsage: 0,
  memoryUsagePercentage: 0,
  cacheHitRate: 0,
  errorRate: 0,
  apiResponseTimes: [],
  requestCount: 0,
  errorCount: 0,
  diskInfo: []
})

const topApis = ref([])
const thresholds = ref([])
const historicalData = ref([])
const lastUpdateTime = ref(new Date().toLocaleTimeString())
const overallStatus = ref('normal')
const statusText = ref('正常')
const activeTimeRange = ref('realtime')

// 历史图表相关
const chartRef = ref(null)
let chartInstance = null

let refreshInterval = null

// 数据获取方法
const fetchCurrentMetrics = async () => {
  try {
    //const response = await axios.get(`${API_BASE_URL}/current`)
    const response = await proxy.http.get("api/Monitor/current", {}, false);
    // 确保响应数据存在
    if (response.data && response.data.data) {
      metrics.value = response.data.data
    } else {
      metrics.value = response.data
    }
    lastUpdateTime.value = new Date().toLocaleTimeString()
    updateOverallStatus()
  } catch (error) {
    console.error('获取指标失败:', error)
  }
}

const fetchHistoricalData = async () => {
  try {
    // 获取最近24小时的数据
    const to = new Date()
    const from = new Date(to.getTime() - 24 * 60 * 60 * 1000)

    const response = await proxy.http.get("api/Monitor/history", {
      from: from.toISOString(),
      to: to.toISOString()
    }, false);

    if (response.data) {
      historicalData.value = response.data
      renderChart()
    }
  } catch (error) {
    console.error('获取历史数据失败:', error)
  }
}


// 辅助方法
const updateOverallStatus = () => {
  const cpu = metrics.value.cpuUsage
  const memory = metrics.value.memoryUsagePercentage
  const errorRate = metrics.value.errorRate

  if (cpu >= 95 || memory >= 95 || errorRate >= 20) {
    overallStatus.value = 'fatal'
    statusText.value = '故障'
  } else if (cpu >= 85 || memory >= 90 || errorRate >= 10) {
    overallStatus.value = 'critical'
    statusText.value = '严重'
  } else if (cpu >= 70 || memory >= 75 || errorRate >= 5) {
    overallStatus.value = 'warning'
    statusText.value = '警告'
  } else {
    overallStatus.value = 'normal'
    statusText.value = '正常'
  }

  if (metrics.value?.apiResponseTimes) {

    // 去重并过滤空值
    const methods = [...new Set(
      metrics.value.apiResponseTimes
        .map(item => item.method?.trim())
        .filter(method => method && method.length > 0)
    )]
    //uniqueMethods.value=methods
    //console.log("测试methods",methods)
    /// [...new Set(methods)]
  }

}

// 选中的方法
const selectedMethod = ref('')

// 获取所有不同的接口方法
const uniqueMethods = computed(() => {
  // 使用 metrics.value 而不是 props.metrics
  if (!metrics.value?.apiResponseTimes) return []

  const methods = metrics.value.apiResponseTimes
    .map(item => item.method?.trim())
    .filter(method => method && method.length > 0)

  // 使用 Set 去重
  return [...new Set(methods)]
})

// 筛选后的数据 - 修正版本
const filteredData = computed(() => {
  // 使用 metrics.value 而不是 props.metrics
  if (!metrics.value?.apiResponseTimes || metrics.value.apiResponseTimes.length === 0) {
    return []
  }

  let data = [...metrics.value.apiResponseTimes]

  // 如果选择了特定方法，进行过滤
  if (selectedMethod.value) {
    data = data.filter(item => {
      const method = item.method?.trim()
      const match = method === selectedMethod.value
      return match
    })
  }


  // 取最新的10条数据
  return data.slice(0, 10)
})

const getUsageClass = (value) => {
  if (value >= 95) return 'fatal'
  if (value >= 85) return 'critical'
  if (value >= 70) return 'warning'
  return 'normal'
}

const getCacheClass = (value) => {
  if (value < 70) return 'low'
  if (value < 85) return 'normal'
  return 'high'
}


const renderChart = () => {
  if (!chartRef.value || historicalData.value.length === 0) return

  // 销毁之前的图表实例
  if (chartInstance) {
    chartInstance.dispose()
  }

  // 创建新的图表实例
  chartInstance = echarts.init(chartRef.value)

  // 准备数据
  const times = historicalData.value.map(item => {
    // return item.recordTime;
    const date = new Date(item.recordTime)
    return date.toLocaleTimeString('zh-CN', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    })
  })

  const cpuData = historicalData.value.map(item => item.cpuUsage || 0)
  const memoryData = historicalData.value.map(item => item.memoryUsage || 0)

  const option = {
    title: {
      text: '内存/CPU使用率',
      left: 'center',
      textStyle: {
        color: '#1a1a1a',
        fontSize: 16
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['CPU使用率', '内存使用率'],
      top: 30
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: times,
      axisLabel: {
        rotate: 45
      }
    },
    yAxis: {
      type: 'value',
      name: '使用率 (%)',
      min: 0,
      max: 100
    },
    series: [
      {
        name: 'CPU使用率',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          color: '#1890ff',
          width: 2
        },
        itemStyle: {
          color: '#1890ff'
        },
        data: cpuData
      },
      {
        name: '内存使用率',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          color: '#52c41a',
          width: 2
        },
        itemStyle: {
          color: '#52c41a'
        },
        data: memoryData
      }
    ]
  }

  chartInstance.setOption(option)

  // 监听窗口大小变化
  const resizeHandler = () => {
    chartInstance.resize()
  }
  window.addEventListener('resize', resizeHandler)
}

const getDiskUsageClass = (availablePercent) => {
  const usedPercent = availablePercent
  if (usedPercent >= 95) return 'fatal'
  if (usedPercent >= 85) return 'critical'
  if (usedPercent >= 70) return 'warning'
  return 'normal'
}

const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const errorRateClass = computed(() => {
  const rate = metrics.value.errorRate
  if (rate >= 20) return 'fatal'
  if (rate >= 10) return 'critical'
  if (rate >= 5) return 'warning'
  return 'normal'
})

// 本地预警阈值配置
const safeThresholds = computed(() => {
  return [
    { level: "Warning", cpuThreshold: 70, memoryThreshold: 75, errorRateThreshold: 5, responseTimeThreshold: 1000 },
    { level: "Critical", cpuThreshold: 85, memoryThreshold: 90, errorRateThreshold: 10, responseTimeThreshold: 2000 },
    { level: "Fatal", cpuThreshold: 95, memoryThreshold: 95, errorRateThreshold: 20, responseTimeThreshold: 5000 }
  ]
})



const refreshData = async () => {
  await Promise.all([
    fetchCurrentMetrics(),
  ])
}


const fetchCurrentMetricsSignalR = () => {
  return;
  // 创建连接（地址对应后端MapHub的路由）
  connection.value = new signalR.HubConnectionBuilder()
    .withUrl(proxy.http.ipAddress + 'performanceMonitorSignalR')
    .withAutomaticReconnect([0, 2000, 5000, 10000]) // 建议启用自动重连
    .configureLogging(signalR.LogLevel.Information)
    .build()

  // 监听服务器推送的"PerformanceMonitorCurrent"事件
  connection.value.on('PerformanceMonitorCurrent', (response) => {
    // 只更新除diskInfo外的其他字段，保持首次加载时的磁盘信息
    const { diskInfo, ...updateData } = response
    metrics.value = { ...metrics.value, ...updateData }
    lastUpdateTime.value = new Date().toLocaleTimeString()
    updateOverallStatus()
    isMonitoring.value = true // 收到数据说明监控正在进行
  })

  // 连接状态监听
  connection.value.onreconnecting((error) => {
    isConnected.value = false
  })

  connection.value.onreconnected((connectionId) => {
    isConnected.value = true
    // 重新连接后会自动开始接收数据，无需手动调用
  })

  connection.value.onclose((error) => {
    isConnected.value = false
    isMonitoring.value = false
  })

  // 启动连接
  connection.value.start()
    .then(() => {
      isConnected.value = true
      // SignalR连接成功后，会自动开始接收服务端推送的数据进行实时更新
    })
    .catch((error) => {
      console.error('SignalR初始化失败:', error)
    })
}

// 注意：现在监控由服务端统一控制，客户端只需被动接收数据

// 注意：监控现在由服务端统一控制，不再需要根据页面可见性控制

let interVal = setInterval(() => {
  fetchHistoricalData();
  fetchCurrentMetrics();
}, 1000 * 30);

onMounted(async () => {

  // // 设置页面可见性监听
  // const cleanupVisibilityListener = setupPageVisibilityListener()

  // 首先调用API获取当前数据
  await fetchCurrentMetrics()

  // 获取历史数据用于图表显示
  await fetchHistoricalData()

  // 然后连接 SignalR 进行实时更新
  fetchCurrentMetricsSignalR()

  // 保存清理函数以便在组件卸载时调用
  onUnmounted(() => {
    // 清理页面可见性监听
    // cleanupVisibilityListener()

    // 清理图表实例
    if (chartInstance) {
      chartInstance.dispose()
      chartInstance = null
    }

    // 组件卸载时断开连接
    if (connection.value && isConnected.value) {
      connection.value.stop()
    }
    if (interVal) {
      clearInterval(interVal)
    }
  })
})


onBeforeUnmount(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})
</script>

<style scoped>
.performance-monitor {
  /* min-height: 100vh; */
  background: #f8f9fa;
  font-family: 'PingFang SC', 'Microsoft YaHei', 'Segoe UI', sans-serif;
  display: flex;
  flex-direction: column;
}

/* 头部 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 18px;
  border-radius: 12px;
  margin: 18px 18px 0 18px;
  background: #fff;
  box-shadow: 0 6px 13px rgb(240 240 240 / 19%);
}

.header-left {
  display: flex;
  /* flex-direction: column; */
  gap: 8px;
}

.title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.status-info {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 14px;
}

.status-label {
  opacity: 0.9;
}

.status-value {
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.15);
}

.status-value.normal {
  background: rgba(56, 162, 2, 0.949);
  color: #fff;
}

.status-value.warning {
  background: rgba(250, 173, 20, 0.2);
}

.status-value.critical {
  background: rgba(250, 140, 22, 0.2);
}

.status-value.fatal {
  background: rgba(245, 34, 45, 0.2);
}

.update-time {
  opacity: 0.8;
  font-size: 13px;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.refresh-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
}

.refresh-icon {
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* 主内容区 */
.main-content {
  flex: 1;
  display: flex;
  /* min-height: calc(100vh - 140px); */
}

/* 侧边栏 */
.sidebar {
  width: 240px;
  background: #fafafa;
  border-right: 1px solid #e8e8e8;
  padding: 20px 0;
}

.search-box {
  padding: 0 20px 20px;
  border-bottom: 1px solid #e8e8e8;
}

.search-input {
  width: 100%;
  padding: 10px 12px 10px 40px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
  color: #1a1a1a;
  background: white url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'%3E%3C/circle%3E%3Cline x1='21' y1='21' x2='16.65' y2='16.65'%3E%3C/line%3E%3C/svg%3E") no-repeat 12px center;
  background-size: 16px;
}

.search-input:focus {
  outline: none;
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
}

.menu-section {
  padding: 20px;
}

.menu-title {
  margin: 0 0 16px 0;
  font-size: 14px;
  color: #666;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.menu-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.menu-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 6px;
}

.menu-list li:hover {
  color: #1890ff;
  background: rgba(24, 144, 255, 0.05);
  padding-left: 12px;
}

.menu-list li.active {
  color: #1890ff;
  font-weight: 500;
  background: rgba(24, 144, 255, 0.1);
  padding-left: 12px;
}

.menu-icon {
  font-size: 16px;
  width: 20px;
  text-align: center;
}

/* 主监控区域 */
.monitor-content {
  flex: 1;
  padding: 18px;
  padding-bottom: 0;
  overflow-y: auto;
  background: #f8f9fa;
}

/* 关键指标网格 */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 18px;
}

.metric-card {
  background: white;
  border-radius: 12px;
  padding: 18px;
  box-shadow: 0 6px 13px rgb(240 240 240 / 19%);
  transition: all 0.3s ease;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #e6f7ff;
}

.metric-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.metric-icon {
  font-size: 18px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.metric-name {
  font-size: 16px;
  color: #666;
  font-weight: 500;
}

.metric-value {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 12px;
  line-height: 1;
}

.metric-value.normal {
  color: #52c41a;
}

.metric-value.warning {
  color: #faad14;
}

.metric-value.critical {
  color: #fa8c16;
}

.metric-value.fatal {
  color: #f5222d;
}

.metric-value.low {
  color: #faad14;
}

.metric-value.high {
  color: #52c41a;
}

.metric-trend {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #8c8c8c;
}

.trend-icon {
  font-size: 12px;
}

.metric-subtitle {
  font-size: 12px;
  color: #8c8c8c;
  margin-top: 8px;
}

/* 主卡片 */
.main-card {
  background: white;
  border-radius: 12px;
  margin-bottom: 18px;
  box-shadow: 0 6px 13px rgb(240 240 240 / 19%);
  overflow: hidden;
  /* border: 1px solid #f0f0f0; */
}

/* 磁盘信息 */
.disk-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 18px;
  padding: 18px;
}

.disk-card {
  background: #fafafa;
  border-radius: 10px;
  padding: 20px;
  border: 1px solid #f0f0f0;
}

.disk-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.disk-name {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

.disk-type {
  font-size: 12px;
  color: #666;
  background: #e6f7ff;
  padding: 4px 8px;
  border-radius: 4px;
}

.disk-usage {
  margin-bottom: 12px;
}

.usage-bar {
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.usage-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.usage-fill.normal {
  background: linear-gradient(90deg, #52c41a, #73d13d);
}

.usage-fill.warning {
  background: linear-gradient(90deg, #faad14, #fadb14);
}

.usage-fill.critical {
  background: linear-gradient(90deg, #fa8c16, #faad14);
}

.usage-fill.fatal {
  background: linear-gradient(90deg, #f5222d, #ff4d4f);
}

.usage-text {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}

.disk-percentage {
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
}

.card-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 18px;
  border-bottom: 1px solid #f0f0f0;
}

.card-title h2 {
  margin: 0;
  font-size: 18px;
  color: #1a1a1a;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.time-selector {
  display: flex;
  gap: 8px;
}

.time-btn {
  padding: 6px 16px;
  border: 1px solid #d9d9d9;
  background: white;
  border-radius: 4px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.time-btn:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.time-btn.active {
  background: #1890ff;
  border-color: #1890ff;
  color: white;
}


.stats-card {
  display: flex;
  align-items: center;
  gap: 20px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 10px;
  padding: 18px;
  color: white;
}

.stats-icon {
  font-size: 40px;
}

.stats-content {
  flex: 1;
}

.stats-label {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 4px;
}

.stats-value {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
}

.stats-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  opacity: 0.8;
}

/* 图表区域 */
.charts-container {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.chart-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 18px;
}

.chart-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #f0f0f0;
  overflow: hidden;
}

.chart-card.full-width {
  grid-column: 1 / -1;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.chart-header h3 {
  margin: 0;
  font-size: 16px;
  color: #1a1a1a;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.chart-filter,
.export-btn,
.error-info,
.alert-summary {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* .filter-select {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  color: #666;
  background: white;
  cursor: pointer;
  min-width: 120px;
} */

.export-btn {
  padding: 6px 16px;
  border: 1px solid #d9d9d9;
  background: white;
  border-radius: 4px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.export-btn:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.error-label {
  color: #666;
  font-size: 14px;
}

.error-value {
  font-weight: 600;
  font-size: 14px;
  padding: 4px 12px;
  border-radius: 12px;
  background: #f6ffed;
}

.error-value.normal {
  color: #52c41a;
  background: #f6ffed;
}

.error-value.warning {
  color: #faad14;
  background: #fffbe6;
}

.error-value.critical {
  color: #fa8c16;
  background: #fff7e6;
}

.error-value.fatal {
  color: #f5222d;
  background: #fff1f0;
}

.alert-summary {
  gap: 20px;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
}

.summary-item.warning {
  color: #faad14;
}

.summary-item.critical {
  color: #fa8c16;
}

.summary-item.fatal {
  color: #f5222d;
}

.summary-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.summary-item.warning .summary-dot {
  background: #faad14;
}

.summary-item.critical .summary-dot {
  background: #fa8c16;
}

.summary-item.fatal .summary-dot {
  background: #f5222d;
}

.chart-body {
  padding: 20px;
  height: 300px;
}

.chart-card.full-width .chart-body {
  height: 350px;
}

/* 底部 */
.footer {
  padding: 16px 18px;
  background: #fafafa;
  border-top: 1px solid #e8e8e8;
}

.footer-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.footer-text {
  color: #666;
  font-size: 14px;
}

.footer-divider {
  color: #d9d9d9;
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .chart-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e8e8e8;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .disk-grid {
    grid-template-columns: 1fr;
  }

  .disk-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .usage-text {
    flex-direction: column;
    gap: 4px;
  }

  .footer-content {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
}


.chart-filter {
  position: relative;
  display: inline-block;
  min-width: 180px;
}

.select-wrapper {
  position: relative;
  width: 100%;
}

.select-wrapper::after {
  content: "";
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  background-image: url('data:image/svg+xml;utf8,<svg fill="%23666666" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>');
  background-repeat: no-repeat;
  background-size: contain;
  pointer-events: none;
}

.enhanced-select {
  /* 基础样式 */
  width: 100%;
  padding: 10px 40px 10px 15px;
  font-size: 14px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #333;

  /* 边框和背景 */
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  background-color: white;

  /* 移除默认箭头 */
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  /* 过渡效果 */
  transition: all 0.3s ease;
  cursor: pointer;
  outline: none;
}

/* 选中状态 - 字体蓝色 */
.enhanced-select option:checked,
.enhanced-select option:selected {
  color: #1890ff !important;
  /* 选中字为蓝色 */
  font-weight: 500;
}

/* 整个下拉框悬停效果 - 淡灰色背景 */
.enhanced-select:hover {
  border-color: #c0c4cc;
  background-color: #f5f5f5 !important;
  /* 鼠标移上为淡灰色 */
}

/* 焦点状态 */
.enhanced-select:focus {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
  background-color: white;
}

/* 禁用状态 */
.enhanced-select:disabled {
  background-color: #f5f7fa;
  border-color: #e4e7ed;
  color: #c0c4cc;
  cursor: not-allowed;
}

/* 选项通用样式 - 移除悬停效果 */
.enhanced-select option {
  padding: 12px 15px;
  font-size: 14px;
  color: #333;
  background-color: white;
}

/* 取消所有选项的悬停效果 */
.enhanced-select option:hover {
  background-color: white !important;
  /* 保持白色背景，不改变 */
}

/* 选中选项的样式 */
.enhanced-select option:checked {
  /* background-color: #e6f7ff !important; */
  color: #1890ff !important;
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .select-wrapper::after {
    background-image: url('data:image/svg+xml;utf8,<svg fill="%23a0a0a0" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>');
  }

  .enhanced-select {
    background-color: #2d2d2d;
    border-color: #555;
    color: #e0e0e0;
  }

  .enhanced-select:hover {
    background-color: #3a3a3a !important;
    /* 深色模式的悬停灰色 */
    border-color: #666;
  }

  .enhanced-select:focus {
    border-color: #1890ff;
    background-color: #2d2d2d;
  }

  .enhanced-select option {
    background-color: #2d2d2d !important;
    color: #e0e0e0;
  }

  /* 取消深色模式下选项悬停效果 */
  .enhanced-select option:hover {
    background-color: #2d2d2d !important;
  }

  .enhanced-select option:checked {
    background-color: #15395b !important;
    color: #1890ff !important;
  }
}

/* 移动端优化 */
@media (max-width: 768px) {
  .chart-filter {
    width: 100%;
    margin-bottom: 10px;
  }

  .enhanced-select {
    padding: 12px 40px 12px 15px;
    font-size: 16px;
  }
}

/* 兼容性处理 */
.enhanced-select::-ms-expand {
  display: none;
}

/* 针对 Webkit 浏览器的选项样式增强 */
@media screen and (-webkit-min-device-pixel-ratio: 0) {
  .enhanced-select option {
    padding: 10px 15px;
    margin: 2px 0;
  }

  /* 取消 Webkit 浏览器中选项的悬停效果 */
  .enhanced-select option:hover {
    background-color: inherit !important;
  }

  /* 图表样式 */
  .chart-container {
    padding: 20px;
    height: 400px;
  }

  .chart-content {
    width: 100%;
    height: 100%;
  }
}

.metric-header img,
.card-title img {
  width: 40px;
  border-radius: 10px;
}
</style>