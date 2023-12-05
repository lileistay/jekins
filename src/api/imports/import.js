import { req } from '@/api/request'
import { postDownload, postReq, putReq } from '../request'
import { download } from '@/utils/request'

// 产品类型模板
function importDepartmentInfoTemplate(data) {
    console.log(data,'datadata')
    return download('/api/share/departmentInfo/importDepartmentInfoTemplate', {
        ...data
    }, `产品类型_${new Date().getTime()}.xlsx`)
}
// 产品信息维护模板
function importProjectInfoTemplate(data) {
    return download('/api/confinement/projectInfo/importProjectInfoTemplate', {
        ...data
    }, `产品信息维护_${new Date().getTime()}.xlsx`)
}
// 顾客信息维护模板
function importCustomerCmtTemplate(data) {
    return download('/api/confinement/customerCmt/importCustomerCmtTemplate', {
        ...data
    }, `顾客信息_${new Date().getTime()}.xlsx`)
}
function importDownloadErrorTemplate(data) {
    return download('/api/confinement/customerCmt/importCustomerCmtTemplate', {
        ...data
    }, `错误数据_${new Date().getTime()}.xlsx`)
}
// 接待单信息维护模板
function importReceptionInformationTemplate(data) {
    return download('/api/confinement/receptionInformationList/importReceptionInformationTemplate', {
        ...data
    }, `接待单信息_${new Date().getTime()}.xlsx`)
}
// 开单信息维护模板
function importOrderDetailsTemplate(data) {
    return download('/api/payment/orderDetails/importOrderDetailsTemplate', {
        ...data
    }, `开单信息_${new Date().getTime()}.xlsx`)
}
// 划扣模板
function importDeductionRecordTemplate(data) {
    return download('/api/scribing/deductionRecord/importDeductionRecordTemplate', {
        ...data
    }, `划扣_${new Date().getTime()}.xlsx`)
}
// 客户卡包模板
function importCustomCardSumTemplate(data) {
    return download('/api/payment/customCardSum/importCustomCardSumTemplate', {
        ...data
    }, `客户卡包_${new Date().getTime()}.xlsx`)
}
// .物资信息模板
function importMaterialInfoTemplate(data) {
    return download('/api/sorage/materialInfo/importMaterialInfoTemplate', {
        ...data
    }, `物资信息_${new Date().getTime()}.xlsx`)
}
//回访下载
function importMaterialInfoTemplateinfo(data) {
    return download('/api/confinement/returnVisitHospital/importReturnVisitTemplate', {
        ...data
    }, `回访信息_${new Date().getTime()}.xlsx`)
}
export default {
    importDepartmentInfoTemplate,
    importProjectInfoTemplate,
    importCustomerCmtTemplate,
    importDownloadErrorTemplate,
    importMaterialInfoTemplateinfo,
    importReceptionInformationTemplate,
    importOrderDetailsTemplate,
    importDeductionRecordTemplate,
    importCustomCardSumTemplate,
    importMaterialInfoTemplate,
}