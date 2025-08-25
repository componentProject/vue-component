/*
 * @Date: 2024-10-10 17:28:47
 * @LastEditors: AaronChu
 * @LastEditTime: 2024-10-10 17:34:31
 */
export default class Log {
  isEmpty = (value) => {
    return value == null || value === undefined || value === ''
  }
  prettyPrint = (title, text, color) => {
    console.log(
      `%c ${title} %c ${text} %c`,
      `background:${color};border:1px solid ${color}; padding: 1px; border-radius: 2px 0 0 2px; color: #fff;`,
      `border:1px solid ${color}; padding: 1px; border-radius: 0 2px 2px 0; color: ${color};`,
      'background:transparent'
    )
  }
  info = (textOrTitle, content = '') => {
    const title = this.isEmpty(content) ? 'Info' : textOrTitle
    const text = this.isEmpty(content) ? textOrTitle : content
    this.prettyPrint(title, text, '#909399')
  }
  error = (textOrTitle, content = '') => {
    const title = this.isEmpty(content) ? 'Error' : textOrTitle
    const text = this.isEmpty(content) ? textOrTitle : content
    this.prettyPrint(title, text, '#F56C6C')
  }
  warning = (textOrTitle, content = '') => {
    const title = this.isEmpty(content) ? 'Warning' : textOrTitle
    const text = this.isEmpty(content) ? textOrTitle : content
    this.prettyPrint(title, text, '#E6A23C')
  }
  success = (textOrTitle, content = '') => {
    const title = this.isEmpty(content) ? 'Success ' : textOrTitle
    const text = this.isEmpty(content) ? textOrTitle : content
    this.prettyPrint(title, text, '#67C23A')
  }
  picture = (url, scale = 1) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const c = document.createElement('canvas')
      const ctx = c.getContext('2d')
      if (ctx) {
        c.width = img.width
        c.height = img.height
        ctx.fillStyle = 'red'
        ctx.fillRect(0, 0, c.width, c.height)
        ctx.drawImage(img, 0, 0)
        const dataUri = c.toDataURL('image/png')

        console.log(
          `%c sup?`,
          `font-size: 1px;
                padding: ${Math.floor((img.height * scale) / 2)}px ${Math.floor((img.width * scale) / 2)}px;
                background-image: url(${dataUri});
                background-repeat: no-repeat;
                background-size: ${img.width * scale}px ${img.height * scale}px;
                color: transparent;
                `
        )
      }
    }
    img.src = url
  }
}
