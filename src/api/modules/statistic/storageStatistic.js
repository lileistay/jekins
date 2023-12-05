import { req } from '@/api/request'

// 库房首页统计
function getHeaderStatistic(data) {
  return req('/api/statistics/storageStatistic/getHeaderStatistic', 'get', data)
}

// 物资售卖统计
function getDrugReceiveStatistics(data) {
  return req('/api/statistics/storageStatistic/getDrugReceiveStatistics', 'get', data)
}

export default {
  getHeaderStatistic,
  getDrugReceiveStatistics
}
