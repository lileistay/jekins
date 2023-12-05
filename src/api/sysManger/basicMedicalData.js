import { req } from '@/api/request'

// 给药途径list
function drugDeliveryRouteList(data) {
  return req('/api/share/drugDeliveryRoute/list', 'get', data)
}
// 添加给药途径
function addDrugDeliveryRoute(data) {
  return req('/api/share/drugDeliveryRoute', 'post', data)
}
// 添加给药途径
function editDrugDeliveryRoute(data) {
  return req('/api/share/drugDeliveryRoute', 'put', data)
}
// 删除给药途径
function removeDrugDeliveryRoute(drugIds) {
  return req(`/api/share/drugDeliveryRoute/${drugIds}`, 'delete')
}

// 处方模板
function prescriptionTemplateSettingsList(data) {
  return req('/api/share/prescriptionTemplateInfo/list', 'get', data)
}
// 处方模板详情
function prescriptionTemplateSettingsInfo(data) {
  return req('/api/share/prescriptionList/list', 'get', data)
}
// 添加处方模板
function addPrescriptionTemplateSettings(data) {
  return req('/api/share/prescriptionTemplateInfo', 'post', data)
}
// 添加处方模板
function editPrescriptionTemplateSettings(data) {
  return req('/api/share/prescriptionTemplateInfo', 'put', data)
}
// 删除处方模板
function removePrescriptionTemplateSettings(relationshipNumber) {
  return req(`/api/share/prescriptionTemplateInfo/${relationshipNumber}`, 'delete')
}

export default {
  drugDeliveryRouteList,
  addDrugDeliveryRoute,
  editDrugDeliveryRoute,
  removeDrugDeliveryRoute,
  prescriptionTemplateSettingsList,
  addPrescriptionTemplateSettings,
  editPrescriptionTemplateSettings,
  removePrescriptionTemplateSettings,
  prescriptionTemplateSettingsInfo
}
