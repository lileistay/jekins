import { req } from '@/api/request'
// 文件设置列表
function protocolManagementList(data) {
  return req('/api/share/protocolManagementList/list','get',data)
}
// 新增
function addprotocolManagementList(data) {
  return req('/api/share/protocolManagementList','post',data)
}
// 修改
function editprotocolManagementList(data) {
  return req('/api/share/protocolManagementList','put',data)
}
// 删除
function deleteprotocolManagementList(data) {
  return req(`/api/share/protocolManagementList/${data}`,'DELETE')
}

// 获取文件信息
function getprotocolManagementLists(data) {
  return req(`/api/share/protocolManagementList/${data}`,'get')
}

export default {
  protocolManagementList,
  addprotocolManagementList,
  editprotocolManagementList,
  deleteprotocolManagementList,
  getprotocolManagementLists
}