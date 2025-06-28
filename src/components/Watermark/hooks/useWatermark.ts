import { computed, ref, watch } from 'vue'
import type { ComputedRef } from 'vue'
import type { propsType } from '../types'
import { assign } from 'radash'

export type WatermarkType = Omit<propsType, 'className' | 'style' | 'children' | 'container'>
interface WatermarkOptions extends WatermarkType {
  container?: ComputedRef<HTMLElement | undefined> | HTMLElement
}
export function isNumber(obj: any): obj is number {
  return Object.prototype.toString.call(obj) === '[object Number]'
}

/**
 * 如果第一个参数可转为number,返回第一个参数,否则返回第二个参数
 * @param value
 * @param defaultValue
 */
function toNumber(value?: string | number, defaultValue?: number) {
  if (value === undefined) {
    return defaultValue
  }
  if (isNumber(value)) {
    return value
  }
  const numberVal = Number.parseFloat(value)
  return isNumber(numberVal) ? numberVal : defaultValue
}

/**
 * 默认配置
 */
const defaultOptions = {
  rotate: -20,
  zIndex: 1,
  width: 100,
  gap: [100, 100],
  fontStyle: {
    fontSize: '16px',
    color: 'rgba(0, 0, 0, 0.15)',
    fontFamily: 'sans-serif',
    fontWeight: 'normal',
  },
  // container: document.body
}

/**
 * 获取合并后的配置
 * @param options
 */
function getMergedOptions(options: Partial<WatermarkOptions> = {}) {
  const mergedOptions = {
    ...options,
    rotate: options.rotate || defaultOptions.rotate,
    zIndex: options.zIndex || defaultOptions.zIndex,
    fontStyle: { ...defaultOptions.fontStyle, ...options.fontStyle },
    // toNumber将第一个参数转为数字,如果转换的不成功,则返回第二个参数
    width: toNumber(options.width, options.image ? defaultOptions.width : undefined),
    height: toNumber(options.height, undefined)!,
    container: options.container!,
    gap: [
      toNumber(options.gap?.[0], defaultOptions.gap[0]),
      toNumber(options.gap?.[1] || options.gap?.[0], defaultOptions.gap[1]),
    ],
  } as Required<WatermarkOptions>

  const mergedOffsetX = toNumber(mergedOptions.offset?.[0], 0)!
  const mergedOffsetY = toNumber(mergedOptions.offset?.[1] || mergedOptions.offset?.[0], 0)!
  mergedOptions.offset = [mergedOffsetX, mergedOffsetY]

  return mergedOptions
}

/**
 * 根据画布宽高计算文本宽高
 * @param ctx 画布实例
 * @param content 文本内容
 * @param rotate 旋转角度
 */
function measureTextSize(ctx: CanvasRenderingContext2D, content: string[], rotate: number) {
  let width = 0
  let height = 0
  const lineSize: Array<{ width: number, height: number }> = []

  content.forEach((item) => {
    const {
      width: textWidth,
      fontBoundingBoxAscent,
      fontBoundingBoxDescent,
    } = ctx.measureText(item)

    const textHeight = fontBoundingBoxAscent + fontBoundingBoxDescent

    if (textWidth > width) {
      width = textWidth
    }

    height += textHeight
    lineSize.push({ height: textHeight, width: textWidth })
  })

  const angle = (rotate * Math.PI) / 180

  return {
    originWidth: width,
    originHeight: height,
    width: Math.ceil(Math.abs(Math.sin(angle) * height) + Math.abs(Math.cos(angle) * width)),
    height: Math.ceil(Math.abs(Math.sin(angle) * width) + Math.abs(height * Math.cos(angle))),
    lineSize,
  }
}

/**
 * 获取画布
 * @param options
 */
