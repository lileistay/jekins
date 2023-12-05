import { req } from '@/api/request'
import {download} from "@/utils/request";
// 产品单位列表
function productList(data) {
  return req('/api/confinement/productUnitInfo/list', 'get', data)
}
//表头计算数据
function getheaderProduct(data){
  return req('/api/confinement/productUnitInfo/list', 'get', data)
}
// 类型的新增
function productAdd(data) {
  return req('/api/confinement/productUnitInfo', 'post', data)
}
// 删除
function productRemove(id) {
  return req(`/api/confinement/productUnitInfo/${id}`, 'delete')
}
// 修改
function productgetinfo(id) {
  return req(`/api/confinement/productUnitInfo/${id}`, 'get')
}
// 点击确定修改
function productedit(data) {
  return req('/api/confinement/productUnitInfo', 'put', data)
}

// function productAdd(data, id) {
//   if (id) {
//     return req('/api/confinement/productUnitInfo',+id )
//   }
//   return req('/api/confinement/productUnitInfo', data)
// }

// 产品项目分类
function productitemtyList(data) {
  return req('/api/confinement/productItemTypeInfo/list', 'get', data)
}
// 类型的新增
function producitemtyAdd(data) {
  return req('/api/confinement/productItemTypeInfo', 'post', data)
}
// 删除
function productitemtyRemove(id) {
  return req(`/api/confinement/productItemTypeInfo/${id}`, 'delete')
}
// 修改
function productgetitemtyinfo(id) {
  return req(`/api/confinement/productItemTypeInfo/${id}`, 'get')
}
// 点击确定修改
function productitemtyedit(data) {
  return req('/api/confinement/productItemTypeInfo', 'put', data)
}

// 费用类型
function expenseList(data) {
  return req('/api/confinement/expenseTypeInfo/list', 'get', data)
}
// 类型的新增
function expenseAdd(data) {
  return req('/api/confinement/expenseTypeInfo', 'post', data)
}
// 删除
function expenseRemove(id) {
  return req(`/api/confinement/expenseTypeInfo/${id}`, 'delete')
}
// 修改
function expensetyinfo(id) {
  return req(`/api/confinement/expenseTypeInfo/${id}`, 'get')
}
// 点击确定修改
function expenseyedit(data) {
  return req('/api/confinement/expenseTypeInfo', 'put', data)
}

// 产品业务分类
function classificaList(data) {
  return req('/api/confinement/productBusinessClassificationInfo/list', 'get', data)
}
// 类型的新增
function classificaAdd(data) {
  return req('/api/confinement/productBusinessClassificationInfo', 'post', data)
}
// 删除
function classificaRemove(id) {
  return req(`/api/confinement/productBusinessClassificationInfo/${id}`, 'delete')
}
// 修改
function classificainfo(id) {
  return req(`/api/confinement/productBusinessClassificationInfo/${id}`, 'get')
}
// 点击确定修改
function classificaedit(data) {
  return req('/api/confinement/productBusinessClassificationInfo', 'put', data)
}

// 产品自定义分类
function productCustomList(data) {
  return req('/api/confinement/productCustomTypeInfo/list', 'get', data)
}
// 类型的新增
function productCustomAdd(data) {
  return req('/api/confinement/productCustomTypeInfo', 'post', data)
}
// 删除
function productCustomRemove(id) {
  return req(`/api/confinement/productCustomTypeInfo/${id}`, 'delete')
}
// 修改
function productCustominfo(id) {
  return req(`/api/confinement/productCustomTypeInfo/${id}`, 'get')
}
// 点击确定修改
function productCustomedit(data) {
  return req('/api/confinement/productCustomTypeInfo', 'put', data)
}

// 产品列表
function productManagement(data) {
  return req('/api/confinement/projectInfo/list', 'get', data)
}

// 套餐列表
function packageManagementInfo(data) {
  return req('/api/confinement/packageManagementInfo/list', 'get', data)
}

// 套餐修改
function packageManagementInfoEdit(data) {
  return req('/api/confinement/packageManagementInfo', 'put', data)
}

// 套餐修改
function packageManagementInfoDown(id) {
  return req(`/api/confinement/packageManagementInfo/packageDown/${id}`, 'put')
}

// 添加套餐
function packageManagementInfoAdd(data) {
  return req('/api/confinement/packageManagementInfo', 'post', data)
}

// 根据number获取套餐详情
function packageDetailsInfoByNumber(data) {
  return req(`/api/confinement/packageDetailsInfo/list`, 'get', data)
}

// 根据IDs删除套餐
function packageManagementDelete(id) {
  return req(`/api/confinement/packageManagementInfo/${id}`, 'delete')
}

// 根据ID获取套餐
function packageManagementById(id) {
  return req(`/api/confinement/packageManagementInfo/${id}`, 'get')
}

