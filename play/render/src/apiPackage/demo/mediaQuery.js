/*
 * @Date: 2024-11-09 08:43:38
 * @LastEditors: AaronChu
 * @LastEditTime: 2024-11-09 08:48:38
 */
const mediaQuery = '(max-width: 1440px)'

const isSmallScreen = () => {
  // 检查媒体查询是否匹配
  if (window.matchMedia(mediaQuery).matches) {
    // 如果匹配，执行对应的逻辑
    console.log('当前屏幕宽度小于600像素')
    return true
  } else {
    // 如果不匹配
    console.log('当前屏幕宽度大于等于600像素')
    return false
  }
}

// 监听媒体查询变化
const handleMediaQueryChange = (mediaQuery) => {
  const mediaQueryList = window.matchMedia(mediaQuery)

  mediaQueryList.addEventListener('change', (mql) => {
    if (mql.matches) {
      console.log('媒体查询变化：当前屏幕宽度小于1440像素')
    } else {
      console.log('媒体查询变化：当前屏幕宽度大于等于1440像素')
    }
  })
}
