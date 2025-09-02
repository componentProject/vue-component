<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="visible"
        class="modal-overlay"
        :class="[
          { 'modal-overlay-draggable': draggable },
          { 'modal-overlay-penetrate': penetrate }
        ]"
        :style="overlayStyle"
        @click="handleOverlayClick"
      >
        <div
          ref="modalRef"
          class="modal-dialog"
          :class="[
            `modal-${size}`,
            { 'modal-draggable': draggable },
          ]"
          :style="modalStyle"
          @click.stop
        >
          <!-- 拖拽句柄 - 可拖拽整个头部 -->
          <div
            v-if="draggable"
            class="modal-header modal-draggable-header"
            @mousedown="startDrag"
          >
            <!-- 完全自定义头部插槽 -->
            <slot v-if="$slots.header" name="header" :close="handleClose" :title="title">
              <!-- 默认内容 -->
            </slot>

            <!-- 默认头部内容（没有header插槽时） -->
            <template v-else>
              <!-- 自定义左侧内容 -->
              <div class="modal-header-left">
                <slot name="header-left" :title="title">
                  <h3 class="modal-title">
                    {{ title }}
                  </h3>
                </slot>
              </div>

              <!-- 自定义右侧内容 -->
              <div class="modal-header-right">
                <slot name="header-right" :close="handleClose">
                  <button
                    v-if="showClose"
                    class="modal-close"
                    aria-label="关闭"
                    @click="handleClose"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M12.5 3.5L3.5 12.5M3.5 3.5L12.5 12.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                    </svg>
                  </button>
                </slot>
              </div>
            </template>
          </div>

          <!-- 头部 - 不可拖拽版本 -->
          <div
            v-else
            class="modal-header"
          >
            <!-- 完全自定义头部插槽 -->
            <slot v-if="$slots.header" name="header" :close="handleClose" :title="title">
              <!-- 默认内容 -->
            </slot>

            <!-- 默认头部内容（没有header插槽时） -->
            <template v-else>
              <!-- 自定义左侧内容 -->
              <div class="modal-header-left">
                <slot name="header-left" :title="title">
                  <h3 class="modal-title">
                    {{ title }}
                  </h3>
                </slot>
              </div>

              <!-- 自定义右侧内容 -->
              <div class="modal-header-right">
                <slot name="header-right" :close="handleClose">
                  <button
                    v-if="showClose"
                    class="modal-close"
                    aria-label="关闭"
                    @click="handleClose"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M12.5 3.5L3.5 12.5M3.5 3.5L12.5 12.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                    </svg>
                  </button>
                </slot>
              </div>
            </template>
          </div>

          <!-- 内容区域 -->
          <div class="modal-body">
            <slot>{{ content }}</slot>
          </div>

          <!-- 底部操作区 -->
          <div v-if="$slots.footer || showFooter" class="modal-footer">
            <slot name="footer">
              <button
                v-if="showCancel"
                class="modal-btn modal-btn-secondary"
                @click="handleCancel"
              >
                {{ cancelText }}
              </button>
              <button
                v-if="showConfirm"
                class="modal-btn modal-btn-primary"
                :disabled="confirmDisabled"
                @click="handleConfirm"
              >
                {{ confirmText }}
              </button>
            </slot>
          </div>

          <!-- 8方向调整大小句柄 -->
          <template v-if="resizable">
            <!-- 四个角 -->
            <div class="resize-handle resize-handle-nw" data-direction="nw" @mousedown="startResize($event, 'nw')" />
            <div class="resize-handle resize-handle-ne" data-direction="ne" @mousedown="startResize($event, 'ne')" />
            <div class="resize-handle resize-handle-sw" data-direction="sw" @mousedown="startResize($event, 'sw')" />
            <div class="resize-handle resize-handle-se" data-direction="se" @mousedown="startResize($event, 'se')" />

            <!-- 四条边 -->
            <div class="resize-handle resize-handle-n" data-direction="n" @mousedown="startResize($event, 'n')" />
            <div class="resize-handle resize-handle-s" data-direction="s" @mousedown="startResize($event, 's')" />
            <div class="resize-handle resize-handle-w" data-direction="w" @mousedown="startResize($event, 'w')" />
            <div class="resize-handle resize-handle-e" data-direction="e" @mousedown="startResize($event, 'e')" />
          </template>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'

