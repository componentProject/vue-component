function uuid(num: any) {
  const s = []
  const hexDigits = '0123456789abcdef'
  if (num) {
    // 如果提供了num参数，生成一个由'x'组成的字符串
    let n = ''
    for (let i = 0; i < num; i++) {
      n = `${n}x`
    }
    // 将'x'替换为随机的十六进制字符
    return n.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }
  // 生成一个标准的UUID格式
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  // 设置UUID的版本号为4
  s[14] = '4'
  // 设置UUID的变体
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
  // 插入UUID的分隔符
  s[8] = s[13] = s[18] = s[23] = ''
  // 返回生成的UUID字符串
  return s.join('')
}

export function addSign(config: any) {
  // const appId = sessionStorage.getItem('appId')
  const appId = 'S0100501'
  // const ThirdPartySystemLink = sessionStorage.getItem('ThirdPartySystemLink') || ''
  const encrypted: any = {
    appId,
    randomStr: uuid(6),
    timestamp: new Date().getTime(),
    version: 'V1.0.0',
  }
  const queryString = Object.entries(encrypted)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')
  // const originalSign = sessionStorage.getItem('sign')
  const originalSign = '4a2d86a28f1cbecd94ba7c3436f4f0226765c710'
  config.headers.originalSign = originalSign
  const finalString = `${queryString}&${originalSign}`
  const signature = finalString.toString()
  encrypted.sign = signature.toUpperCase()
  Object.keys(encrypted).forEach((key) => {
    config.headers[key] = encrypted[key]
  })
}
