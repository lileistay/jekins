import { req } from '@/api/request'
// 正畸一般检查新增
function dentalCorrectingInfoAdd(data) {
  return req('api/hospital/dentalCorrectingInfo', 'post', data)
}
// 正畸一般检查修改
function dentalCorrectingInfoEdit(data) {
  return req('api/hospital/dentalCorrectingInfo', 'put', data)
}
// 正畸检查的详情
function getInfoByDeptRegnId(data) {
  return req('api//hospital/dentalCorrectingInfo/getInfoByDeptRegnId', 'get', data)
}
// 正畸面部检查新增
function dentalFaceInfoAdd(data) {
  return req('api/hospital/dentalFaceInfo', 'post', data)
}
// 正畸面部检查修改
function dentalFaceInfoEdit(data) {
  return req('api/hospital/dentalFaceInfo', 'put', data)
}
// 正畸面部的详情
function getFaceInfoByDeptRegnId(data) {
  return req('api/hospital/dentalFaceInfo/getFaceInfoByDeptRegnId', 'get', data)
}
// 正畸颌骨及软组织检查新增
function dentalJawboneInfoAdd(data) {
  return req('api/hospital/dentalJawboneInfo', 'post', data)
}
// 正畸颌骨及软组织检查修改
function dentalJawboneInfoEdit(data) {
  return req('api/hospital/dentalJawboneInfo', 'put', data)
}
// 正畸颌骨及软组织的详情
function getJawboneInfoByDeptRegnId(data) {
  return req('api/hospital/dentalJawboneInfo/getJawboneInfoByDeptRegnId', 'get', data)
}
// 正畸牙列检查新增
function dentalDentureInfoAdd(data) {
  return req('api/hospital/dentalDentureInfo', 'post', data)
}
// 正畸牙列检查修改
function dentalDentureInfoEdit(data) {
  return req('api/hospital/dentalDentureInfo', 'put', data)
}
// 正畸牙列的详情
function getDentureInfoByDeptRegnId(data) {
  return req('api/hospital/dentalDentureInfo/getDentureInfoByDeptRegnId', 'get', data)
}


//正畸计划
// 正畸计划诊断的详情
function getPlanDiagnoseInfoByDeptRegnId(data) {
  return req('api//hospital/dentalPlanDiagnose/getPlanDiagnoseInfoByDeptRegnId', 'get', data)
}
// 正畸计划诊断新增
function dentalPlanDiagnoseAdd(data) {
  return req('api/hospital/dentalPlanDiagnose', 'post', data)
}
// 正畸计划诊断修改
function dentalPlanDiagnoseEdit(data) {
  return req('api/hospital/dentalPlanDiagnose', 'put', data)
}
//正畸计划治疗
// 正畸计划诊断的详情
function getPlanHealInfoByDeptRegnId(data) {
  return req('api//hospital/dentalPlanHeal/getPlanHealInfoByDeptRegnId', 'get', data)
}
// 正畸计划诊断新增
function dentalPlanHealAdd(data) {
  return req('api/hospital/dentalPlanHeal', 'post', data)
}
// 正畸计划诊断修改
function dentalPlanHealEdit(data) {
  return req('api/hospital/dentalPlanHeal', 'put', data)
}
// 删除图片
function deleteLocalFile(data) {
  return req(`api/file/deleteLocalFile?path=${data}`, 'get')
}
//正畸新增正畸过程
// 正畸过程诊断的详情
function getProcessInfoInfoByDeptRegnId(data) {
  return req('api/hospital/dentalProcessInfo/getProcessInfoInfoByDeptRegnId', 'get', data)
}
// 正畸过程诊断新增
function dentalProcessInfoAdd(data) {
  return req('api/hospital/dentalProcessInfo', 'post', data)
}
// 正畸过程诊断修改
function dentalProcessInfoEdit(data) {
  return req('api/hospital/dentalProcessInfo', 'put', data)
}
// 正畸过程诊断修改
function dentalProcessInfoList(data) {
  return req('api/hospital/dentalProcessInfo/list', 'get', data)
}
// 删除
function dentalProcessInfoDelete(data) {
  return req(`api/hospital/dentalProcessInfo/${data}`, 'delete')
}
// 查询工单信息表列表- 分页
function dentalWorksheetInfoList(data) {
  return req('api/hospital/dentalWorksheetInfo/list', 'get', data)
}
// 查询工单信息表列表- 新增
function dentalWorksheetInfoAdd(data) {
  return req('api/hospital/dentalWorksheetInfo', 'post', data)
}
// 查询工单信息表列表- 修改
function dentalWorksheetInfoEdit(data) {
  return req('api/hospital/dentalWorksheetInfo', 'put', data)
}
// 删除
function dentalWorksheetInfoDelete(data) {
  return req(`api/hospital/dentalWorksheetInfo/${data}`, 'delete')
}
// 查询工单进度表列表- 分页
function dentalWorksheeCourseList(data) {
  return req('api/hospital/dentalWorksheeCourse/list', 'get', data)
}
// 查询工单信息表列表- 新增
function dentalWorksheeCourseAdd(data) {
  return req('api/hospital/dentalWorksheeCourse', 'post', data)
}
// 查询工单信息表列表-修改
function dentalWorksheeCourseEdit(data) {
  return req('api/hospital/dentalWorksheeCourse', 'put', data)
}
export default {
  dentalCorrectingInfoAdd,
  getInfoByDeptRegnId,
  dentalCorrectingInfoEdit,
  dentalFaceInfoAdd,
  dentalFaceInfoEdit,
  getFaceInfoByDeptRegnId,
  dentalJawboneInfoAdd,
  dentalJawboneInfoEdit,
  getJawboneInfoByDeptRegnId,
  dentalDentureInfoAdd,
  dentalDentureInfoEdit,
  getDentureInfoByDeptRegnId,
  getPlanDiagnoseInfoByDeptRegnId,
  dentalPlanDiagnoseAdd,
  dentalPlanDiagnoseEdit,
  getPlanHealInfoByDeptRegnId,
  dentalPlanHealAdd,
  dentalPlanHealEdit,
  deleteLocalFile,
  dentalProcessInfoAdd,
  getProcessInfoInfoByDeptRegnId,
  dentalProcessInfoEdit,
  dentalProcessInfoList,
  dentalProcessInfoDelete,
  dentalWorksheetInfoList,
  dentalWorksheetInfoAdd,
  dentalWorksheetInfoEdit,
  dentalWorksheetInfoDelete,
  dentalWorksheeCourseList,
  dentalWorksheeCourseAdd,
  dentalWorksheeCourseEdit
}