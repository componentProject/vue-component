const utils = {
  uuid(num) {
    var s = []
    var hexDigits = '0123456789abcdef'
    if (num) {
      var n = ''
      for (var i = 0; i < num; i++) {
        n = n + 'x'
      }
      return n.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0
        var v = c == 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      })
    }
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
    }
    s[14] = '4'
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
    s[8] = s[13] = s[18] = s[23] = ''
    return s.join('')
  },
  /**
   *
   * @param {string} key 从数组对象里面要提取的key值
   * @param {Array[object]} list 数组对象集合
   * @param {string} targetKey 目标集合所映射的key值
   * @param {Array[object]} targetList 目标集合
   */
  getKeyList(key, list, targetKey, targetList) {
    const result = targetList.map((value) => {
      const option = list.find((item) => item[targetKey] == value)
      return option ? option[key] : null
    })
    return result
  },
  debounce(fn, delay = 300) {
    //默认300毫秒
    let timer

    return function () {
      const args = arguments
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        fn.apply(this, args) // 改变this指向为调用debounce所指的对象
      }, delay)
    }
  }
}
export default utils
