<template>
  <Teleport :to="props.teleportTo">
    <Transition
      name="modal-fade"
      @after-leave="handleAfterLeave"
    >
      <div
        v-if="renderModal && props.visible"
        class="modal-overlay"
        :class="[
          { 'modal-overlay-draggable': props.draggable },
          { 'modal-overlay-penetrate': props.penetrate },
        ]"
        :style="overlayStyle"
        @click="handleOverlayClick"
      >
        <div
          ref="modalRef"
          class="modal-dialog"
          :class="[
            { [`modal-${props.size}`]: !props.width },
            { 'modal-draggable': props.draggable },
          ]"
          :style="modalStyle"
          @click.stop
        >
          <!-- 拖拽句柄 - 可拖拽整个头部 -->
          <div
            class="modal-header"
            :class="{ 'modal-draggable-header': props.draggable }"
            @mousedown="startDrag"
          >
            <!-- 完全自定义头部插槽 -->
            <slot name="header" :close="handleClose" :title="props.title">
              <!-- 默认内容 -->
              <!-- 自定义左侧内容 -->
              <div class="modal-header-left">
                <slot name="header-left" :title="props.title">
                  <h3 class="modal-title">
                    {{ props.title }}
                  </h3>
                </slot>
              </div>

              <!-- 自定义右侧内容 -->
              <div class="modal-header-right">
                <slot name="header-right" :close="handleClose">
                  <button
                    v-if="props.showClose"
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
            </slot>
          </div>

          <!-- 内容区域 -->
          <div class="modal-body">
            <div class="modal-body-content" :style="props.contentStyle">
              <slot>{{ props.content }}</slot>
            </div>
          </div>

          <!-- 底部操作区 -->
          <div v-if="props.showFooter" class="modal-footer">
            <slot name="footer">
              <Buttons v-if="props.buttons" :buttons="props.buttons" />
              <template v-else>
                <button
                  v-if="props.showCancel"
                  class="modal-btn modal-btn-secondary"
                  @click="handleCancel"
                >
                  {{ props.cancelText }}
                </button>
                <button
                  v-if="props.showConfirm"
                  class="modal-btn modal-btn-primary"
                  :disabled="confirmDisabled"
                  @click="handleConfirm"
                >
                  {{ props.confirmText }}
                </button>
              </template>
            </slot>
          </div>

          <!-- 8方向调整大小句柄 -->
          <template v-if="props.resizable">
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
import { Buttons } from '@moluoxixi/components/_utilComponents'
import type { emitsType, propsType } from './_types'

