import dayjs from 'dayjs'

const quarterOfYear = require('dayjs/plugin/quarterOfYear') // day.js季度插件
dayjs.extend(quarterOfYear)

/**
 * @description: 格式化时间的公共方法
 * @param {*} fmt  时间格式 如:YYYY-mm-dd HH:MM
 * @param {*} time  需要格式化的时间
 * @return {*}
 */
// 格式化时间格式
export function timeFmt(fmt, time) {
  if (!time) {
    return ''
  } else {
    if (!fmt) {
      fmt = 'YYYY-mm-dd HH:MM:SS'
    }
    let ret
    var date = new Date(time)
    const opt = {
      'Y+': date.getFullYear().toString(), // 年
      'm+': (date.getMonth() + 1).toString(), // 月
      'd+': date.getDate().toString(), // 日
      'H+': date.getHours().toString(), // 时
      'M+': date.getMinutes().toString(), // 分
      'S+': date.getSeconds().toString() // 秒
      // 有其他格式化字符需求可以继续添加，必须转化成字符串
    }
    for (const k in opt) {
      ret = new RegExp('(' + k + ')').exec(fmt)
      if (ret) {
        fmt = fmt.replace(
          ret[1],
          ret[1].length === 1 ? opt[k] : opt[k].padStart(ret[1].length, '0')
        )
      }
    }
    return fmt
  }
}

// 返回当天时间
export function todayTime() {
  var times = []
  const nowTime = timeFmt('YYYY-mm-dd', new Date())
  times[0] = nowTime + ' 00:00:00'
  times[1] = nowTime + ' 23:59:59'
  return times
}

// 返回几天前的时间，
export function beforeDayTime(day) {
  const times = []
  // const nowTime = timeFmt('YYYY-mm-dd', new Date())
  const nowDate = parseInt((new Date().getTime()).toString()) // 当前时间
  const beforeDate = nowDate - day * 24 * 60 * 60 * 1000
  const nowTime = timeFmt('YYYY-mm-dd', new Date(beforeDate))
  times[0] = nowTime + ' 00:00:00'
  times[1] = nowTime + ' 23:59:59'
  return times
}

// 返回本周时间
export function thisWeek() {
  const times = []
  const now = new Date()
  const nowTime = now.getTime()
  // getDay()返回0-6，其中0表示周日，需特殊处理
  const day = now.getDay() > 0 ? now.getDay() : 7 // 表示当前是周几
  const oneDayTime = 24 * 60 * 60 * 1000 // 一天的总ms
  // 本周一时间戳
  const MondayTime = nowTime - (day - 1) * oneDayTime
  // 本周日时间戳
  const SundayTime = nowTime + (7 - day) * oneDayTime
  // 格式化时间
  const monday = timeFmt('YYYY-mm-dd', new Date(MondayTime))
  const sunday = timeFmt('YYYY-mm-dd', new Date(SundayTime))
  times[0] = monday + ' 00:00:00'
  times[1] = sunday + ' 23:59:59'
  return times
}

// 返回上几周时间
export function beforeWeek(week) {
  const times = []
  const now = new Date()
  const nowTime = now.getTime()
  // getDay()返回0-6，其中0表示周日，需特殊处理
  const day = now.getDay() > 0 ? now.getDay() : 7 // 表示当前是周几
  const oneDayTime = 24 * 60 * 60 * 1000 // 一天的总ms
  // 上周一时间戳
  const MondayTime = nowTime - (day + 7 * week) * oneDayTime
  // 上周日时间戳
  const SundayTime = nowTime - (day + 7 * (week - 0.9)) * oneDayTime
  // 格式化时间
  const monday = timeFmt('YYYY-mm-dd', new Date(MondayTime))
  const sunday = timeFmt('YYYY-mm-dd', new Date(SundayTime))
  times[0] = monday + ' 00:00:00'
  times[1] = sunday + ' 23:59:59'
  return times
}

