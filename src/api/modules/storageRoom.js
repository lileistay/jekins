// 库房管理api接口
import { req } from '@/api/request'
import {download} from "@/utils/request";

// 供应商列表
function supplierList(data) {
  return req('/api/sorage/supplier/list', 'get', data)
}
// 供应商新增
function supplierAdd(data) {
  return req('/api/sorage/supplier', 'post', data)
}
// 供应商修改
function supplierPut(data) {
  return req('/api/sorage/supplier', 'put', data)
}
// 供应商 点击修改拿到数据
function supplierGetinfo(id) {
  return req(`/api/sorage/supplier/${id}`, 'get')
}
// 供应商 删除
function supplierDelete(id) {
  return req(`/api/sorage/supplier/${id}`, 'delete')
}
// 供应商 确定修改
// function supplierPut(data) {
// return req('/api/sorage/sorage/supplier', 'put', data)
// }
// 库房管理
function wpartmentList(data) {
  return req('/api/sorage/wpartment/list', 'get', data)
}
// 库房 新增
function wpartmentAdd(data) {
  return req('/api/sorage/wpartment', 'post', data)
}

// 领药减少库存
function outDrugListOutmedicinewarehouse(data) {
  return req('/api/sorage/outInfo/outmedicinewarehouse', 'post', data)
}

// 库房 删除
function wpartmentDelete(id) {
  return req(`/api/sorage/wpartment/${id}`, 'delete')
}
// 库房 修改
function wpartmentGetInfo(id) {
  return req(`/api/sorage/wpartment/${id}`, 'get')
}
// 库房 修改确定
function wpartmentPut(data) {
  return req('/api/sorage/wpartment', 'put', data)
}
// 物资类型
function materialTypeList(data) {
  return req('/api/sorage/materialTypeList/list', 'get', data)
}
// 物资 新增
function materialTypeAdd(data) {
  return req('/api/sorage/materialTypeList', 'post', data)
}
// 物资 修改
function materialTypeGetinfo(id) {
  return req(`/api/sorage/materialTypeList/${id}`, 'get')
}
function materialTypeEdit(data) {
  return req('/api/sorage/materialTypeList', 'put', data)
}
// 物资 删除
function materialTypeEdlete(id) {
  return req(`/api/sorage/materialTypeList/${id}`, 'delete')
}
// 物资类型 管理
function materialTypeInfoList(data) {
  return req('/api/sorage/materialTypeInfo/list', 'get', data)
}
// 物资类型 添加
function materialTypeInfoAdd(data) {
  return req('/api/sorage/materialTypeInfo', 'post', data)
}
function materialTypeInfoDelete(id) {
  return req(`/api/sorage/materialTypeInfo/${id}`, 'delete')
}
// 修改
function materialTypeInfoEdit(data) {
  return req('/api/sorage/materialTypeInfo', 'put', data)
}
// 物资信息表
function materialTypeListTree(data) {
  return req('/api/sorage/materialType/materialTypeListTree', 'get', data)
}
// 物资信息表 list
function materialInfoLst(data) {
  return req('/api/sorage/materialInfo/list', 'get', data)
}
// 物资信息表 添加
function materialInfoAdd(data) {
  return req('/api/sorage/materialInfo', 'post', data)
}
// 物资信息表 修改
function materialInfoGetinfo(id) {
  return req(`/api/sorage/materialInfo/${id}`, 'get')
}
// 物资信息表 修改
function getRelationProjectfo(materId) {
  return req(`/api/sorage/materialAuxiliaryRelation/getRelationProject/${materId}`, 'get')
}
function materialInfoEdit(data) {
  return req('/api/sorage/materialInfo', 'put', data)
}
// 物资信息表 删除
function materialInfoDelete(id) {
  return req(`/api/sorage/materialInfo/${id}`, 'delete')
}
// 入库记录表
function insertInfoList(data) {
  return req('/api/sorage/insertInfo/list', 'get', data)
}
// 入库记录表
function insertInfoExport(data) {
  return download('/api/sorage/insertInfo/export', {
    ...data
  }, `入库单导出_${new Date().getTime()}.xlsx`)
}
// 修改
function insertInfoGetInfo(id) {
  return req(`/api/sorage/insertInfo/${id}`, 'get')
}
// 入库记录表
function insertInfoDelete(id) {
  return req(`/api/sorage/insertInfo/${id}`, 'delete')
}
// 入库记录 添加
function insertInfoAdd(data) {
  return req('/api/sorage/insertInfo', 'post', data)
}

// 入库记录 修改
function insertInfoUpdate(data) {
  return req('/api/sorage/insertInfo', 'put', data)
}