interface Props {
  /** 控制对话框显示/隐藏 */
  visible?: boolean
  /** 对话框标题 */
  title?: string
  /** 对话框内容文本，支持HTML */
  content?: string
  /** 对话框宽度，支持数字(px)或字符串(如'50%') */
  width?: string | number
  /** 对话框高度，支持数字(px)或字符串(如'50%') */
  height?: string | number
  /** 预设尺寸：small(400px)、medium(520px)、large(720px) */
  size?: 'small' | 'medium' | 'large'
  /** 对话框顶部距离，支持数字(px)或字符串(如'50%') */
  top?: string | number
  /** 对话框左侧距离，支持数字(px)或字符串(如'50%') */
  left?: string | number
  /** 是否可拖拽移动，开启后可通过标题栏拖拽 */
  draggable?: boolean
  /** 是否可调整大小，开启后显示8方向调整手柄 */
  resizable?: boolean
  /** 是否显示关闭按钮 */
  showClose?: boolean
  /** 是否显示底部操作区 */
  showFooter?: boolean
  /** 是否显示取消按钮 */
  showCancel?: boolean
  /** 是否显示确认按钮 */
  showConfirm?: boolean
  /** 取消按钮文本 */
  cancelText?: string
  /** 确认按钮文本 */
  confirmText?: string
  /** 是否禁用确认按钮 */
  confirmDisabled?: boolean
  /** 是否显示遮罩层 */
  mask?: boolean
  /** 点击遮罩层是否可关闭对话框 */
  maskClosable?: boolean
  /** 对话框层级，默认1000 */
  zIndex?: number
  /** 最小宽度限制(px)，默认300 */
  minWidth?: number
  /** 最小高度限制(px)，默认200 */
  minHeight?: number
  /** 最大宽度限制(px)，未设置时自动适应容器 */
  maxWidth?: number
  /** 最大高度限制(px)，未设置时自动适应容器 */
  maxHeight?: number
  /** 边距保护值(px)，拖拽/缩放时保持与容器边距，默认16 */
  margin?: number
  /** 是否启用位置记忆功能 */
  rememberPosition?: boolean
  /** 位置记忆的唯一标识符，用于区分不同的对话框 */
  positionKey?: string
  /** 是否允许遮罩层穿透，开启后点击事件可传递到下方元素 */
  penetrate?: boolean
}

interface Emits {
  (e: 'update:visible', visible: boolean): void
  (e: 'close'): void
  (e: 'cancel'): void
  (e: 'confirm'): void
  (e: 'open'): void
  (e: 'opened'): void
  (e: 'closed'): void
  (e: 'update:top', top: string | number): void
  (e: 'update:left', left: string | number): void
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  title: '提示',
  content: '',
  size: 'medium',
  draggable: false,
  resizable: false,
  showClose: true,
  showFooter: true,
  showCancel: true,
  showConfirm: true,
  cancelText: '取消',
  confirmText: '确定',
  confirmDisabled: false,
  mask: true,
  maskClosable: true,
  zIndex: 1000,
  minWidth: 300,
  minHeight: 200,
  margin: 16,
  rememberPosition: false,
  positionKey: '',
  penetrate: false,
})

const emit = defineEmits<Emits>()

// 状态管理
const modalRef = ref<HTMLElement>()
const isDragging = ref(false)
const isResizing = ref(false)
const dragStartPos = ref({ x: 0, y: 0, left: 0, top: 0 })
const resizeState = ref({
  direction: '',
  startX: 0,
  startY: 0,
  startWidth: 0,
  startHeight: 0,
  startLeft: 0,
  startTop: 0,
})

// 实际位置状态
const currentTop = ref(0)
const currentLeft = ref(0)
const currentWidth = ref(0)
const currentHeight = ref(0)

// 位置记忆相关
interface PositionData {
  top: number
  left: number
  width: number
  height: number
  timestamp: number
}

const interactionEndTime = ref(0)

// 修改 handleOverlayClick 函数
function handleOverlayClick(event: MouseEvent) {
  // 如果正在拖拽或调整大小，不关闭弹窗
  if (isDragging.value || isResizing.value) {
    return
  }

  // 如果刚刚结束交互（300ms内），不关闭弹窗，防止误触
  if (Date.now() - interactionEndTime.value < 300) {
    return
  }

  if (props.maskClosable) {
    handleClose()
  }
}

