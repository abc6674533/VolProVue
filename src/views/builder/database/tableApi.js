import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:9100/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default {
  // 获取所有表
  getAllTables() {
    return api.get('/table')
  },

  // 获取表信息
  getTableInfo(tableName) {
    return api.get(`/table/${tableName}`)
  },

  // 创建表
  createTable(data) {
    return api.post('/table', data)
  },

  // 更新表
  updateTable(tableName, data) {
    return api.put(`/table/${tableName}`, data)
  },

  // 删除表
  deleteTable(tableName) {
    return api.delete(`/table/${tableName}`)
  },

  // 检查表是否存在
  tableExists(tableName) {
    return api.get(`/table/${tableName}/exists`)
  }
}