// 物资辅助治疗关系表 列表 产品关联
function materialAuxiliaryRelationList(data) {
  return req('/api/sorage/materialAuxiliaryRelation/list', 'get', data)
}
// 新增
function materialAuxiliaryRelationAdd(data) {
  return req('/api/sorage/materialAuxiliaryRelation', 'post', data)
}
// 修改
function materialAuxiliaryRelationGetInfo(id) {
  return req(`/api/sorage/materialAuxiliaryRelation/${id}`, 'get')
}
function materialAuxiliaryRelationEdit(data) {
  return req('/api/sorage/materialAuxiliaryRelation', 'put', data)
}
// 删除
function materialAuxiliaryRelationDElete(id) {
  return req(`/api/sorage/materialAuxiliaryRelation/${id}`, 'delete')
}
// 入库详情
function insertList(data) {
  return req('/api/sorage/insertList/list', 'get', data)
}
// 入库详情 删除
function insertDelete(id) {
  return req(`/api/sorage/insertList/${id}`, 'delete')
}
// 领料出库 列表
function outInfoList(data) {
  return req('/api/sorage/outInfo/list', 'get', data)
}
// 领料出库 添加
function outInfoAdd(data) {
  return req('/api/sorage/outInfo', 'post', data)
}
// 领料出库 修改
function outInfoput(data) {
  return req('/api/sorage/outInfo', 'put', data)
}
// 领料出库 删除
function outInfoDelete(id) {
  return req(`/api/sorage/outInfo/${id}`, 'delete')
}
// 出库详情表 list
function outList(data) {
  return req('/api/sorage/outList/list', 'get', data)
}
// 出库详情表 list
function receiveAndReturnRecord(outChargeNo) {
  return req('/api/sorage/outList/receiveAndReturnRecord?outChargeNo=' + outChargeNo, 'get')
}
// 出库详情表打印 list
function receiveDetail(outId) {
  return req(`/api/sorage/outList/receiveDetail/${outId}`, 'get')
}
// 入库表详情打印
function returnDetail(insertId) {
  return req(`/api/sorage/insertList/returnDetail/${insertId}`, 'get')
}
// 出库详情表 删除
function outListDelete(id) {
  return req(`/api/sorage/outList/${id}`, 'delete')
}
// 药品
// 盘点物资
function ineysheetInfoList(data) {
  return req('/api/sorage/ineysheetInfo/list', 'get', data)
}
// 盘点管理 添加
function ineysheetInfoAdd(data) {
  return req('/api/sorage/ineysheetInfo', 'post', data)
}
// 盘点详情 list
function inventoryListList(data) {
  return req('/api/sorage/inventoryList/list', 'get', data)
}
function inventoryListExport(data) {
  return download('/api/sorage/inventoryList/export', {
    ...data
  }, `盘点详情导出_${new Date().getTime()}.xlsx`)
}
// 盘点详情
function inventoryListAdd(data) {
  return req('/api/sorage/inventoryList', 'post', data)
}
// 物资信息表 selectMaterialInventoryQuery
function selectMaterialInventoryQuerylist(data) {
  return req('/api/sorage/storehouseInfo/selectStorehouseInventoryQuery', 'get', data)
}
// 库存查询 点击数据查询
function selectInsertlistandOutlist(data) {
  return req('/api/sorage/insertList/selectInsertlistandOutlist', 'get', data)
}
// 入库单查询
function selectinsertinfoInboundOrderList(data) {
  return req('/api/sorage/insertList/selectinsertinfoInboundOrder', 'get', data)
}
// 出库单查询
function selectOutlist(data) {
  return req('/api/sorage/outList/selectOutlist', 'get', data)
}
// 库存查询明细
function selectInventoryDetailsQueryList(data) {
  return req('/api/sorage/materialInfo/selectInventoryDetailsQuery', 'get', data)
}
// 库存预警查询
function stockWarning(data) {
  return req('/api/sorage/materialInfo/stockWarning', 'get', data)
}
// 临期预警查询
function getExpireWarning(data) {
  return req('/api/sorage/insertList/getExpireWarning', 'get', data)
}
// 采购入库供应商汇总查询
function selectSuppliertotalLsit(data) {
  return req('/api/sorage/insertList/selectSuppliertotal', 'get', data)
}
// 采购入库供应商明细查询
function selectSupplierDetailedLsit(data) {
  return req('/api/sorage/insertList/selectSupplierDetailed', 'get', data)
}
// 入库单类型汇总查询
function selectInsertinfoTypeLsit(data) {
  return req('/api/sorage/insertInfo/selectInsertinfoType', 'get', data)
}
// 出库单类型汇总查询
function selectOutinfoTypeLsit(data) {
  return req('/api/sorage/outInfo/selectOutinfoType', 'get', data)
}
// 盘点查询
function inventorylistCountQueryList(data) {
  return req('/api/sorage/inventoryList/inventorylistCountQuery', 'get', data)
}
// 物资类型一级管理
function materialTypeLsit(data) {
  return req('/api/sorage/materialType/list', 'get', data)
}
// 物资类型一级管理 新增
function materialTypeAdds(data) {
  return req('/api/sorage/materialType', 'post', data)
}
// 物资类型一级管理 修改
function materialTypePut(data) {
  return req('/api/sorage/materialType', 'put', data)
}
// 物资类型一级管理 删除
function materialTypeDelete(id) {
  return req(`/api/sorage/materialType/${id}`, 'delete')
}
// 盘点单录入 库房查询
function selectmaterialbywhousidList(data) {
  return req('/api/sorage/insertList/selectmaterialbywhousid', 'get', data)
}
// 物资移库 列表
function removeInfoList(data) {
  return req('/api/sorage/removeInfo/list', 'get', data)
}
// 物资移库 添加
function removeInfoAdd(data) {
  return req('/api/sorage/removeInfo', 'post', data)
}
// 物资移库 详情list
function removeList(data) {
  return req('/api/sorage/removeList/list', 'get', data)
}
// 物资移库 删除
function removeListDelete(id) {
  return req(`/api/sorage/removeList/${id}`, 'delete')
}
// 导入物资 接口
function storehouseInfoList(data) {
  return req('/api/sorage/storehouseInfo/list', 'get', data)
}
// 入库详情
function medicationMaterialQuery(data) {
  return req('/api/sorage/insertList/medicationMaterialQuery', 'get', data)
}