defineOptions({
  name: 'DragModalDialog',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<propsType>(), {
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
  teleportTo: 'body',
  destroyOnClose: false,
  contentStyle: {},
})

const emit = defineEmits<emitsType>()

const renderModal = ref(false)

// 监听 visible 变化，控制渲染
watch(() => props.visible, (newVal: any) => {
  if (newVal) {
    renderModal.value = true
  }
  else if (!props.destroyOnClose) {
    // 如果不是 destroyOnClose 模式，保持渲染
    renderModal.value = true
  }
}, { immediate: true })

// 处理动画完成后的销毁
function handleAfterLeave() {
  if (props.destroyOnClose) {
    renderModal.value = false
  }
  emit('closed')
}

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
function handleOverlayClick() {
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

  // 边界检查 - 限制在内容区域内（考虑边距）
  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight
  const modalWidth = modalRef.value?.offsetWidth || 0
  const modalHeight = modalRef.value?.offsetHeight || 0

  // 内容区域边界
  const maxLeft = windowWidth - props.margin - modalWidth
  const maxTop = windowHeight - props.margin - modalHeight
  const minLeft = props.margin
  const minTop = props.margin

  // 限制在内容区域内
  newLeft = Math.max(minLeft, Math.min(newLeft, maxLeft))
  newTop = Math.max(minTop, Math.min(newTop, maxTop))

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

// 工具函数：根据 size 获取对应的宽度
function getSizeWidth(size: 'small' | 'medium' | 'large'): number {
  const sizeMap = {
    small: 400,
    medium: 520,
    large: 720,
  }
  return sizeMap[size] || 520 // 默认为 medium
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

  // 计算可用的最大尺寸（内容区域 = 视窗 - 边距）
  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight

  // 内容区域边界（考虑边距限制）
  const contentArea = {
    width: windowWidth - props.margin * 2,
    height: windowHeight - props.margin * 2,
    left: props.margin,
    top: props.margin,
  }

  // 计算宽度：优先使用 width 属性，其次使用 size 属性
  let targetWidth: number
  if (props.width) {
    targetWidth = typeof props.width === 'number' ? props.width : parsePositionValue(props.width, contentArea.width)
  }
  else {
    targetWidth = getSizeWidth(props.size)
  }

  // 计算高度：优先使用 height 属性
  let targetHeight: number
  if (props.height) {
    targetHeight = typeof props.height === 'number' ? props.height : parsePositionValue(props.height, contentArea.height)
  }
  else {
    targetHeight = 200 // 默认高度
  }

  // 确保尺寸在内容区域内
  targetWidth = Math.max(props.minWidth, Math.min(targetWidth, contentArea.width))
  targetHeight = Math.max(props.minHeight, Math.min(targetHeight, contentArea.height))

  // 计算位置：确保在内容区域内
  let targetLeft: number
  let targetTop: number

  // 如果传入了 left，解析并限制在内容区域内
  if (props.left !== undefined) {
    const requestedLeft = typeof props.left === 'number' ? props.left : parsePositionValue(props.left, windowWidth)
    // 限制在内容区域内：确保不会超出右边界
    targetLeft = Math.max(contentArea.left, Math.min(requestedLeft, contentArea.left + contentArea.width - targetWidth))
  }
  else {
    // 默认居中在内容区域内
    targetLeft = contentArea.left + (contentArea.width - targetWidth) / 2
  }

  // 如果传入了 top，解析并限制在内容区域内
  if (props.top !== undefined) {
    const requestedTop = typeof props.top === 'number' ? props.top : parsePositionValue(props.top, windowHeight)
    // 限制在内容区域内：确保不会超出下边界
    targetTop = Math.max(contentArea.top, Math.min(requestedTop, contentArea.top + contentArea.height - targetHeight))
  }
  else {
    // 默认居中在内容区域内
    targetTop = contentArea.top + (contentArea.height - targetHeight) / 2
  }

  currentLeft.value = targetLeft
  currentTop.value = targetTop
  currentWidth.value = targetWidth
  currentHeight.value = targetHeight
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
  }
  else {
    style.backgroundColor = 'transparent'
  }

  // 添加穿透样式
  if (props.penetrate && !props.mask) {
    style.pointerEvents = 'none'
  }

  return style
})

function clearPosition() {
  try {
    localStorage.removeItem(getStorageKey())
    // 重置为默认居中位置
    nextTick(() => {
      initPosition()
    })
  }
  catch (error) {
    console.warn('Failed to clear modal position from localStorage:', error)
  }
}
defineExpose({
  clearPosition,
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
  max-height: 100vh; /* 限制最大高度为视窗高度 */
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
  flex: 1 1 auto; /* 允许内容区域自动填充剩余空间 */
  min-height: 0; /* 防止 flex 子项溢出 */
  overflow: hidden; /* 防止内容溢出 */
}

/* 内容包装器，支持滚动 */
.modal-body-content {
  height: 100%;
  overflow-y: auto; /* 垂直滚动始终启用 */
  overflow-x: auto; /* 水平滚动按需显示 */
  padding: 24px;
  box-sizing: border-box;
}

/* 添加滚动条样式优化 */
/* 优化滚动条样式 - 同时支持水平和垂直 */
.modal-body-content::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.modal-body-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.modal-body-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;

  &:hover {
    background: #a8a8a8;
  }
}

/* 针对 Firefox 的滚动条样式 */
.modal-body-content {
  scrollbar-width: auto; /* 从 thin 改为 auto，支持水平和垂直滚动 */
  scrollbar-color: #c1c1c1 #f1f1f1;
}

/* 底部操作区 */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 10px 16px;
  border-top: 1px solid #f0f0f0;
  background: #fafafa;
  flex-shrink: 0;
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