// 返回当月时间
export function monthData() {
  const date = new Date()
  const month = []
  let currentMonth = date.getMonth()
  const nextMonth = ++currentMonth
  const nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1)
  const oneDay = 1000 * 60 * 60 * 24
  const lastTime = new Date(nextMonthFirstDay - oneDay)
  let monthLast = parseInt(lastTime.getMonth() + 1)
  let day1 = lastTime.getDate()
  date.setDate(1)
  let monthStart = parseInt(date.getMonth() + 1)
  let day0 = date.getDate()
  if (monthStart < 10 && monthLast < 10) {
    monthStart = '0' + monthStart
    monthLast = '0' + monthLast
  }
  if (day0 < 10 && day1 < 10) {
    day0 = '0' + day0
    day1 = '0' + day1
  }
  const first =
    date.getFullYear() + '-' + monthStart + '-' + day0 + ' 00:00:00'
  const last =
    date.getFullYear() + '-' + monthLast + '-' + day1 + ' 23:59:59'
  month.push(first)
  month.push(last)
  return month
}

/**
 * 获取上月开始、结束时间
 * @returns [上月开始时间，上月结束时间]
 */
export function lastMonth() {
  //  一天的秒数
  const secondsADay = 1000 * 60 * 60 * 24
  const date = new Date()
  date.setDate(1)
  date.setHours(0, 0, 0, 0)
  //  当月开始时间戳
  const timeStamp = date.getTime()
  //  上个月的天数
  const days = lastMonthDats()
  //  上月开始时间戳
  const lastMonthStart = timeStamp - (secondsADay * days)
  //  上月结束时间戳
  const lastMonthEnd = timeStamp - 1
  return [timeFmt('YYYY-mm-dd HH:MM:SS', lastMonthStart), timeFmt('YYYY-mm-dd HH:MM:SS', lastMonthEnd)]
}

/**
 * 上月天数
 */
function lastMonthDats() {
  const date = new Date()
  const year = date.getFullYear()
  //  上个月月份
  let month = (date.getMonth() + 1) - 1 //  0-11 表示 1月-12月
  //  0 表示12月
  month = month || 12
  //  30天的月份
  const arr30 = [4, 6, 9, 11]
  //  31天的月份
  const arr31 = [1, 3, 5, 7, 8, 10, 12]
  if (arr30.indexOf(month) !== -1) {
    //  上个月是 30 天
    return 30
  } else if (arr31.indexOf(month) !== -1) {
    //  上个月是 31 天
    return 31
  } else {
    //  2月
    if (isRunYear(year)) {
      return 29
    } else {
      return 28
    }
  }
}

/**
 * 是否为闰年
 */
function isRunYear(year) {
  //  条件:能被4整除并且不能被100整除，或者被400整除的
  let flag = false
  if (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) {
    flag = true
  }
  return flag
}

// 本年
export function thisYear() {
  const start = dayjs().startOf('year').format('YYYY-MM-DD') + ' 00:00:00'
  const end = dayjs().endOf('year').format('YYYY-MM-DD') + ' 23:59:59'
  return [start, end]
}

// 去年
export function lastYear() {
  const start = dayjs().add(-1, 'year').startOf('year').format('YYYY-MM-DD') + ' 00:00:00'
  const end = dayjs().add(-1, 'year').endOf('year').format('YYYY-MM-DD') + ' 23:59:59'
  return [start, end]
}

// 本季度
export function thisQuarter() {
  const start = dayjs().startOf('quarter').format('YYYY-MM-DD') + ' 00:00:00'
  const end = dayjs().endOf('quarter').format('YYYY-MM-DD') + ' 23:59:59'
  return [start, end]
}

// 上季度
export function lastQuarter() {
  const start = dayjs().add(-1, 'quarter').startOf('quarter').format('YYYY-MM-DD') + ' 00:00:00'
  const end = dayjs().add(-1, 'quarter').endOf('quarter').format('YYYY-MM-DD') + ' 23:59:59'
  return [start, end]
}

export function GMTToStr(time) {
  const date = new Date(time)
  const Str = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
  return Str
}

