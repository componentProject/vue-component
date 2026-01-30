<!-- DragModalDialog组件主文件 -->
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
        <div class="w-full h-full relative">
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
              <div
                class="modal-body-content"
                :style="(props.contentStyle ? (typeof props.contentStyle === 'function' ? props.contentStyle() : props.contentStyle) : undefined) as any"
              >
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
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { PositionData, ResizeDirection, ResizeState } from '@moluoxixi/utils/_utils'
import type { emitsType, propsType } from './types'
import { Buttons } from '@moluoxixi/components/_utilComponents'
import {
  calculateContentArea,
  calculateDragPosition,
  calculateResizePosition,
  clearPositionFromStorage,
  getCursorByDirection,
  loadPositionFromStorage,
  parsePositionValue,
  savePositionToStorage,
} from '@moluoxixi/utils/_utils'
import { computed, nextTick, onUnmounted, ref, useTemplateRef, watch } from 'vue'

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
  margin: 0,
  rememberPosition: false,
  positionKey: '',
  penetrate: false,
  teleportTo: 'body',
  destroyOnClose: false,
  contentStyle: undefined,
})

const emit = defineEmits<emitsType>()

const renderModal = ref(false)

/**
 * 监听 visible 变化，控制渲染
 */
watch(() => props.visible, (newVal: any) => {
  if (newVal) {
    renderModal.value = true
  }
  else if (!props.destroyOnClose) {
    // 如果不是 destroyOnClose 模式，保持渲染
    renderModal.value = true
  }
}, { immediate: true })

/**
 * 处理动画完成后的销毁
 */
function handleAfterLeave() {
  if (props.destroyOnClose) {
    renderModal.value = false
  }
  emit('closed')
}

// 状态管理
const modalRef = useTemplateRef<HTMLElement>('modalRef')
const isDragging = ref(false)
const isResizing = ref(false)
const dragStartPos = ref({ x: 0, y: 0, left: 0, top: 0 })
const resizeState = ref<ResizeState>({
  direction: 'se',
  startX: 0,
  startY: 0,
  startWidth: 0,
  startHeight: 0,
  startLeft: 0,
  startTop: 0,
})

// 实际位置状态
const currentTop = ref()
const currentLeft = ref()
const currentBottom = ref()
const currentRight = ref()
const currentWidth = ref(0)
const currentHeight = ref(0)

const interactionEndTime = ref(0)

/**
 * 处理遮罩层点击事件
 * 如果正在拖拽或调整大小，或刚刚结束交互，不关闭弹窗
 */
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

/**
 * 生成存储键名，用于 localStorage
 * @returns 存储键名
 */
function getStorageKey(): string {
  const key = props.positionKey || `modal-position-${props.title || 'default'}`
  return `modal-dialog-${key}`
}

/**
 * 保存位置到 localStorage
 */
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

  savePositionToStorage({
    key: getStorageKey(),
    position: positionData,
  })
}

/**
 * 从 localStorage 读取位置
 * @returns 保存的位置数据，如果不存在则返回 null
 */
function loadPosition(): PositionData | null {
  if (!props.rememberPosition)
    return null

  return loadPositionFromStorage({
    key: getStorageKey(),
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
    minWidth: props.minWidth,
    minHeight: props.minHeight,
  })
}

/**
 * 计算弹窗样式
 */
const modalStyle = computed(() => {
  const style: Record<string, any> = {
    zIndex: props.zIndex,
  }

  const width = currentWidth.value
  const height = currentHeight.value
  const left = currentLeft.value
  const top = currentTop.value
  const right = currentRight.value
  const bottom = currentBottom.value

  style.left = `${left}px`
  style.top = `${top}px`
  style.right = `${right}px`
  style.bottom = `${bottom}px`

  // 设置宽度
  style.width = typeof width === 'number' ? `${width}px` : width || 0

  // 设置高度
  style.height = typeof height === 'number' ? `${height}px` : height || 0
  return style
  // // 设置位置
  // if (top !== undefined && bottom === undefined) {
  //   style.top = typeof top === 'number' ? `${top}px` : top
  // }
  // else if (bottom !== undefined && top === undefined) {
  //   style.bottom = typeof bottom === 'number' ? `${bottom}px` : bottom
  // }
  // else {
  //   style.top = `calc(50% - ${style.height} / 2)`
  // }
  // if (left !== undefined && right === undefined) {
  //   style.left = typeof left === 'number' ? `${left}px` : left
  // }
  // else if (right !== undefined && left === undefined) {
  //   style.right = typeof right === 'number' ? `${right}px` : right
  // }
  // else {
  //   style.right = `calc(50% - ${style.width} / 2)`
  // }
  // return style
})

