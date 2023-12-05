import { req } from '@/api/request'
// 查询口腔材质信息列表- 分页
function dentalMaterialInfoList(data) {
  return req('/api/hospital/dentalMaterialInfo/list', 'get', data)
}
// 口腔材质信息新增
function dentalMaterialInfoAdd(data) {
  return req('/api/hospital/dentalMaterialInfo', 'post', data)
}
// 口腔材质信息修改
function dentalMaterialInfoEdit(data) {
  return req('/api/hospital/dentalMaterialInfo', 'put', data)
}
// 详情
function dentalMaterialInfo(data) {
  return req(`/api/hospital/dentalMaterialInfo/${data}`, 'get')
}
// 删除
function dentalMaterialInfoDelete(data) {
  return req(`/api/hospital/dentalMaterialInfo/${data}`, 'delete')
}
// 删除
function dentalMaterialInfoExport(data) {
  return req(`/api/hospital/dentalMaterialInfo/export`, 'POST',data)
}
// 查询正畸检查字典分类列表- 分页
function dentalDictTypeLst(data) {
  return req('/api/hospital/dentalDictType/list', 'get', data)
}
// 正畸检查字典分类新增
function dentalDictTypeAdd(data) {
  return req('/api/hospital/dentalDictType', 'post', data)
}
// 正畸检查字典分类修改
function dentalDictTypeEdit(data) {
  return req('/api/hospital/dentalDictType', 'put', data)
}
// 正畸检查字典分类详情
function dentalDictType(data) {
  return req(`/api/hospital/dentalDictType/${data}`, 'get')
}
// 正畸检查字典分类导出
function dentalDictTypeexport(data) {
  return req(`/api/hospital/dentalDictType/export`, 'post',data)
}
function dentalDictTypeexportDelete(data) {
  return req(`/api/hospital/dentalDictType/${data}`, 'delete')
}
// 查询正畸检查字典详情列表- 分页
function dentalDictDetailsList(data) {
  return req(`/api/hospital/dentalDictDetails/list`, 'get',data)
}
// 正畸检查字典详情列表新增
function dentalDictDetailsListAdd(data) {
  return req(`/api/hospital/dentalDictDetails`, 'post',data)
}
// 正畸检查字典详情列表修改
function dentalDictDetailsListEdit(data) {
  return req(`/api/hospital/dentalDictDetails`, 'put',data)
}
// 正畸检查字典详情列表详情
function dentalDictDetails(data) {
  return req(`/api/hospital/dentalDictDetails/${data}`, 'get')
}
// 正畸检查字典详情列表删除
function dentalDictDetailsDelete(data) {
  return req(`/api/hospital/dentalDictDetails/${data}`, 'delete')
}
// 正畸检查字典详情列表删除
function dentalDictDetailsexport(data) {
  return req(`/api/hospital/dentalDictDetails/export`, 'post' ,data)
}
// 查询口腔加工单位信息列表- 分页
function dentalProducerInfoList(data) {
  return req(`/api/hospital/dentalProducerInfo/list`, 'get' ,data)
}
// 查询口腔加工单位信息列表- 新增
function dentalProducerInfoAdd(data) {
  return req(`/api/hospital/dentalProducerInfo`, 'post' ,data)
}
// // 查询口腔加工单位信息列表- 修改
function dentalProducerInfoEdit(data) {
  return req(`/api/hospital/dentalProducerInfo`, 'put' ,data)
}
// // 查询口腔加工单位信息列表- 详情
function dentalProducerInfo(data) {
  return req(`/api/hospital/dentalProducerInfo/${data}`, 'get' )
}
// // 查询口腔加工单位信息列表- 删除
function dentalProducerInfoDelete(data) {
  return req(`/api/hospital/dentalProducerInfo/${data}`, 'delete' ,data)
}
// // 查询口腔加工单位信息列表- 导出
function dentalProducerInfoexport(data) {
  return req(`/api/hospital/dentalProducerInfo/export`, 'post' ,data)
}
// 查询加工单位联系人信息列表- 分页
function dentalProducerContactList(data) {
  return req(`/api/hospital/dentalProducerContact/list`, 'get' ,data)
}
// 加工单位联系人信息列表- 新增
function dentalProducerContactAdd(data) {
  return req(`/api/hospital/dentalProducerContact`, 'post' ,data)
}
// // 加工单位联系人信息列表- 修改
function dentalProducerContactEdit(data) {
  return req(`/api/hospital/dentalProducerContact`, 'put' ,data)
}
// // 加工单位联系人信息列表- 详情
function dentalProducerContact(data) {
  return req(`/api/hospital/dentalProducerContact/${data}`, 'get' )
}
// // 加工单位联系人信息列表- 删除
function dentalProducerContactDelete(data) {
  return req(`/api/hospital/dentalProducerContact/${data}`, 'delete' ,data)
}
// // 加工单位联系人信息列表- 导出
function dentalProducerContactexport(data) {
  return req(`/api/hospital/dentalProducerContact/export`, 'post' ,data)
}
// 查询口腔加工色号列表- 分页
function dentalMakeColourList(data) {
  return req(`/api/hospital/dentalMakeColour/list`, 'get' ,data)
}
// 口腔加工色号列表- 新增
function dentalMakeColourAdd(data) {
  return req(`/api/hospital/dentalMakeColour`, 'post' ,data)
}
// // 口腔加工色号- 修改
function dentalMakeColourEdit(data) {
  return req(`/api/hospital/dentalMakeColour`, 'put' ,data)
}
// // 口腔加工色号- 详情
function dentalMakeColour(data) {
  return req(`/api/hospital/dentalMakeColour/${data}`, 'get' )
}
// // 口腔加工色号- 删除
function dentalMakeColourDelete(data) {
  return req(`/api/hospital/dentalMakeColour/${data}`, 'delete' ,data)
}
// // 口腔加工色号- 导出
function dentalMakeColourexport(data) {
  return req(`/api/hospital/dentalMakeColour/export`, 'post' ,data)
}
export default {
  dentalMaterialInfoList,
  dentalMaterialInfo,
  dentalMaterialInfoAdd,
  dentalMaterialInfoEdit,
  dentalMaterialInfoDelete,
  dentalMaterialInfoExport,
  dentalDictTypeLst,
  dentalDictTypeAdd,
  dentalDictTypeEdit,
  dentalDictType,
  dentalDictTypeexport,
  dentalDictTypeexportDelete,
  dentalDictDetailsList,
  dentalDictDetailsListAdd,
  dentalDictDetailsListEdit,
  dentalDictDetails,
  dentalDictDetailsDelete,
  dentalDictDetailsexport,
  dentalProducerInfoList,
  dentalProducerInfoAdd,
  dentalProducerInfoEdit,
  dentalProducerInfo,
  dentalProducerInfoDelete,
  dentalProducerInfoexport,
  dentalProducerContactList,
  dentalProducerContactAdd,
  dentalProducerContactEdit,
  dentalProducerContact,
  dentalProducerContactDelete,
  dentalProducerContactexport,
  dentalMakeColourList,
  dentalMakeColourAdd,
  dentalMakeColourEdit,
  dentalMakeColour,
  dentalMakeColourDelete,
  dentalMakeColourexport,
}