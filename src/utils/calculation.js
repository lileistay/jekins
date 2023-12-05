// 根据生日计算年龄
export function strAge(date) {
  const strAge = date.toString()
  const birArr = strAge.split('-')
  const birYear = birArr[0]
  const birMonth = birArr[1]
  const birDay = birArr[2]

  d = new Date()
  const nowYear = d.getFullYear()
  const nowMonth = d.getMonth() + 1 // 记得加1
  const nowDay = d.getDate()
  let returnAge

  if (birArr == null) {
    return false
  }
  let d = new Date(birYear, birMonth - 1, birDay)
  if (d.getFullYear() === parseInt(birYear) && (d.getMonth() + 1) === parseInt(birMonth) && d.getDate() === parseInt(birDay)) {
    if (nowYear === birYear) {
      returnAge = 0 //
    } else {
      const ageDiff = nowYear - birYear //
      if (ageDiff > 0) {
        if (nowMonth === birMonth) {
          const dayDiff = nowDay - birDay //
          if (dayDiff < 0) {
            returnAge = ageDiff - 1
          } else {
            returnAge = ageDiff
          }
        } else {
          const monthDiff = nowMonth - birMonth //
          if (monthDiff < 0) {
            returnAge = ageDiff - 1
          } else {
            returnAge = ageDiff
          }
        }
      } else {
        return 0 // 返回-1 表示出生日期输入错误 晚于今天
      }
    }
    return returnAge
  } else {
    return 0
  }
}
