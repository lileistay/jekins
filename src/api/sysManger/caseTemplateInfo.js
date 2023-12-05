import { req } from '@/api/request'

// 获取电子病例模板分类列表
function caseTemplateClassifyList(data) {
    return req('/api/hospital/caseTemplateClassify/list', 'get', data)
}
// 添加电子病例模板分类
function addCaseTemplateClassify(data) {
    return req('/api/hospital/caseTemplateClassify', 'post', data)
}
// 修改电子病例模板分类
function editCaseTemplateClassify(data) {
    return req('/api/hospital/caseTemplateClassify', 'put', data)
}
// 删除电子病例模板分类
function removeCaseTemplateClassify(classifyIds) {
    return req(`/api/hospital/caseTemplateClassify/${classifyIds}`, 'delete')
}
// 获取电子病例模板分类树
function caseTemplateClassifyTree(data) {
    return req('/api/hospital/caseTemplateClassify/listTree', 'get', data)
}

// 获取病例模板基本信息列表
function caseTemplateInfoList(data) {
    return req('/api/hospital/caseTemplateInfo/list', 'get', data)
}
// 添加电子病例模板
function addCaseTemplateInfo(data) {
    return req('/api/hospital/caseTemplateInfo', 'post', data)
}
// 修改电子病例模板
function editCaseTemplateInfo(data) {
    return req('/api/hospital/caseTemplateInfo', 'put', data)
}
// 删除电子病例模板
function removeCaseTemplateInfo(templateIds) {
    return req(`/api/hospital/caseTemplateInfo/${templateIds}`, 'delete')
}
export default {
    caseTemplateClassifyList,
    addCaseTemplateClassify,
    editCaseTemplateClassify,
    removeCaseTemplateClassify,
    caseTemplateClassifyTree,
    caseTemplateInfoList,
    addCaseTemplateInfo,
    editCaseTemplateInfo,
    removeCaseTemplateInfo
}