// 当前时间
export function formatDate(fmt) {
  const date = new Date()
  const o = {
    'Y+': date.getFullYear(),
    'M+': date.getMonth() + 1, // 月
    'D+': date.getDate(), // 日
    'h+': date.getHours(), // 时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    W: date.getDay() // 周
  }
  // 使用
  // formatDate('YY') // 2022
  // formatDate('YY-MM')	// 2022-06
  // formatDate('YY-MM-DD')	// 2022-06-02
  // formatDate('YY-MM-DD hh:mm:ss')	// 2022-06-02 10:02:23
  // formatDate('星期W')	// 星期四
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, () => {
        if (k === 'W') {
          // 星期几
          const week = ['日', '一', '二', '三', '四', '五', '六']
          return week[o[k]]
        } else if (k === 'Y+' || RegExp.$1.length === 1) {
          // 年份 or 小于10不加0
          return o[k]
        } else {
          return ('00' + o[k]).substr(('' + o[k]).length) // 小于10补位0
        }
      })
    }
  }
  return fmt
}

// 几天后
export function dayLater(val) {
  const start = dayjs().format('YYYY-MM-DD') + ' 00:00:00'
  const end = dayjs().add(val || 1, 'day').endOf('day').format('YYYY-MM-DD') + ' 23:59:59'
  return [start, end]
}

// 几周后
export function weekLater(val) {
  const start = dayjs().format('YYYY-MM-DD') + ' 00:00:00'
  const end = dayjs().add(val || 1, 'week').endOf('day').format('YYYY-MM-DD') + ' 23:59:59'
  return [start, end]
}

// 几月后
export function monthLater(val) {
  const start = dayjs().format('YYYY-MM-DD') + ' 00:00:00'
  const end = dayjs().add(val || 1, 'month').endOf('day').format('YYYY-MM-DD') + ' 23:59:59'
  return [start, end]
}

// 几季度后
export function quarterLater(val) {
  const start = dayjs().format('YYYY-MM-DD') + ' 00:00:00'
  const end = dayjs().add(val || 1, 'quarter').endOf('day').format('YYYY-MM-DD') + ' 23:59:59'
  return [start, end]
}

// 几年后
export function yearLater(val) {
  const start = dayjs().format('YYYY-MM-DD') + ' 00:00:00'
  const end = dayjs().add(val || 1, 'year').endOf('day').format('YYYY-MM-DD') + ' 23:59:59'
  return [start, end]
}
// 返回近几天的时间，
export function adjacentTime(day) {
  const times = []
  const end = new Date();
  const start = new Date().getTime()- 3600 * 1000 * 24 * day;
  // 格式化时间
  const start1 = timeFmt('YYYY-mm-dd', new Date(start))
  const end1 = timeFmt('YYYY-mm-dd', new Date(end))
  times[0] = start1 + ' 00:00:00'
  times[1] = end1 + ' 23:59:59'
  return times
}
// 时间选择器的侧边组件时间筛选
export function shortcuts(){
  const sortList=  [
      {
        text: '今天',
        onClick(picker) {
          picker.$emit('pick', todayTime());
        }
      },
    {
      text: '昨天',
      onClick(picker) {
        picker.$emit('pick', beforeDayTime(1))
      }
    },
      {
        text: '最近3天',
        onClick(picker) {
          picker.$emit('pick', adjacentTime(2));
        }
      }, {
      text: '最近5天',
      onClick(picker) {
        picker.$emit('pick', adjacentTime(4));
      }
    }, {
      text: '最近7天',
      onClick(picker) {
        picker.$emit('pick', adjacentTime(6));
      }
    }, {
      text: '本月',
      onClick(picker) {
        picker.$emit('pick', monthData());
      }
    }, {
      text: '上月',
      onClick(picker) {
        picker.$emit('pick', lastMonth());
      }
    }]
  return sortList
}
//将时间转化为可视化时间
export function newgetData(value) {
  let DateObj = new Date(value)
  // 将时间转换为 XX年XX月XX日XX时XX分XX秒格式
  let year = DateObj.getFullYear()
  let month = DateObj.getMonth() + 1
  let day = DateObj.getDate()
  let hh = DateObj.getHours()
  let mm = DateObj.getMinutes()
  let ss = DateObj.getSeconds()
  month = month > 9 ? month : '0' + month
  day = day > 9 ? day : '0' + day
  if (hh >= 0 && hh <= 9) {
    hh = "0" + hh;
  }
  if (mm >= 0 && mm <= 9) {
    mm = "0" + mm;
  }
  if (ss >= 0 && ss <= 9) {
    ss = "0" + ss;
  }
  // 最终时间
  return `${year}-${month}-${day} ${hh}:${mm}:${ss}`
}
export class todayTimess {
}