// 生成存储键名
function getStorageKey(): string {
  const key = props.positionKey || `modal-position-${props.title || 'default'}`
  return `modal-dialog-${key}`
}

// 保存位置到localStorage
function savePosition() {
  if (!props.rememberPosition)
    return

  const positionData: PositionData = {
    top: currentTop.value,
    left: currentLeft.value,
    width: currentWidth.value,
    height: currentHeight.value,
    timestamp: Date.now(),
  }

  try {
    localStorage.setItem(getStorageKey(), JSON.stringify(positionData))
  }
  catch (error) {
    console.warn('Failed to save modal position:', error)
  }
}

// 从localStorage读取位置
function loadPosition(): PositionData | null {
  if (!props.rememberPosition)
    return null

  try {
    const stored = localStorage.getItem(getStorageKey())
    if (stored) {
      const data = JSON.parse(stored) as PositionData

      // 验证数据有效性
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight

      if (
        data.left >= 0
        && data.top >= 0
        && data.left + data.width <= windowWidth
        && data.top + data.height <= windowHeight
        && data.width >= props.minWidth
        && data.height >= props.minHeight
      ) {
        return data
      }
    }
  }
  catch (error) {
    console.warn('Failed to load modal position:', error)
  }
  return null
}

// 响应式样式
const modalStyle = computed(() => {
  const style: Record<string, any> = {
    zIndex: props.zIndex,
  }

  // 设置宽度
  if (currentWidth.value > 0) {
    style.width = `${currentWidth.value}px`
  }
  else if (props.width) {
    style.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  }

  // 设置高度
  if (currentHeight.value > 0) {
    style.height = `${currentHeight.value}px`
  }
  else if (props.height) {
    style.height = typeof props.height === 'number' ? `${props.height}px` : props.height
  }

  // 设置位置
  if (props.draggable) {
    style.position = 'absolute'
    style.top = `${currentTop.value}px`
    style.left = `${currentLeft.value}px`
    style.margin = '0'
  }
  else {
    // 非拖拽模式下，支持百分比和数字
    if (props.top !== undefined) {
      style.top = typeof props.top === 'number' ? `${props.top}px` : props.top
    }
    if (props.left !== undefined) {
      style.left = typeof props.left === 'number' ? `${props.left}px` : props.left
    }
  }

  return style
})

// 事件处理
function handleClose() {
  emit('update:visible', false)
  emit('close')
}

function handleCancel() {
  emit('cancel')
  handleClose()
}

function handleConfirm() {
  emit('confirm')
}

// 拖拽功能
function startDrag(e: MouseEvent) {
  if (!props.draggable || !modalRef.value)
    return

  isDragging.value = true
  const rect = modalRef.value.getBoundingClientRect()

  dragStartPos.value = {
    x: e.clientX,
    y: e.clientY,
    left: currentLeft.value || rect.left,
    top: currentTop.value || rect.top,
  }

  // 阻止事件冒泡，防止触发遮罩层点击
  e.stopPropagation()

  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
  document.body.style.cursor = 'move'
  document.body.style.userSelect = 'none'
}

function onDrag(e: MouseEvent) {
  if (!isDragging.value)
    return

  const deltaX = e.clientX - dragStartPos.value.x
  const deltaY = e.clientY - dragStartPos.value.y

  // 计算新位置
  let newLeft = dragStartPos.value.left + deltaX
  let newTop = dragStartPos.value.top + deltaY

  // 边界检查 - 添加20px边距保护
  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight
  const modalWidth = modalRef.value?.offsetWidth || 0
  const modalHeight = modalRef.value?.offsetHeight || 0

  // 限制在视窗内，保持20px边距
  newLeft = Math.max(props.margin, Math.min(newLeft, windowWidth - modalWidth - props.margin))
  newTop = Math.max(props.margin, Math.min(newTop, windowHeight - modalHeight - props.margin))

  currentLeft.value = newLeft
  currentTop.value = newTop

  emit('update:top', newTop)
  emit('update:left', newLeft)
}

