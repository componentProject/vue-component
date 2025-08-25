import CryptoJS from 'crypto-js'
import utils from './utils'
import { dayjs } from 'element-plus'

export function parseQueryFromPath(path) {
  // 获取问号后面的部分
  const queryStr = path.split('?')[1]
  if (!queryStr)
    return {}

  // 拆分为键值对
  return Object.fromEntries(
    queryStr.split('&').map((param) => {
      const [key, value = ''] = param.split('=')
      return [decodeURIComponent(key), decodeURIComponent(value.replace(/\+/g, ' '))]
    }),
  )
}
//日期格式化成 yyyy-MM-dd HH:ii:ss 传入date
export function formatDateTime(date) {
  if (!(date instanceof Date)) {
    date = new Date(date)
  }
  // 获取各时间组件并补零
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // 月份从0开始[2,4](@ref)
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}
//获取当前日期的开始时间0时0分0秒
export function getStartOfDay(date) {
  if (!date)
    return ''
  if (!(date instanceof Date)) {
    date = new Date(date)
  }
  return formatDateTime(new Date(date.getFullYear(), date.getMonth(), date.getDate()))
}

//获取当前日期23时59分59秒的
export function getEndOfDay(date) {
  if (!date)
    return ''
  if (!(date instanceof Date)) {
    date = new Date(date)
  }
  date.setHours(23, 59, 59, 999)
  return formatDateTime(date)
}
export function addSign(config) {
  const appId = sessionStorage.getItem('appId')
  const encrypted = {
    appId,
    randomStr: utils.uuid(6),
    timestamp: new Date().getTime(),
    version: 'V1.0.0',
  }
  const queryString = Object.entries(encrypted)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')
  const originalSign = sessionStorage.getItem('sign')
  config.headers.originalSign = originalSign
  const finalString = `${queryString}&${originalSign}`
  const signature = CryptoJS.MD5(finalString).toString()
  encrypted.sign = signature.toUpperCase()
  Object.keys(encrypted).forEach((key) => {
    config.headers[key] = encrypted[key]
  })
}

export function getStr(str) {
  return str || ''
}
export function getKey(str) {
  return str || '无'
}

export function getSelectedText() {
  // 获取Selection对象
  const selection = window.getSelection()
  return selection.toString()
}

export function getNowTime() {
  return dayjs().format('YYYY-MM-DD HH:mm:ss')
}
export function cloneDeep(obj, map = new WeakMap()) {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  // 如果对象已经被拷贝过，直接返回缓存中的拷贝
  if (map.has(obj)) {
    return map.get(obj)
  }

  let clone

  // 判断是数组还是对象
  if (Array.isArray(obj)) {
    clone = []
    map.set(obj, clone)
    obj.forEach((item, index) => {
      clone[index] = cloneDeep(item, map)
    })
  }
  else {
    clone = {}
    map.set(obj, clone)
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clone[key] = cloneDeep(obj[key], map)
      }
    }
  }

  // 处理函数类型
  if (typeof obj === 'function') {
    clone[typeof obj] = obj.toString()
  }

  return clone
}