/**
 * 处理关闭事件
 */
function handleClose() {
  emit('update:visible', false)
  emit('close')
}

/**
 * 处理取消事件
 */
function handleCancel() {
  emit('cancel')
  handleClose()
}

/**
 * 处理确认事件
 */
function handleConfirm() {
  emit('confirm')
}

/**
 * 开始拖拽
 * @param e - 鼠标事件
 */
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

/**
 * 拖拽过程中处理鼠标移动
 * @param e - 鼠标事件
 */
function onDrag(e: MouseEvent) {
  if (!isDragging.value || !modalRef.value)
    return

  const modalWidth = modalRef.value.offsetWidth
  const modalHeight = modalRef.value.offsetHeight

  const { left: newLeft, top: newTop } = calculateDragPosition({
    dragStartPos: dragStartPos.value,
    currentX: e.clientX,
    currentY: e.clientY,
    constraints: {
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      elementWidth: modalWidth,
      elementHeight: modalHeight,
      margin: props.margin,
    },
  })

  currentLeft.value = newLeft
  currentTop.value = newTop
  currentRight.value = undefined
  currentBottom.value = undefined

  emit('update:top', newTop)
  emit('update:left', newLeft)
}

/**
 * 停止拖拽
 */
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

/**
 * 开始调整大小
 * @param e - 鼠标事件
 * @param direction - 调整方向（nw, ne, sw, se, n, s, w, e）
 */
