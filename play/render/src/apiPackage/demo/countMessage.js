import { ElMessage } from 'element-plus'

// 自动关闭定时器
let timer = null

/**
 * 倒计时 Message 方法
 */
const coutdownTime = (msgObj, className, message, number) => {
  timer = setTimeout(() => {
    if (number > -1) {
      msgObj.message = `${message} ${number}s` // element-ui 可起效，element-plus 不起效

      const parentDom = document.getElementsByClassName(className)[0]
      const childDom = parentDom.querySelectorAll('p')[0]
      childDom.innerHTML = `${message} ${number}s`

      --number
      coutdownTime(msgObj, className, message, number)
    } else {
      msgObj.close()
      timer = null
    }
  }, 1000)
}

/**
 * 自动关闭 Message 方法
 */
const countdownMessage = (message, type, number, showClose) => {
  const randomNum = Math.floor(Math.random() * 10000)
  const className = `el-msg__${randomNum}`

  const msgObj = ElMessage({
    message: `${message} ${number}s`,
    type: type,
    duration: 0,
    plain: true,
    showClose: showClose,
    customClass: className
  })
  number--
  coutdownTime(msgObj, className, message, number)
}

export { countdownMessage }
