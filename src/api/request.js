import request from '@/utils/request'

export function req(url, method, data) {
  return new Promise((resolve, reject) => {
    if (method === 'get') {
      request({
        url: url,
        method: method,
        params: data
      }).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    } else {
      request({
        url: url,
        method: method,
        data
      }).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    }
  })
}
export function putReq(url, method, data) {
  return new Promise((resolve, reject) => {

    request({
      url: url,
      method: method,
      params: data,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

export function postReq(url, method, data) {
  return new Promise((resolve, reject) => {
    request({
      url: url,
      method: method,
      params: data,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

export function postDownload(url, method, data) {
  return new Promise((resolve, reject) => {
    request({
      url: url,
      method: method,
      responseType: 'blob',
      params: data,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}