function startResize(e: MouseEvent, direction: string) {
  if (!props.resizable || !modalRef.value)
    return

  isResizing.value = true
  const rect = modalRef.value.getBoundingClientRect()

  const resizeDirection = direction as ResizeDirection

  resizeState.value = {
    direction: resizeDirection,
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
  document.body.style.cursor = getCursorByDirection(resizeDirection)
  document.body.style.userSelect = 'none'
}

/**
 * 调整大小过程中处理鼠标移动
 * @param e - 鼠标事件
 */
function onResize(e: MouseEvent) {
  if (!isResizing.value || !modalRef.value)
    return

  const { left: newLeft, top: newTop, width: newWidth, height: newHeight } = calculateResizePosition({
    resizeState: resizeState.value,
    currentX: e.clientX,
    currentY: e.clientY,
    constraints: {
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      elementWidth: modalRef.value.offsetWidth,
      elementHeight: modalRef.value.offsetHeight,
      margin: props.margin,
      minWidth: props.minWidth,
      minHeight: props.minHeight,
      maxWidth: undefined,
      maxHeight: undefined,
    },
  })

  currentWidth.value = newWidth
  currentHeight.value = newHeight
  currentLeft.value = newLeft
  currentTop.value = newTop
}

/**
 * 停止调整大小
 */
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

/**
 * 根据 size 获取对应的宽度
 * @param size - 尺寸类型
 * @returns 对应的宽度值
 */
function getSizeWidth(size: 'small' | 'medium' | 'large'): number {
  const sizeMap = {
    small: 400,
    medium: 520,
    large: 720,
  }
  return sizeMap[size] || 520 // 默认为 medium
}

/**
 * 计算并初始化弹窗位置
 * 优先从 localStorage 加载保存的位置，否则根据配置计算居中位置
 */
function initPosition() {
  if (!modalRef.value)
    return

  // 如果 rememberPosition 为 false，清除之前保存的位置数据
  if (!props.rememberPosition) {
    clearPositionFromStorage(getStorageKey())
  }

  // 尝试从localStorage加载位置
  const savedPosition = loadPosition()

  if (savedPosition) {
    // 使用保存的位置
    currentTop.value = savedPosition.top
    currentLeft.value = savedPosition.left
    currentWidth.value = savedPosition.width
    currentHeight.value = savedPosition.height
  }
  else {
    // 计算可用的最大尺寸（内容区域 = 视窗 - 边距）
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight

    // 内容区域边界（考虑边距限制）
    const contentArea = calculateContentArea({
      windowWidth,
      windowHeight,
      margin: props.margin,
    })

    // 计算宽度：优先使用 width 属性，其次使用 size 属性
    let targetWidth: number
    if (props.width) {
      targetWidth = typeof props.width === 'number' ? props.width : parsePositionValue(props.width, contentArea.width)
    }
    else if (props.size === 'fullscreen') {
      // fullscreen 时直接使用 100% 宽度（内容区域宽度）
      targetWidth = contentArea.width
    }
    else {
      targetWidth = getSizeWidth(props.size)
    }

    // 计算高度：优先使用 height 属性
    let targetHeight: number
    if (props.height) {
      targetHeight = typeof props.height === 'number' ? props.height : parsePositionValue(props.height, contentArea.height)
    }
    else if (props.size === 'fullscreen') {
      // fullscreen 时直接使用 100% 高度（内容区域高度）
      targetHeight = contentArea.height
    }
    else {
      targetHeight = 200 // 默认高度
    }

    // 确保尺寸在内容区域内（fullscreen 已经等于 contentArea，所以这里主要是限制其他尺寸）
    targetWidth = Math.max(props.minWidth, Math.min(targetWidth, contentArea.width))
    targetHeight = Math.max(props.minHeight, Math.min(targetHeight, contentArea.height))

    // 计算位置：确保在内容区域内
    let targetLeft: number | undefined
    let targetTop: number | undefined
    let targetRight: number | undefined
    let targetBottom: number | undefined

    // fullscreen 时直接贴边（考虑 margin）
    if (props.size === 'fullscreen') {
      targetLeft = contentArea.left
      targetTop = contentArea.top
      targetRight = undefined
      targetBottom = undefined
    }
    else {
      const left = props.left
      const right = props.right
      const top = props.top
      const bottom = props.bottom

      // 如果传入了 left，解析并限制在内容区域内
      if (left !== undefined && right === undefined) {
        const requestedLeft = typeof left === 'number' ? left : parsePositionValue(left, windowWidth)
        // 限制在内容区域内：确保不会超出右边界
        targetLeft = Math.max(contentArea.left, Math.min(requestedLeft, contentArea.left + contentArea.width - targetWidth))
      }
      else if (right !== undefined && left === undefined) {
        const requestedRight = typeof right === 'number' ? right : parsePositionValue(right, windowWidth)
        targetRight = Math.max(contentArea.right, Math.min(requestedRight, contentArea.right + contentArea.width - targetWidth))
      }
      else {
        // 默认居中在内容区域内
        targetLeft = contentArea.left + (contentArea.width - targetWidth) / 2
      }

      // 如果传入了 top，解析并限制在内容区域内
      if (top !== undefined && bottom === undefined) {
        const requestedTop = typeof top === 'number' ? top : parsePositionValue(top, windowHeight)
        // 限制在内容区域内：确保不会超出下边界
        targetTop = Math.max(contentArea.top, Math.min(requestedTop, contentArea.top + contentArea.height - targetHeight))
      }
      else if (bottom !== undefined && top === undefined) {
        const requestedBottom = typeof bottom === 'number' ? bottom : parsePositionValue(bottom, windowHeight)
        // 限制在内容区域内：确保不会超出下边界
        targetBottom = Math.max(contentArea.bottom, Math.min(requestedBottom, contentArea.bottom + contentArea.height - targetHeight))
      }
      else {
        // 默认居中在内容区域内
        targetTop = contentArea.top + (contentArea.height - targetHeight) / 2
      }
    }

    currentLeft.value = targetLeft
    currentTop.value = targetTop
    currentRight.value = targetRight
    currentBottom.value = targetBottom
    currentWidth.value = targetWidth
    currentHeight.value = targetHeight
  }
}

/**
 * 监听 rememberPosition 变化，当变为 false 时清除保存的位置数据
 */
watch(() => props.rememberPosition, (newVal: any, oldVal: any) => {
  // 当 rememberPosition 从 true 变为 false 时，清除保存的位置数据
  if (oldVal === true && newVal === false) {
    clearPositionFromStorage(getStorageKey())
  }
})

/**
 * 监听 visible 变化，初始化位置并触发相应事件
 */
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

/**
 * 组件卸载时清理事件监听
 */
onUnmounted(() => {
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('mousemove', onResize)
  document.removeEventListener('mouseup', stopResize)
})

/**
 * 计算遮罩层样式
 */
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

/**
 * 清除保存的位置，重置为默认居中位置
 */
function clearPosition() {
  clearPositionFromStorage(getStorageKey())
  // 重置为默认居中位置
  nextTick(() => {
    initPosition()
  })
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
  position: absolute;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin: 0;
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