function stopDrag() {
  isDragging.value = false
  interactionEndTime.value = Date.now()
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.body.style.cursor = ''
  document.body.style.userSelect = ''

  // 拖拽结束时保存位置
  savePosition()
}

// 8方向调整大小功能
function startResize(e: MouseEvent, direction: string) {
  if (!props.resizable || !modalRef.value)
    return

  isResizing.value = true
  const rect = modalRef.value.getBoundingClientRect()

  resizeState.value = {
    direction,
    startX: e.clientX,
    startY: e.clientY,
    startWidth: rect.width,
    startHeight: rect.height,
    startLeft: currentLeft.value || rect.left,
    startTop: currentTop.value || rect.top,
  }

  // 阻止事件冒泡，防止触发遮罩层点击
  e.stopPropagation()

  document.addEventListener('mousemove', onResize)
  document.addEventListener('mouseup', stopResize)
  document.body.style.cursor = getCursorByDirection(direction)
  document.body.style.userSelect = 'none'
}

function onResize(e: MouseEvent) {
  if (!isResizing.value || !modalRef.value)
    return

  const deltaX = e.clientX - resizeState.value.startX
  const deltaY = e.clientY - resizeState.value.startY
  const direction = resizeState.value.direction

  let newWidth = resizeState.value.startWidth
  let newHeight = resizeState.value.startHeight
  let newLeft = resizeState.value.startLeft
  let newTop = resizeState.value.startTop

  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight

  // 根据方向调整大小和位置
  switch (direction) {
    case 'n':
      newHeight = resizeState.value.startHeight - deltaY
      newTop = resizeState.value.startTop + deltaY
      break
    case 's':
      newHeight = resizeState.value.startHeight + deltaY
      break
    case 'w':
      newWidth = resizeState.value.startWidth - deltaX
      newLeft = resizeState.value.startLeft + deltaX
      break
    case 'e':
      newWidth = resizeState.value.startWidth + deltaX
      break
    case 'nw':
      newWidth = resizeState.value.startWidth - deltaX
      newHeight = resizeState.value.startHeight - deltaY
      newLeft = resizeState.value.startLeft + deltaX
      newTop = resizeState.value.startTop + deltaY
      break
    case 'ne':
      newWidth = resizeState.value.startWidth + deltaX
      newHeight = resizeState.value.startHeight - deltaY
      newTop = resizeState.value.startTop + deltaY
      break
    case 'sw':
      newWidth = resizeState.value.startWidth - deltaX
      newHeight = resizeState.value.startHeight + deltaY
      newLeft = resizeState.value.startLeft + deltaX
      break
    case 'se':
      newWidth = resizeState.value.startWidth + deltaX
      newHeight = resizeState.value.startHeight + deltaY
      break
  }

  // 计算最大可用尺寸（容器减去边距）
  const maxAvailableWidth = windowWidth - props.margin * 2
  const maxAvailableHeight = windowHeight - props.margin * 2

  // 应用最小尺寸和最大尺寸限制
  let finalMaxWidth = maxAvailableWidth
  let finalMaxHeight = maxAvailableHeight

  // 如果传入了maxWidth/maxHeight，则使用较小的值
  if (props.maxWidth !== undefined) {
    finalMaxWidth = Math.min(props.maxWidth, maxAvailableWidth)
  }
  if (props.maxHeight !== undefined) {
    finalMaxHeight = Math.min(props.maxHeight, maxAvailableHeight)
  }

  newWidth = Math.max(props.minWidth, Math.min(newWidth, finalMaxWidth))
  newHeight = Math.max(props.minHeight, Math.min(newHeight, finalMaxHeight))

  // 确保不超出视窗边界
  if (newLeft < props.margin) {
    if (direction.includes('w')) {
      newWidth = newWidth - (props.margin - newLeft)
    }
    newLeft = props.margin
  }

  if (newTop < props.margin) {
    if (direction.includes('n')) {
      newHeight = newHeight - (props.margin - newTop)
    }
    newTop = props.margin
  }

  if (newLeft + newWidth > windowWidth - props.margin) {
    if (direction.includes('e')) {
      newWidth = windowWidth - props.margin - newLeft
    }
    else {
      newLeft = windowWidth - props.margin - newWidth
    }
  }

  if (newTop + newHeight > windowHeight - props.margin) {
    if (direction.includes('s')) {
      newHeight = windowHeight - props.margin - newTop
    }
    else {
      newTop = windowHeight - props.margin - newHeight
    }
  }

  currentWidth.value = newWidth
  currentHeight.value = newHeight
  currentLeft.value = newLeft
  currentTop.value = newTop
}