// 查询库房权限
function selectWarehouseAuthority(data) {
  return req('/api/sorage/warehouseAuthority/list', 'get', data)
}

// 添加库房权限
function addWarehouseAuthority(data) {
  return req('/api/sorage/warehouseAuthority', 'post', data)
}

// 修改库房权限
function editWarehouseAuthority(data) {
  return req('/api/sorage/warehouseAuthority', 'put', data)
}

// 删除库房权限
function removeWarehouseAuthority(data) {
  return req(`/api/sorage/warehouseAuthority/${data}`, 'delete')
}

// 查询用户有入库权限的库房
function selectInWarehouseAuthoritiesByUserId(data) {
  return req('/api/sorage/warehouseAuthority/selectInWarehouseAuthoritiesByUserId', 'get', data)
}

// 查询用户有出库权限的库房
function selectOutWarehouseAuthoritiesByUserId(data) {
  return req('/api/sorage/warehouseAuthority/selectOutWarehouseAuthoritiesByUserId', 'get', data)
}

// 查询用户有出入库任意权限的库房
function selectWarehouseAuthoritiesByUserId(data) {
  return req('/api/sorage/warehouseAuthority/selectWarehouseAuthoritiesByUserId', 'get', data)
}

// 搜索物资
function searchMaterial(data) {
  return req('/api/sorage/materialInfo/searchMaterial', 'get', data)
}

export default {
  selectWarehouseAuthority,
  addWarehouseAuthority,
  editWarehouseAuthority,
  removeWarehouseAuthority,
  selectInWarehouseAuthoritiesByUserId,
  selectOutWarehouseAuthoritiesByUserId,
  selectWarehouseAuthoritiesByUserId,
  supplierList,
  supplierAdd,
  supplierGetinfo,
  supplierDelete,
  supplierPut,
  wpartmentList,
  wpartmentAdd,
  wpartmentDelete,
  getExpireWarning,
  wpartmentGetInfo,
  wpartmentPut,
  materialTypeList,
  materialTypeAdd,
  materialTypeGetinfo,
  materialTypeEdit,
  materialTypeEdlete,
  materialTypeInfoList,
  materialTypeInfoAdd,
  materialTypeInfoDelete,
  materialTypeInfoEdit,
  materialTypeListTree,
  materialInfoLst,
  materialInfoAdd,
  materialInfoGetinfo,
  materialInfoEdit,
  materialInfoDelete,
  insertInfoList,
  insertInfoAdd,
  insertInfoUpdate,
  insertInfoDelete,
  insertInfoGetInfo,
  materialAuxiliaryRelationList,
  materialAuxiliaryRelationAdd,
  materialAuxiliaryRelationGetInfo,
  materialAuxiliaryRelationEdit,
  materialAuxiliaryRelationDElete,
  insertList,
  insertDelete,
  outInfoList,
  outInfoAdd,
  outInfoDelete,
  outList,
  outInfoput,
  outListDelete,
  ineysheetInfoList,
  inventoryListList,
  inventoryListAdd,
  ineysheetInfoAdd,
  selectMaterialInventoryQuerylist,
  selectInsertlistandOutlist,
  selectinsertinfoInboundOrderList,
  selectOutlist,
  selectSuppliertotalLsit,
  selectSupplierDetailedLsit,
  selectInsertinfoTypeLsit,
  selectOutinfoTypeLsit,
  materialTypeLsit, // 一级物资
  materialTypeAdds,
  materialTypePut,
  materialTypeDelete,
  selectInventoryDetailsQueryList,
  inventorylistCountQueryList,
  selectmaterialbywhousidList, // 盘点单录入 库房查询
  removeInfoList,
  removeInfoAdd,
  removeList,
  removeListDelete,
  storehouseInfoList,
  outDrugListOutmedicinewarehouse,
  medicationMaterialQuery,
  insertInfoExport,
  inventoryListExport,
  receiveAndReturnRecord,
  getRelationProjectfo, // 获取物资与产品的关联信息
  receiveDetail,
  returnDetail,
  stockWarning, // 库存预警
  searchMaterial // 搜索物资
}
