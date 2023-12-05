import { req } from '@/api/request'
import { download } from '@/utils/request'

// 临客电话修改记录列表
function getAscriptionChangeList(data) {
  return req('/api/confinement/changeList/list', 'get', data)
}

// 正客修改记录
function getChangeCustomerRecordList(data) {
  return req('/api/confinement/changeCustomerRecord/list', 'get', data)
}

// 获取可选的修改字段
function getChangeField() {
  return req('/api/confinement/changeCustomerRecord/getChangeField', 'get')
}

// 批量添加正客修改记录
function batchAddChangeCustomerRecordList(data) {
  return req('/api/confinement/changeCustomerRecord/batchAdd', 'post', data)
}

// 导出正客修改记录
function exportChangeCustomerRecordList(data) {
  return download('/api/confinement/changeCustomerRecord/export', {
    ...data
  }, `change_customer_record_${new Date().getTime()}.xlsx`)
}

// 正客合并
function getCustom(data) {
  return req('/api/confinement/customerCmt/getCustom', 'get', data)
}
// 正客合并
function mergeAllCustom(data) {
  return req('/api/confinement/customerCmt/mergeAllCustom', 'post', data)
}


export default {
  getAscriptionChangeList,
  getChangeCustomerRecordList,
  exportChangeCustomerRecordList,
  batchAddChangeCustomerRecordList,
  getChangeField,
  getCustom,
  mergeAllCustom
}