function stopResize() {
  isResizing.value = false
  interactionEndTime.value = Date.now()
  document.removeEventListener('mousemove', onResize)
  document.removeEventListener('mouseup', stopResize)
  document.body.style.cursor = ''
  document.body.style.userSelect = ''

  // 调整大小结束时保存位置
  savePosition()
}

// 获取方向对应的光标样式
function getCursorByDirection(direction: string): string {
  const cursorMap: Record<string, string> = {
    n: 'n-resize',
    s: 's-resize',
    w: 'w-resize',
    e: 'e-resize',
    nw: 'nw-resize',
    ne: 'ne-resize',
    sw: 'sw-resize',
    se: 'se-resize',
  }
  return cursorMap[direction] || 'default'
}

// 工具函数：将百分比或像素值转换为像素
function parsePositionValue(value: string | number | undefined, total: number): number {
  if (value === undefined)
    return 0
  if (typeof value === 'number')
    return value
  if (typeof value === 'string') {
    const match = value.match(/^(\d+(?:\.\d+)?)%$/)
    if (match) {
      return (Number.parseFloat(match[1]) / 100) * total
    }
    const pxMatch = value.match(/^(\d+(?:\.\d+)?)px$/)
    if (pxMatch) {
      return Number.parseFloat(pxMatch[1])
    }
    return Number.parseFloat(value) || 0
  }
  return 0
}

// 初始化位置
function initPosition() {
  if (!modalRef.value)
    return

  // 尝试从localStorage加载位置
  const savedPosition = loadPosition()

  if (savedPosition) {
    // 使用保存的位置
    currentTop.value = savedPosition.top
    currentLeft.value = savedPosition.left
    currentWidth.value = savedPosition.width
    currentHeight.value = savedPosition.height
    return
  }

  // 如果没有保存的位置，使用传入的top/left或默认居中
  const rect = modalRef.value.getBoundingClientRect()
  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight

  // 计算可用的最大尺寸（容器减去边距）
  const maxAvailableWidth = windowWidth - props.margin * 2
  const maxAvailableHeight = windowHeight - props.margin * 2

  // 计算最终最大尺寸，优先使用传入的maxWidth/maxHeight
  const finalMaxWidth = props.maxWidth !== undefined ? Math.min(props.maxWidth, maxAvailableWidth) : maxAvailableWidth
  const finalMaxHeight = props.maxHeight !== undefined ? Math.min(props.maxHeight, maxAvailableHeight) : maxAvailableHeight

  // 使用实际尺寸或默认尺寸，但不超过最大可用尺寸
  const modalWidth = Math.min(Math.max(rect.width || props.minWidth || 300, props.minWidth), finalMaxWidth)
  const modalHeight = Math.min(Math.max(rect.height || props.minHeight || 200, props.minHeight), finalMaxHeight)

  // 优先使用传入的top/left值，如果没有则居中
  let left = (windowWidth - modalWidth) / 2
  let top = (windowHeight - modalHeight) / 2

  // 如果传入了top/left，解析百分比或像素值
  if (props.top !== undefined) {
    top = parsePositionValue(props.top, windowHeight)
  }
  if (props.left !== undefined) {
    left = parsePositionValue(props.left, windowWidth)
  }

  // 应用边距限制
  currentLeft.value = Math.max(props.margin, left)
  currentTop.value = Math.max(props.margin, top)
  currentWidth.value = modalWidth
  currentHeight.value = modalHeight
}

// 生命周期
onMounted(() => {
  if (props.visible) {
    emit('open')
    nextTick(() => {
      initPosition()
      emit('opened')
    })
  }
})

// 监听visible变化
watch(() => props.visible, (newVal: any) => {
  if (newVal) {
    emit('open')
    nextTick(() => {
      initPosition()
      emit('opened')
    })
  }
  else {
    emit('closed')
  }
})

// 清理事件监听
onUnmounted(() => {
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('mousemove', onResize)
  document.removeEventListener('mouseup', stopResize)
})

