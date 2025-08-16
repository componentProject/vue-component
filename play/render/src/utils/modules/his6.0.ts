import CryptoJS from 'crypto-js'
import { v4 } from 'uuid'

function generateShortUUID(length: number) {
  let uuid = v4() // 生成一个标准的36字符长度的UUID
  // 移除连字符并截取前N位
  uuid = uuid.replace(/-/g, '')
  return uuid.substring(0, length)
}

export function addSign(config: { [key: string]: any }) {
  // 添加环境检测，判断是否在Node.js环境
  const isNodeEnv = typeof window === 'undefined'

  // 在Node.js环境中使用默认值，浏览器环境继续使用sessionStorage
  const getStorageValue = (key: string, defaultValue: string) => {
    if (isNodeEnv) {
      return defaultValue
    }
    return sessionStorage.getItem(key) || defaultValue
  }

  const appId = getStorageValue('appId', 'trasen')
  const encrypted: {
    appId: string
    randomStr: string
    timestamp: number
    version: string
    sign?: string
  } = {
    appId,
    randomStr: generateShortUUID(6),
    timestamp: new Date().getTime(),
    version: 'V1.0.0',
  }
  const queryString = Object.entries(encrypted)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')
  const finalString = `${queryString}&${getStorageValue('hisSignatureKey', 'e1ec93ae-e25f-434d-8a64-f70116430a33')}`
  const signature = CryptoJS.MD5(finalString).toString()
  encrypted.sign = signature.toUpperCase()
  type encryptedKeyTypes = keyof typeof encrypted
  Object.keys(encrypted).forEach((key) => {
    config.headers[key] = encrypted[key as encryptedKeyTypes]
  })
}
