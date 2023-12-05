import axios from 'axios'
import { MessageBox, Message, Loading } from 'element-ui'
import store from '@/store'
import route from '@/router'
import comustMsg from '@/utils/errorCode'
import { saveAs } from 'file-saver'
import { tansParams, blobValidate } from '@/utils/shiguang'
import { getToken } from "./auth";
import {getrandom} from './randomNumber'

// let route = ['/api/statistics/fomePageStatistics/statisticalCashier?deptId=4&type=month',
//   '/api/statistics/fomePageStatistics/dataBriefing?briefingType=deptId&timeType=day',
//   '/api/statistics/fomePageStatistics/productList?orderType=singular',
//   '/api/statistics/fomePageStatistics/performanceRanking?deptId=4&stringDate=2023-04&postType=ac',
//   '/api/statistics/fomePageStatistics/overallTrend?startTime=2023-04-01&endTime=2023-04-30&deptId=4&trendType=at',
//   '/api/statistics/fomePageStatistics/moneyTrend?objectiveType=deptId',
//   '/api/statistics/fomePageStatistics/salesPipeline?objectiveType=shanghai&currentTime=2023-04&deptId=4'];
let flag = false;
const service = axios.create({
  // baseURL:process.env["VUE_APP_BASE_API"],
  timeout: 500000
})
service.interceptors.request.use(
  // 设置token
  config => {
    const authToken = localStorage.getItem('userToken')
    config.headers['Authorization'] = 'Bearer ' + getToken()
    if (config.method === 'get' && config.params) {
      let url = config.url + '?' + tansParams(config.params)
      url = url.slice(0, -1)
      config.params = {}
      config.url = url;
      if (route.history.current.path == '/index'
        || route.history.current.path == '/healthcareManagement'
        || route.history.current.path == '/networkPower'
        || route.history.current.path == '/financialManagement'
        || route.history.current.path == '/returnVisitManagement'
        || route.history.current.path == '/activityManagement'
        || route.history.current.path == '/queryCenter'
        || route.history.current.path == '/reportAnalysis'
        || route.history.current.path == '/warehouseManagement'
        || route.history.current.path == '/Applet'
        || route.history.current.path == '/systemManagement'
      ) {

      } else {
        store.dispatch('setLoadment', { isReload: getrandom() })

      }
    }
    // route.forEach(value => {
    //   if (value == url) {
    //     flag = true
    //   }
    // })
    // if (flag) {

    // } else {


    // }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const res = response.data
    // 二进制数据则直接返回
    if (response.request.responseType === 'blob' || response.request.responseType === 'arraybuffer') {
      return res
    }
    // 如果返回的数据不是成功的
    if (res.code === 401) {
      store.dispatch('reduceLoadment', { FalseisReload: getrandom() })
      const doms = document.getElementsByClassName('el-message')[0]
      if (doms === undefined) {
        MessageBox.confirm('登录状态已过期,请返回重新登录！', '系统提示', {
          confirmButtonText: '重新登录',
          type: 'warning'
        }).then(() => {
          store.dispatch('LogOut').then(() => {
            location.href = '/login'
          })
        }).catch(() => {
        })
      }
    } else if (res.code !== 200 && res.code !== 601 && res.code !== 103 ) {
      if (res.code==undefined){
      // 导出的时候res.code为undefined
      }else {
        Message({
          message: res.msg || comustMsg[res.code],
          type: 'error',
          duration: 2000
        });
        store.dispatch('reduceLoadment', { FalseisReload: getrandom() })
      }

    } else {
      if (route.history.current.path == '/index'
        || route.history.current.path == '/healthcareManagement'
        || route.history.current.path == '/networkPower'
        || route.history.current.path == '/financialManagement'
        || route.history.current.path == '/returnVisitManagement'
        || route.history.current.path == '/activityManagement'
        || route.history.current.path == '/queryCenter'
        || route.history.current.path == '/reportAnalysis'
        || route.history.current.path == '/warehouseManagement'
        || route.history.current.path == '/Applet'
        || route.history.current.path == '/systemManagement'

      ) {

      } else {
      
        
      }
       if(res){
        store.dispatch('reduceLoadment', { FalseisReload: getrandom() })
       }
      return res
    }
  },
  error => {
    if (error.response) {
      Message({
        message: comustMsg[error.response.status],
        type: 'error',
        duration: 2000
      })
    } else {
      Message({
        message: error.message,
        type: 'error',
        duration: 2000
      })
    }

    return Promise.reject(error)

    let { message } = error
    if (message === 'Network Error') {
      message = '后端接口连接异常'
    } else if (message.includes('timeout')) {
      message = '系统接口请求超时'
    } else if (message.includes('Request failed with status code')) {
      message = '系统接口' + message.substr(message.length - 3) + '异常'
    }

    const doms = document.getElementsByClassName('el-message')[0]
    if (doms === undefined) {
      Message({
        message: message,
        type: 'error',
        duration: 3000
      })
    }
    return Promise.reject(error)
  }
)

export default service

// 通用下载方法
let downloadLoadingInstance
export function download(url, params, filename) {
  downloadLoadingInstance = Loading.service({ text: '正在下载数据，请稍候', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)' })
  return service.post(url, params, {
    transformRequest: [(params) => { return tansParams(params) }],
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    responseType: 'blob'
  }).then(async (data) => {

    const isLogin = await blobValidate(data)
    if (isLogin) {
      const blob = new Blob([data])
      saveAs(blob, filename)
    } else {
   
      const resText = await data.text()
      const rspObj = JSON.parse(resText)
      // const errMsg = comustMsg[rspObj.code] || rspObj.msg || comustMsg['default']
      
      Message.error(rspObj.msg)
    }
    downloadLoadingInstance.close()
  }).catch((r) => {
    console.error(r)
    downloadLoadingInstance.close()
  })
}
