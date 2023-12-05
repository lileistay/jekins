import { req } from '@/api/request'
import request from '@/utils/request'

function queryTreatmentMoneyList(data) {
    return req('/api/scribing/deductionRecord/pfmanceGen', 'get', data)
}

function batchPerformanceSave(data) {
    return request({
        url: '/api/scribing/deductionRecord/performance',
        method: 'put',
        data
    })
}

function deviceManagementlist(data) {
    return req('/api/share/deviceManagement/list', 'get', data)
}

export default {
    queryTreatmentMoneyList,
    batchPerformanceSave,
    deviceManagementlist
}