async function getCanvasData(options: Required<WatermarkOptions>): Promise<{ width: number, height: number, base64Url: string }> {
  const { rotate, image, content, fontStyle, gap } = options

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!

  const ratio = window.devicePixelRatio

  /**
   * 配置画布
   */
  const configCanvas = (size: { width: number, height: number }) => {
    const canvasWidth = gap[0] + size.width
    const canvasHeight = gap[1] + size.height

    canvas.setAttribute('width', `${canvasWidth * ratio}px`)
    canvas.setAttribute('height', `${canvasHeight * ratio}px`)
    canvas.style.width = `${canvasWidth}px`
    canvas.style.height = `${canvasHeight}px`

    ctx.translate((canvasWidth * ratio) / 2, (canvasHeight * ratio) / 2)
    ctx.scale(ratio, ratio)

    const RotateAngle = (rotate * Math.PI) / 180
    ctx.rotate(RotateAngle)
  }

  /**
   * 绘制文字
   */
  const drawText = () => {
    const { fontSize, color, fontWeight, fontFamily } = fontStyle
    const realFontSize = toNumber(fontSize, 0) || fontStyle.fontSize

    ctx.font = `${fontWeight} ${realFontSize}px ${fontFamily}`
    const measureSize = measureTextSize(ctx, [...content], rotate)

    const width = options.width || measureSize.width
    const height = options.height || measureSize.height

    configCanvas({ width, height })

    ctx.fillStyle = color!
    ctx.font = `${fontWeight} ${realFontSize}px ${fontFamily}`
    ctx.textBaseline = 'top'
    ;[...content].forEach((item, index) => {
      const { height: lineHeight, width: lineWidth } = measureSize.lineSize[index]

      const xStartPoint = -lineWidth / 2
      const yStartPoint = -(options.height || measureSize.originHeight) / 2 + lineHeight * index

      ctx.fillText(item, xStartPoint, yStartPoint, options.width || measureSize.originWidth)
    })
    return Promise.resolve({ base64Url: canvas.toDataURL(), height, width })
  }

  /**
   * 绘制图片
   */
  function drawImage() {
    return new Promise<{ width: number, height: number, base64Url: string }>((resolve) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.referrerPolicy = 'no-referrer'

      img.src = image
      img.onload = () => {
        let { width, height } = options
        if (!width || !height) {
          if (width) {
            height = (img.height / img.width) * +width
          }
          else {
            width = (img.width / img.height) * +height
          }
        }
        configCanvas({ width, height })

        ctx.drawImage(img, -width / 2, -height / 2, width, height)
        return resolve({ base64Url: canvas.toDataURL(), width, height })
      }
      img.onerror = () => {
        return drawText()
      }
    })
  }

  return image ? drawImage() : drawText()
}
/**
 * 创建水印
 * 1. 可以选择传入挂载水印的容器元素，默认是 body
 * 2. 做了水印防御，能有效防御别人打开控制台删除或隐藏水印
 */
export default function useWatermark(params: WatermarkOptions = {}) {
  const options = ref<WatermarkOptions>(params || {})

  const mergedOptions = computed(() => getMergedOptions(options.value))
  const watermarkDiv = ref<HTMLDivElement>()
  const mutationObserver = ref<MutationObserver>()

  function drawWatermark() {
    const container = mergedOptions.value.container as HTMLElement
    console.log('mergedOptions.value', mergedOptions.value)
    const { zIndex, gap } = mergedOptions.value
    if (!container) {
      return
    }

    getCanvasData(mergedOptions.value).then(({ base64Url, width, height }) => {
      const offsetLeft = `${mergedOptions.value.offset[0]}px`
      const offsetTop = `${mergedOptions.value.offset[1]}px`

      const wmStyle = `
      width:calc(100% - ${offsetLeft});
      height:calc(100% - ${offsetTop});
      position:absolute;
      top:${offsetTop};
      left:${offsetLeft};
      bottom:0;
      right:0;
      pointer-events: none;
      z-index:${zIndex};
      background-position: 0 0;
      background-size:${gap[0] + width}px ${gap[1] + height}px;
      background-repeat: repeat;
      background-image:url(${base64Url})`

      if (!watermarkDiv.value) {
        const div = document.createElement('div')
        watermarkDiv.value = div
        if (!container)
          return
        container.append(div)
        container.style.position = 'relative'
      }

      watermarkDiv.value?.setAttribute('style', wmStyle.trim())

      if (container) {
        mutationObserver.value?.disconnect()

        mutationObserver.value = new MutationObserver((mutations) => {
          const isChanged = mutations.some((mutation) => {
            let flag = false
            if (mutation.removedNodes.length) {
              flag = Array.from(mutation.removedNodes).includes(watermarkDiv.value!)
            }
            if (mutation.type === 'attributes' && mutation.target === watermarkDiv.value) {
              flag = true
            }
            return flag
          })
          if (isChanged) {
            watermarkDiv.value?.parentNode?.removeChild(watermarkDiv.value)
            watermarkDiv.value = undefined
            drawWatermark()
          }
        })

        mutationObserver.value.observe(container, {
          attributes: true,
          subtree: true,
          childList: true,
        })
      }
    })
  }

  watch(
    () => {
      return options.value
    },
    () => {
      drawWatermark()
    },
    {
      immediate: true,
      deep: true,
    },
  )

  return {
    generateWatermark: (newOptions: Partial<WatermarkOptions>) => {
      options.value = assign<WatermarkOptions>(options.value, newOptions)
    },
  }
}
