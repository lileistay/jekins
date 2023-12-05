import { req } from '@/api/request'

// 临客电话修改记录列表
function getChangePhoneRecordList(data) {
  return req('/api/confinement/changePhoneRecord/list', 'get', data)
}

// 通过id得到顾客信息
function getInfoById(changeId) {
  return req('/api/confinement/changePhoneRecord/' + changeId, 'get')
}

// 获取顾客手机列表
function deleteChangePhoneRecords(deleteIds) {
  return req('/api/confinement/changePhoneRecord/' + deleteIds, 'delete')
}

export default {
  getChangePhoneRecordList, getInfoById, deleteChangePhoneRecords
}