function importTemplate(data) {
  return download('/api/confinement/projectInfo/importTemplate', {
    ...data
  }, `project_template_${new Date().getTime()}.xlsx`)
}
// 开单业绩查询（公司）
function selectOrderInfo(data) {
  return req('/api/payment/queryCenter/selectOrderInfo', 'get', data)
}
// 开单业绩明细查询（个人）
function selectOrderInfoList(data) {
  return req('/api/payment/queryCenter/selectOrderInfoList', 'get', data)
}
// 推荐人
function recommendedPerformance(data){
  return req('/api/payment/queryCenter/recommendedPerformance', 'get', data)
}
// 网电咨询师业绩查询
function consultingList(data) {
  return req('/api/payment/queryCenter/consulting', 'get', data)
}
// 网电咨询师业绩明细查询
function consultingListAll(data) {
  return req('/api/payment/queryCenter/consultingList', 'get', data)
}
// 医生划扣业绩查询
function getDoctorPerformance(data) {
  return req('/api/scribing/deductionRecord/getDoctorPerformance', 'get', data)
}

// 医生划扣业绩导出
function exportDoctorPerformance(data) {
  return download('/api/scribing/deductionRecord/exportDoctorPerformance', {
    ...data
  }, `DoctorPerformance_${new Date().getTime()}.xlsx`)
  // return req('/api/scribing/deductionRecord/exportDoctorPerformance', 'post', data)
}

// 医生划扣业绩明细查询
function doctorAcment(data) {
  return req('/api/payment/queryCenter/doctorAcment', 'get', data)
}
// 报表分析
// 全院分析报表
function reportCenter(data) {
  return req('/api/statistics/reportCenter/reportCenter', 'get', data)
}
function getWholeHospitalAnalysisList(data) {
  return req('/api/statistics/reportCenter/getWholeHospitalAnalysisList', 'get', data)
}

// 点击科室
function selectdepartmentIdList(data) {
  return req('/api/statistics/reportCenter/selectdepartmentIdList', 'get', data)
}
// 点击科室 第三级
function selectprojectTypeIdList(data) {
  return req('/api/statistics/reportCenter/selectprojectTypeIdList', 'get', data)
}
// 点击科室 第四级
function selectCategoryIdList(data) {
  return req('/api/statistics/reportCenter/selectCategoryIdList', 'get', data)
}
// 媒介
function selectChannelList(data) {
  return req('/api/statistics/reportCenter/selectChannelList', 'get', data)
}
// 渠道
function selectTypeThreeIdList(data) {
  return req('/api/statistics/reportCenter/selectTypeThreeIdList', 'get', data)
}
// 美学顾问
function selectAestheticConsultantList(data) {
  return req('/api/statistics/reportCenter/selectAestheticConsultantList', 'get', data)
}
// 医生
function selectDoctorIdList(data) {
  return req('/api/statistics/reportCenter/selectDoctorIdList', 'get', data)
}
// 年龄
function selectAgeList(data) {
  return req('/api/statistics/reportCenter/selectAgeList', 'get', data)
}
// 地址
function selectAddressList(data) {
  return req('/api/statistics/reportCenter/selectAddressList', 'get', data)
}

// 根据项目id获取物资关联信息
function getMaterialRelationByItemId(itemId) {
  return req(`/api/confinement/productMaterialRelation/getRelationInfoByItemId/${itemId}`, 'get')
}

export default {
  productList,
  productAdd,
  productRemove,
  productgetinfo,
  productedit,

  productitemtyList,
  producitemtyAdd,
  productitemtyRemove,
  productgetitemtyinfo,
  productitemtyedit,

  expenseList,
  expenseAdd,
  expenseRemove,
  expensetyinfo,
  expenseyedit,

  classificaList,
  classificaAdd,
  classificaRemove,
  classificainfo,
  classificaedit,

  productCustomList,
  productCustomAdd,
  productCustomRemove,
  productCustominfo,
  productCustomedit,

  productManagement,

  packageManagementInfo,
  packageManagementInfoAdd,
  packageDetailsInfoByNumber,
  packageManagementDelete,
  packageManagementById,
  packageManagementInfoEdit,
  packageManagementInfoDown,
  importTemplate,

  selectOrderInfo,
  selectOrderInfoList,
  recommendedPerformance,
  consultingList,
  consultingListAll,
  getDoctorPerformance,
  exportDoctorPerformance,
  doctorAcment,

  reportCenter,
  selectdepartmentIdList,
  selectprojectTypeIdList,
  selectCategoryIdList,
  selectChannelList,
  selectTypeThreeIdList,
  selectAestheticConsultantList,
  selectDoctorIdList,
  selectAgeList,
  selectAddressList,
  getheaderProduct,
  getMaterialRelationByItemId,
  getWholeHospitalAnalysisList
}
