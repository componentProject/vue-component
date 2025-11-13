<!-- AIAgent的FloatingPanel组件 -->
<template>
  <div
    v-show="visible"
    id="trasen-ai-agent-floating-panel"
    class="floating-panel"
    :class="{ 'drag-panel-disabled': !drag }"
    :style="{
      width: `${containerWidth}px`,
      height: `${containerHeight}px`,
      top: `${containerTop}px`,
      left: `${containerLeft}px`,
    }"
  >
    <template v-if="drag">
      <!-- 左边调整句柄 -->
      <div class="resize-handle resize-handle-left" @mousedown="handleMouseDown($event, 'left')" />
      <!-- 右边调整句柄 -->
      <div
        class="resize-handle resize-handle-right"
        @mousedown="handleMouseDown($event, 'right')"
      />
      <!-- 上边调整句柄 -->
      <div class="resize-handle resize-handle-top" @mousedown="handleMouseDown($event, 'top')" />
      <!-- 下边调整句柄 -->
      <div
        class="resize-handle resize-handle-bottom"
        @mousedown="handleMouseDown($event, 'bottom')"
      />
      <!-- 四个角的调整句柄 -->
      <div
        class="resize-handle resize-handle-corner resize-handle-top-left"
        @mousedown="handleMouseDown($event, 'top-left')"
      />
      <div
        class="resize-handle resize-handle-corner resize-handle-top-right"
        @mousedown="handleMouseDown($event, 'top-right')"
      />
      <div
        class="resize-handle resize-handle-corner resize-handle-bottom-left"
        @mousedown="handleMouseDown($event, 'bottom-left')"
      />
      <div
        class="resize-handle resize-handle-corner resize-handle-bottom-right"
        @mousedown="handleMouseDown($event, 'bottom-right')"
      />
    </template>
    <slot />
    <div class="floating-panel-header" @mousedown="handleHeaderMouseDown($event)">
      <slot v-if="$slots.header" name="header" />
      <template v-else>
        <div class="floating-panel-header-title">
          标题
        </div>
        <div v-if="drag" class="floating-panel-header-close" @click="handleClose" @mousedown.stop>
          <i class="ai-iconfont icon-times" />
        </div>
      </template>
    </div>
    <div class="floating-panel-content">
      <slot name="content" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'FloatingPanel',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '标题',
    },
    width: {
      type: Number,
      default: 600,
    },
    height: {
      type: Number,
      default: window.innerHeight - 120,
    },
    top: {
      type: Number,
      default: 100,
    },
    left: {
      type: Number,
      default: window.innerWidth - 620,
    },
    minWidth: {
      type: Number,
      default: 500,
    },
    minHeight: {
      type: Number,
      default: 480,
    },
    drag: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      resizing: false, // 是否正在调整大小
      resizeDirection: '', // 调整方向
      dragging: false, // 是否正在拖拽
      containerWidth: this.width, // 容器宽度
      containerHeight: this.height, // 容器高度
      containerTop: this.top, // 容器顶部边距
      containerLeft: this.left, // 容器左侧边距
      initialMouseX: 0, // 初始鼠标X坐标
      initialMouseY: 0, // 初始鼠标Y坐标
      initialWidth: 0, // 初始宽度
      initialHeight: 0, // 初始高度
      initialTop: 0,
      initialLeft: 0,
    }
  },
  created() {
    // 从localStorage中获取宽度、高度和位置
    const storedWidth = localStorage.getItem('agentContainerWidth')
    const storedHeight = localStorage.getItem('agentContainerHeight')
    const storedTop = localStorage.getItem('agentContainerTop')
    const storedLeft = localStorage.getItem('agentContainerLeft')

    if (storedWidth) {
      this.containerWidth = Number(storedWidth)
    }
    if (storedHeight) {
      this.containerHeight = Number(storedHeight)
    }
    if (storedTop) {
      this.containerTop = Number(storedTop)
    }
    if (storedLeft) {
      this.containerLeft = Number(storedLeft)
    }
  },
  mounted() {
    document.addEventListener('mousemove', this.handleMouseMove)
    document.addEventListener('mouseup', this.handleMouseUp)
    window.addEventListener('resize', this.handleWindowResize)
  },
  beforeUnmount() {
    document.removeEventListener('mousemove', this.handleMouseMove)
    document.removeEventListener('mouseup', this.handleMouseUp)
    window.removeEventListener('resize', this.handleWindowResize)
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },
    handleHeaderMouseDown(e) {
      this.panelMove(e)
    },
    panelMove(e) {
      this.dragging = true
      this.initialMouseX = e.pageX
      this.initialMouseY = e.pageY
      this.initialTop = this.containerTop
      this.initialLeft = this.containerLeft

      // 通知父组件开始拖拽
      this.$emit('drag-start')

      e.preventDefault()
    },
    handleMouseDown(e, direction) {
      this.resizing = true
      this.resizeDirection = direction
      this.initialMouseX = e.pageX
      this.initialMouseY = e.pageY
      this.initialWidth = this.containerWidth
      this.initialHeight = this.containerHeight
      this.initialTop = this.containerTop
      this.initialLeft = this.containerLeft

      // 通知父组件开始调整大小
      this.$emit('resize-start')

      e.preventDefault()
    },
    handleMouseMove(e) {
      if (this.resizing) {
        this.handleResize(e)
      }
      else if (this.dragging) {
        this.handleDrag(e)
      }
    },
    handleResize(e) {
      // 限制鼠标位置在屏幕范围内
      const mouseX = Math.max(0, Math.min(window.innerWidth, e.pageX))
      const mouseY = Math.max(0, Math.min(window.innerHeight, e.pageY))

      const deltaX = mouseX - this.initialMouseX
      const deltaY = mouseY - this.initialMouseY

      let newWidth = this.initialWidth
      let newHeight = this.initialHeight
      let newTop = this.initialTop
      let newLeft = this.initialLeft

      // 根据调整方向计算新的宽度、高度和位置
      switch (this.resizeDirection) {
        case 'left':
          newWidth = this.initialWidth - deltaX
          newLeft = this.initialLeft + deltaX
          break
        case 'right':
          newWidth = this.initialWidth + deltaX
          break
        case 'top':
          newHeight = this.initialHeight - deltaY
          newTop = this.initialTop + deltaY
          break
        case 'bottom':
          newHeight = this.initialHeight + deltaY
          break
        case 'top-left':
          newWidth = this.initialWidth - deltaX
          newHeight = this.initialHeight - deltaY
          newLeft = this.initialLeft + deltaX
          newTop = this.initialTop + deltaY
          break
        case 'top-right':
          newWidth = this.initialWidth + deltaX
          newHeight = this.initialHeight - deltaY
          newTop = this.initialTop + deltaY
          break
        case 'bottom-left':
          newWidth = this.initialWidth - deltaX
          newHeight = this.initialHeight + deltaY
          newLeft = this.initialLeft + deltaX
          break
        case 'bottom-right':
          newWidth = this.initialWidth + deltaX
          newHeight = this.initialHeight + deltaY
          break
      }

      // 限制最小和最大尺寸
      const minWidth = this.minWidth
      const minHeight = this.minHeight
      const maxWidth = window.innerWidth - 20 // 留出边距
      const maxHeight = window.innerHeight - 20 // 留出边距

      // 应用尺寸限制
      newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth))
      newHeight = Math.max(minHeight, Math.min(maxHeight, newHeight))

      // 根据新尺寸调整位置，确保元素完全在屏幕内
      if (this.resizeDirection.includes('left')) {
        // 左边调整时，确保左边界不超出屏幕
        const maxLeft = this.initialLeft + this.initialWidth - minWidth
        const minLeft = 10
        newLeft = Math.max(minLeft, Math.min(maxLeft, newLeft))

        // 根据实际left位置重新计算宽度
        newWidth = this.initialLeft + this.initialWidth - newLeft
      }

      if (this.resizeDirection.includes('top')) {
        // 上边调整时，确保上边界不超出屏幕
        const maxTop = this.initialTop + this.initialHeight - minHeight
        const minTop = 10
        newTop = Math.max(minTop, Math.min(maxTop, newTop))

        // 根据实际top位置重新计算高度
        newHeight = this.initialTop + this.initialHeight - newTop
      }

      // 确保右边和下边不超出屏幕
      if (newLeft + newWidth > window.innerWidth - 10) {
        if (this.resizeDirection.includes('left')) {
          newLeft = window.innerWidth - newWidth - 10
        }
        else {
          newWidth = window.innerWidth - newLeft - 10
        }
      }

      if (newTop + newHeight > window.innerHeight - 10) {
        if (this.resizeDirection.includes('top')) {
          newTop = window.innerHeight - newHeight - 10
        }
        else {
          newHeight = window.innerHeight - newTop - 10
        }
      }

      // 最终边界检查
      newTop = Math.max(10, newTop)
      newLeft = Math.max(10, newLeft)

      this.containerWidth = newWidth
      this.containerHeight = newHeight
      this.containerTop = newTop
      this.containerLeft = newLeft
    },
    handleDrag(e) {
      // 限制鼠标位置在屏幕范围内
      const mouseX = Math.max(0, Math.min(window.innerWidth, e.pageX))
      const mouseY = Math.max(0, Math.min(window.innerHeight, e.pageY))

      const deltaX = mouseX - this.initialMouseX
      const deltaY = mouseY - this.initialMouseY

      let newTop = this.initialTop + deltaY
      let newLeft = this.initialLeft + deltaX

      // 限制位置边界，确保窗口不会移出屏幕
      newTop = Math.max(10, newTop)
      newLeft = Math.max(10, newLeft)

      // 确保窗口不会超出屏幕右边和底部
      if (newLeft + this.containerWidth > window.innerWidth - 10) {
        newLeft = window.innerWidth - this.containerWidth - 10
      }
      if (newTop + this.containerHeight > window.innerHeight - 10) {
        newTop = window.innerHeight - this.containerHeight - 10
      }

      this.containerTop = newTop
      this.containerLeft = newLeft
    },
    handleMouseUp() {
      const wasResizing = this.resizing
      const wasDragging = this.dragging

      this.resizing = false
      this.dragging = false
      this.resizeDirection = ''

      // 通知父组件操作结束
      if (wasResizing) {
        this.$emit('resize-end')
      }
      else if (wasDragging) {
        this.$emit('drag-end')
      }

      // 将宽度、高度和位置存储到localStorage
      localStorage.setItem('agentContainerWidth', this.containerWidth)
      localStorage.setItem('agentContainerHeight', this.containerHeight)
      localStorage.setItem('agentContainerTop', this.containerTop)
      localStorage.setItem('agentContainerLeft', this.containerLeft)
    },

    // 新增：处理窗口大小改变
    handleWindowResize() {
      // 获取新的窗口尺寸
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight

      let newWidth = this.containerWidth
      let newHeight = this.containerHeight
      let newTop = this.containerTop
      let newLeft = this.containerLeft

      // 调整面板尺寸，确保不超出新的窗口大小
      const maxWidth = windowWidth - 20
      const maxHeight = windowHeight - 20

      if (newWidth > maxWidth) {
        newWidth = maxWidth
      }
      if (newHeight > maxHeight) {
        newHeight = maxHeight
      }

      // 调整面板位置，确保完全在屏幕内
      if (newLeft + newWidth > windowWidth - 10) {
        newLeft = windowWidth - newWidth - 10
      }
      if (newTop + newHeight > windowHeight - 10) {
        newTop = windowHeight - newHeight - 10
      }

      // 确保最小边距
      newLeft = Math.max(10, newLeft)
      newTop = Math.max(10, newTop)

      // 只有发生变化时才更新
      if (
        newWidth !== this.containerWidth
        || newHeight !== this.containerHeight
        || newTop !== this.containerTop
        || newLeft !== this.containerLeft
      ) {
        this.containerWidth = newWidth
        this.containerHeight = newHeight
        this.containerTop = newTop
        this.containerLeft = newLeft

        // 更新存储的位置信息
        localStorage.setItem('agentContainerWidth', this.containerWidth)
        localStorage.setItem('agentContainerHeight', this.containerHeight)
        localStorage.setItem('agentContainerTop', this.containerTop)
        localStorage.setItem('agentContainerLeft', this.containerLeft)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.floating-panel {
  position: fixed;
  z-index: 202508;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #fff;
  border-radius: 12px;
  box-shadow:
    0 6px 16px rgba(0, 0, 0, 0.12),
    0 3px 6px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(206, 211, 219, 0.8);

  :deep(.floating-panel-header) {
    display: flex;
    align-items: center;
    color: #29354f;
    padding: 6px 12px;
    border-bottom: 1px solid #e3e6e9;
    background-color: #f9fafc;
    user-select: none;
    cursor: move;

    .floating-panel-header-title {
      font-size: 18px;
      flex: 1;
      .back-btn {
        width: 36px;
        height: 36px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        color: #333;
        cursor: pointer;
        border-radius: 8px;
        transition: all 0.2s ease;
        &:hover {
          color: #3a77ff;
          background-color: rgba(58, 119, 255, 0.08);
        }
      }
    }

    .floating-panel-header-search {
      flex: 1;
      max-width: 200px;
      margin-right: 20px;
      input {
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
        outline: none;
        transition: border-color 0.2s ease;
        width: 100%;
        &:focus {
          border-color: #3a77ff;
        }

        &::placeholder {
          color: #999;
        }
      }
    }

    .floating-panel-header-close {
      font-size: 22px;
      color: #404040;
      cursor: pointer;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all 0.2s ease;

      &:hover {
        color: #3a77ff;
        background-color: #3a77ff1a;
      }
    }
  }

  .floating-panel-content {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  /* 调整句柄样式 */
  .resize-handle {
    position: absolute;
    transition: background-color 0.2s ease;
    z-index: 20250709;

    &:hover {
      background-color: rgba(58, 119, 255, 0.2);
    }
  }
  .resize-handle-left,
  .resize-handle-right {
    top: 0;
    bottom: 0;
    width: 6px;
    cursor: ew-resize;
  }
  .resize-handle-left {
    left: -3px;
  }
  .resize-handle-right {
    right: -3px;
  }

  .resize-handle-top,
  .resize-handle-bottom {
    left: 0;
    right: 0;
    height: 6px;
    cursor: ns-resize;
  }
  .resize-handle-top {
    top: -3px;
  }

  .resize-handle-bottom {
    bottom: -3px;
  }

  /* 角落调整句柄 */
  .resize-handle-corner {
    width: 15px;
    height: 15px;
  }

  .resize-handle-top-left {
    top: -5px;
    left: -5px;
    cursor: nw-resize;
  }

  .resize-handle-top-right {
    top: -5px;
    right: -5px;
    cursor: ne-resize;
  }

  .resize-handle-bottom-left {
    bottom: -5px;
    left: -5px;
    cursor: sw-resize;
  }

  .resize-handle-bottom-right {
    bottom: -5px;
    right: -5px;
    cursor: se-resize;
  }
}
.drag-panel-disabled {
  position: static !important;
  display: flex !important;
  width: 100% !important;
  height: 100% !important;
  box-shadow: unset !important;
  border: unset !important;
}
</style>
