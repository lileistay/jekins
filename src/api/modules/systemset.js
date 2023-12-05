import { req } from '@/api/request'
import qs from 'qs'

// 用户列表
function wechatUserList(data) {
  return req('/api/client/wechatUserList/list', 'get', data)
}

// 用户删除
function wechatUserListRemove(wechatUserIds) {
  return req(`/api/client/wechatUserList/${wechatUserIds}`, 'DELETE')
}

// 用户添加
function wechatUserListAdd(data) {
  return req(`/api/client/wechatUserList`, 'post',qs.stringify(data))
}
// 模板列表
function markdownTemplates(data) {
  return req(`/api/client/markdownTemplates/list`, 'get',data)
}
//模板添加
function markdownTemplatesAdd(data) {
  return req(`/api/client/markdownTemplates`, 'post',data)
}
//模板修改
function markdownTemplatesPut(data) {
  return req(`/api/client/markdownTemplates`, 'put',data)
}
//模板删除
function markdownTemplatesDelete(makIds) {
  return req(`/api/client/markdownTemplates/${makIds}`, 'delete')
}
// 模板返回值列表
function pushLabelInfo(data) {
  return req(`/api/client/pushLabelInfo/list`, 'get',data)
}
//模板返回值添加
function pushLabelInfoAdd(data) {
  return req(`/api/client/pushLabelInfo`, 'post',data)
}
//模板返回值修改
function pushLabelInfoEdit(data) {
  return req(`/api/client/pushLabelInfo`, 'put',data)
}
//模板返回值信息
function pushLabelInfoId(data) {
  return req(`/api/client/pushLabelInfo/${data}`, 'get')
}
//模板返回值信息
function pushLabelInfoIdDelete(data) {
  return req(`/api/client/pushLabelInfo/${data}`, 'delete')
}
//模板返回值信息
function selectShow(data) {
  return req(`/api/client/pushLabelInfo/selectShow`, 'get',data)
}
//管理端列表
function miniProgramMenuList(data) {
  return req(`/api/client/miniProgramMenuList/list`, 'get',data)
}
//管理端列表新增
function miniProgramMenuListAdd(data) {
  return req(`/api/client/miniProgramMenuList`, 'post',data)
}
//管理端列表新增
function miniProgramMenuListEdit(data) {
  return req(`/api/client/miniProgramMenuList`, 'put',data)
}
//管理端列表删除
function miniProgramMenuListDelete(data) {
  return req(`/api/client/miniProgramMenuList/${data}`, 'delete')
}
//管理端菜单与用户列表关系
function userMenuRelationships(data) {
  return req(`/api/client/userMenuRelationships/list`, 'get',data)
}
//管理端菜单与用户列表关系下拉框
function selectUser(data) {
  return req(`/api/client/userMenuRelationships/selectUser/${data}`, 'get')
}
//管理端菜单与用户列表关系新增
function userMenuRelationshipsAdd(data) {
  return req(`/api/client/userMenuRelationships`, 'post',data)
}
//管理端菜单与用户列表关系修改
function userMenuRelationshipsEdit(data) {
  return req(`/api/client/userMenuRelationships`, 'put',data)
}
//管理端菜单与用户列表关系修改
function userMenuRelationshipsDelete(data) {
  return req(`/api//client/userMenuRelationships/${data}`, 'delete')
}
export default{
  wechatUserList,
  wechatUserListRemove,
  wechatUserListAdd,
  markdownTemplates,
  markdownTemplatesAdd,
  markdownTemplatesPut,
  markdownTemplatesDelete,
  pushLabelInfo,
  pushLabelInfoAdd,
  pushLabelInfoEdit,
  pushLabelInfoId,
  pushLabelInfoIdDelete,
  selectShow,
  miniProgramMenuList,
  miniProgramMenuListAdd,
  miniProgramMenuListEdit,
  miniProgramMenuListDelete,
  userMenuRelationships,
  selectUser,
  userMenuRelationshipsAdd,
  userMenuRelationshipsEdit,
  userMenuRelationshipsDelete
  
}