// 添加遮罩层样式计算
const overlayStyle = computed(() => {
  const style: Record<string, any> = {
    zIndex: props.zIndex,
  }

  // 根据mask属性决定是否显示背景色
  if (props.mask) {
    style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
  } else {
    style.backgroundColor = 'transparent'
  }

  // 添加穿透样式
if (props.penetrate && !props.mask) {
    style.pointerEvents = 'none'
  }

  return style
})

function clearPosition() {
  if (!props.rememberPosition || !props.positionKey) {
    return
  }

  try {
    localStorage.removeItem(`drag-modal-${props.positionKey}`)
    // 重置为默认居中位置
    nextTick(() => {
      initPosition()
    })
  } catch (error) {
    console.warn('Failed to clear modal position from localStorage:', error)
  }
}
defineExpose({
  clearPosition
})
</script>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  // 移除原来的background-color，改为通过style绑定
}

.modal-overlay-draggable {
  align-items: flex-start;
  justify-content: flex-start;
}

.modal-overlay-penetrate {
  pointer-events: none;
}

.modal-overlay-penetrate .modal-dialog {
  pointer-events: auto;
}

.modal-dialog {
  position: relative;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 尺寸变体 */
.modal-small {
  width: 400px;
}

.modal-medium {
  width: 520px;
}

.modal-large {
  width: 720px;
}

.modal-full {
  width: 90vw;
  height: 90vh;
}

/* 拖拽头部样式 */
.modal-draggable-header {
  cursor: move;
  user-select: none;
}

/* 头部样式 */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-title {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
}

.modal-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: rgba(0, 0, 0, 0.45);
  transition: color 0.3s;

  &:hover {
    color: rgba(0, 0, 0, 0.75);
  }
}

/* 内容区域 */
.modal-body {
  flex: 1;
  padding: 24px;
}

/* 底部操作区 */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 10px 16px;
  border-top: 1px solid #f0f0f0;
  background: #fafafa;
}

.modal-btn {
  padding: 6px 15px;
  border-radius: 6px;
  border: 1px solid transparent;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.modal-btn-primary {
  background: #1677ff;
  border-color: #1677ff;
  color: white;

  &:hover:not(:disabled) {
    background: #4096ff;
    border-color: #4096ff;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.modal-btn-secondary {
  background: white;
  border-color: #d9d9d9;
  color: rgba(0, 0, 0, 0.88);

  &:hover {
    border-color: #4096ff;
    color: #4096ff;
  }
}

/* 8方向调整大小句柄 */
.resize-handle {
  position: absolute;
  background: transparent;
  z-index: 10;

  &:hover {
    background: rgba(22, 119, 255, 0.1);
  }
}

/* 四个角 - 8x8px */
.resize-handle-nw,
.resize-handle-ne,
.resize-handle-sw,
.resize-handle-se {
  width: 8px;
  height: 8px;
}

.resize-handle-nw {
  top: 0;
  left: 0;
  cursor: nw-resize;
}

.resize-handle-ne {
  top: 0;
  right: 0;
  cursor: ne-resize;
}

.resize-handle-sw {
  bottom: 0;
  left: 0;
  cursor: sw-resize;
}

.resize-handle-se {
  bottom: 0;
  right: 0;
  cursor: se-resize;
}

/* 四条边 */
.resize-handle-n,
.resize-handle-s {
  left: 8px;
  right: 8px;
  height: 4px;
}

.resize-handle-w,
.resize-handle-e {
  top: 8px;
  bottom: 8px;
  width: 4px;
}

.resize-handle-n {
  top: 0;
  cursor: n-resize;
}

.resize-handle-s {
  bottom: 0;
  cursor: s-resize;
}

.resize-handle-w {
  left: 0;
  cursor: w-resize;
}

.resize-handle-e {
  right: 0;
  cursor: e-resize;
}

/* 动画 */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-dialog {
  animation: modalZoomIn 0.3s;
}

.modal-fade-leave-active .modal-dialog {
  animation: modalZoomOut 0.3s;
}

@keyframes modalZoomIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes modalZoomOut {
  from {
    transform: scale(1);
    opacity: 1;
  }
  to {
    transform: scale(0.9);
    opacity: 0;
  }
}
</style>
