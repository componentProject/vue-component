<!-- QrCode组件主文件 -->
<template>
  <div
    class="qr-code-container"
    :style="containerStyle"
  >
    <canvas
      ref="canvasRef"
      :style="canvasStyle"
      :class="{ 'qr-code-clickable': downloadable }"
    />
    <div
      v-if="showLogo && logoUrl"
      class="qr-code-logo"
      :style="logoStyle"
    >
      <slot name="logo">
        <img
          :src="logoUrl"
          alt="Logo"
          :style="{ width: '100%', height: '100%', objectFit: 'contain' }"
        >
      </slot>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { QRCodeRenderersOptions } from 'qrcode'
import type { emitsType, propsType, slotsType } from './_types'
import { downloadImage } from '@moluoxixi/utils/_utils'
// @ts-expect-error - qrcode没有默认导出但实际可以这样使用
import QRCode from 'qrcode'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

defineOptions({
  name: 'QrCode',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<propsType>(), {
  text: '',
  size: 200,
  errorCorrectionLevel: 'H',
  colorDark: '#000000',
  colorLight: '#ffffff',
  margin: 4,
  showBorder: false,
  borderWidth: 1,
  borderColor: '#000000',
  showLogo: false,
  logoUrl: '',
  logoSize: 40,
  logoMargin: 4,
  logoBackgroundColor: '#ffffff',
  downloadable: false,
  downloadFileName: 'qrcode',
  imageType: 'image/png',
  quality: 0.92,
  autoCompleteUrl: true,
})

const emits = defineEmits<emitsType>()

const slots = defineSlots<slotsType>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const qrCodeUrl = ref<string>('')
let downloadHandler: (() => void) | null = null

/**
 * 检查是否为URL格式
 */
function isUrl(text: string): boolean {
  try {
    // 简单判断：包含点号且看起来像域名
    return /^[\da-z][\da-z-]{0,61}[\da-z]?\.[a-z]{2,}/i.test(text)
      || text.startsWith('http://')
      || text.startsWith('https://')
      || text.startsWith('//')
  }
  catch {
    return false
  }
}

/**
 * 处理文本，如果是URL且需要自动补全，则补全协议
 */
function processText(text: string): string {
  if (!text || !props.autoCompleteUrl) {
    return text
  }

  // 如果已经是完整URL（包含协议），直接返回
  if (text.startsWith('http://') || text.startsWith('https://')) {
    return text
  }

  // 如果是URL格式但没有协议，自动添加https://
  if (isUrl(text)) {
    return `https://${text}`
  }

  return text
}

/**
 * 容器样式
 */
const containerStyle = computed(() => {
  const baseStyle: Record<string, string> = {
    position: 'relative',
    display: 'inline-block',
    width: `${props.size}px`,
    height: `${props.size}px`,
  }

  if (props.showBorder) {
    baseStyle.border = `${props.borderWidth}px solid ${props.borderColor}`
  }

  return baseStyle
})

/**
 * Canvas样式
 */
const canvasStyle = computed(() => {
  return {
    width: '100%',
    height: '100%',
    display: 'block',
  }
})

/**
 * Logo样式
 */
const logoStyle = computed(() => {
  const logoPosition = (props.size - props.logoSize) / 2
  return {
    position: 'absolute' as const,
    top: `${logoPosition}px`,
    left: `${logoPosition}px`,
    width: `${props.logoSize}px`,
    height: `${props.logoSize}px`,
    backgroundColor: props.logoBackgroundColor,
    borderRadius: '4px',
    padding: `${props.logoMargin}px`,
    boxSizing: 'border-box' as const,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
})

/**
 * 生成二维码
 */
async function generateQRCode() {
  if (!canvasRef.value || !props.text) {
    return
  }

  try {
    // 处理文本，如果是URL且需要自动补全，则补全协议
    const processedText = processText(props.text)

    const borderWidth = props.showBorder ? props.borderWidth * 2 : 0
    const options: QRCodeRenderersOptions = {
      width: props.size - borderWidth,
      margin: props.margin,
      color: {
        dark: props.colorDark,
        light: props.colorLight,
      },
      errorCorrectionLevel: props.errorCorrectionLevel,
    }

    await QRCode.toCanvas(canvasRef.value, processedText, options)

    // 如果需要显示Logo，在Canvas上绘制
    if (props.showLogo && props.logoUrl) {
      await drawLogo()
    }

    // 获取生成的二维码图片URL
    const url = canvasRef.value.toDataURL(props.imageType, props.quality)
    qrCodeUrl.value = url

    emits('ready', url)

    // 设置或移除下载功能
    setupDownload()
  }
  catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    emits('error', err)
    console.error('二维码生成失败:', err)
  }
}

/**
 * 绘制Logo
 */
async function drawLogo() {
  if (!canvasRef.value || !props.logoUrl) {
    return
  }

  const ctx = canvasRef.value.getContext('2d')
  if (!ctx) {
    return
  }

  try {
    // 加载Logo图片
    const logoImg = await loadImage(props.logoUrl)
    const logoSize = props.logoSize
    const logoMargin = props.logoMargin
    const logoPosition = (props.size - logoSize) / 2

    // 绘制白色背景
    ctx.fillStyle = props.logoBackgroundColor
    ctx.fillRect(
      logoPosition - logoMargin,
      logoPosition - logoMargin,
      logoSize + logoMargin * 2,
      logoSize + logoMargin * 2,
    )

    // 绘制Logo
    ctx.drawImage(
      logoImg,
      logoPosition,
      logoPosition,
      logoSize,
      logoSize,
    )
  }
  catch (error) {
    console.error('Logo加载失败:', error)
  }
}

/**
 * 加载图片
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/**
 * 设置下载功能
 */
function setupDownload() {
  if (!canvasRef.value) {
    return
  }

  // 移除旧的事件监听器
  if (downloadHandler) {
    canvasRef.value.removeEventListener('click', downloadHandler)
    downloadHandler = null
  }

  // 如果支持下载，添加下载功能
  if (props.downloadable) {
    downloadHandler = handleDownload
    canvasRef.value.addEventListener('click', downloadHandler)
  }
}

/**
 * 处理下载
 */
async function handleDownload() {
  if (!qrCodeUrl.value) {
    return
  }

  try {
    await downloadImage(qrCodeUrl.value, props.downloadFileName, props.imageType)
    emits('download', qrCodeUrl.value)
  }
  catch (error) {
    console.error('下载二维码失败:', error)
    emits('error', error instanceof Error ? error : new Error(String(error)))
  }
}

// 监听文本变化，重新生成二维码
watch(() => props.text, () => {
  generateQRCode()
}, { immediate: false })

// 监听其他属性变化
watch(
  () => [
    props.size,
    props.errorCorrectionLevel,
    props.colorDark,
    props.colorLight,
    props.margin,
    props.showLogo,
    props.logoUrl,
    props.logoSize,
    props.downloadable,
  ],
  () => {
    generateQRCode()
  },
  { deep: true },
)

onMounted(() => {
  generateQRCode()
})

onUnmounted(() => {
  // 清理事件监听器
  if (canvasRef.value && downloadHandler) {
    canvasRef.value.removeEventListener('click', downloadHandler)
    downloadHandler = null
  }
})
</script>

<style lang="scss" scoped>
.qr-code-container {
  position: relative;

  canvas {
    width: 100%;
    height: 100%;
    display: block;
  }

  .qr-code-logo {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }

  .qr-code-clickable {
    cursor: pointer;
  }
}
</style>
