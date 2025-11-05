<template>
  <div
    ref="floatingButton"
    class="floating-button"
    :style="{
      'top': `${topRate}%`,
      'left': `${leftRate}%`,
      'transition-duration': transitionDuration,
    }"
    @mousedown.stop="mousedown"
  >
    <slot v-if="$slots.default" />
    <div v-else class="floating-button-content">
      <i class="ai-iconfont icon-robot floating-button-icon" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'FloatingButton',
  props: {
    left: {
      type: Number,
      default: 90,
    },
    top: {
      type: Number,
      default: 80,
    },
  },
  data() {
    return {
      // 左边距百分比
      leftRate: this.left,
      // 顶边距百分比
      topRate: this.top,
      // CSS过渡动画持续时间
      transitionDuration: '0s',
      // 是否正在拖拽中
      isDragging: false,
      // 用于取消事件监听
      abortController: null,
    }
  },
  created() {
    // 初始化位置：从localStorage获取上次保存的位置
    this.initPosition()
  },
  mounted() {
    // 组件挂载后检查并调整位置边界
    this.checkAndAdjustBounds()
  },
  beforeUnmount() {
    // 清理所有事件监听
    document.removeEventListener('mousemove', this.handleMouseMove)
    document.removeEventListener('mouseup', this.handleMouseUp)

    // 取消未完成的异步操作
    if (this.abortController) {
      this.abortController.abort()
    }
  },
  methods: {
    /**
     * 处理点击事件
     */
    handleClick() {
      this.$emit('button-click')
    },

    /**
     * 初始化位置：从localStorage获取或使用默认值
     */
    initPosition() {
      const savedPosition = localStorage.getItem('gptIconPosition')
      if (savedPosition) {
        const position = JSON.parse(savedPosition)
        this.leftRate = position.x
        this.topRate = position.y
      }
      else {
        this.leftRate = this.left
        this.topRate = this.top
      }
    },

    /**
     * 获取元素的尺寸信息
     * @returns {DOMRect} 元素的边界矩形
     */
    getRect() {
      // 添加安全判断
      if (!this.$refs.floatingButton)
        return null
      return this.$refs.floatingButton.getBoundingClientRect()
    },

    /**
     * 检查并调整元素位置边界
     */
    checkAndAdjustBounds() {
      const rect = this.getRect()
      if (!rect)
        return // 添加空值判断

      const { width, height, left, top } = rect
      let needUpdate = false

      // 检查左边界
      if (left < 0) {
        this.leftRate = 0
        needUpdate = true
      }

      // 检查右边界
      if (document.body.offsetWidth - left < width) {
        this.leftRate = ((document.body.offsetWidth - width) / document.body.offsetWidth) * 100
        needUpdate = true
      }

      // 检查上边界
      if (top < 0) {
        this.topRate = 0
        needUpdate = true
      }

      // 检查下边界
      if (window.innerHeight - top < height) {
        this.topRate = ((window.innerHeight - height) / window.innerHeight) * 100
        needUpdate = true
      }

      // 如果位置有调整，保存到localStorage
      if (needUpdate) {
        this.savePosition()
      }
    },

    /**
     * 保存当前位置到localStorage
     */
    savePosition() {
      localStorage.setItem(
        'gptIconPosition',
        JSON.stringify({
          x: this.leftRate,
          y: this.topRate,
        }),
      )
    },

    /**
     * 处理拖拽边界限制
     * @param {number} leftPx - 当前左边距像素值
     * @param {number} topPx - 当前顶边距像素值
     * @param {number} width - 元素宽度
     * @param {number} height - 元素高度
     */
    handleDragBounds(leftPx, topPx, width, height) {
      if (!this.$refs.floatingButton)
        return // 添加空值判断
      // 限制左边界
      if (leftPx < 0) {
        this.leftRate = 0
      }
      // 限制右边界
      else if (document.body.offsetWidth - leftPx < width) {
        this.leftRate = ((document.body.offsetWidth - width) / document.body.offsetWidth) * 100
      }

      // 限制上边界
      if (topPx < 0) {
        this.topRate = 0
      }
      // 限制下边界
      else if (window.innerHeight - topPx < height) {
        this.topRate = ((window.innerHeight - height) / window.innerHeight) * 100
      }
    },

    /**
     * 鼠标按下事件处理
     * @param {MouseEvent} e - 鼠标事件对象
     */
    mousedown(e) {
      // 创建新的 AbortController
      this.abortController = new AbortController()
      const signal = this.abortController.signal

      // 配置常量
      const CLICK_TIME_THRESHOLD = 300 // 点击时间阈值（毫秒）
      const MOVE_DISTANCE_THRESHOLD = 10 // 移动距离阈值（像素）
      const TRANSITION_DURATION = 200 // 过渡动画时长（毫秒）

      // 获取初始状态
      const { width, height } = this.getRect()
      const startTime = Date.now()
      const startMouseX = e.clientX
      const startMouseY = e.clientY
      const startElementX = this.getRect().left
      const startElementY = this.getRect().top

      // 状态变量
      let currentMouseX = startMouseX
      let currentMouseY = startMouseY
      let currentElementX = startElementX
      let currentElementY = startElementY
      let hasMoved = false
      let isDragEnabled = false

      /**
       * 鼠标移动事件处理
       * @param {MouseEvent} moveEvent - 鼠标移动事件
       */
      const handleMouseMove = (moveEvent) => {
        currentMouseX = moveEvent.clientX
        currentMouseY = moveEvent.clientY

        // 计算移动距离
        const deltaX = Math.abs(currentMouseX - startMouseX)
        const deltaY = Math.abs(currentMouseY - startMouseY)

        // 如果移动距离超过阈值，启用拖拽模式
        if (deltaX > MOVE_DISTANCE_THRESHOLD || deltaY > MOVE_DISTANCE_THRESHOLD) {
          hasMoved = true
          isDragEnabled = true
        }

        // 只有在启用拖拽模式后才实际移动元素
        if (isDragEnabled) {
          // 禁用指针事件，防止干扰拖拽
          this.$refs.floatingButton.style.pointerEvents = 'none'
          this.isDragging = true

          // 通知父组件开始拖拽
          this.$emit('drag-start')

          // 计算新位置
          currentElementX = startElementX + (currentMouseX - startMouseX)
          currentElementY = startElementY + (currentMouseY - startMouseY)

          // 更新位置百分比
          this.leftRate = (currentElementX / document.body.offsetWidth) * 100
          this.topRate = (currentElementY / window.innerHeight) * 100
        }
      }

      /**
       * 鼠标释放事件处理
       */
      const handleMouseUp = () => {
        // 恢复指针事件
        this.$refs.floatingButton.style.pointerEvents = null

        // 计算操作持续时间
        const operationDuration = Date.now() - startTime

        // 清理事件监听器
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)

        // 如果启用了拖拽，处理边界限制和位置保存
        if (isDragEnabled) {
          this.transitionDuration = `${TRANSITION_DURATION}ms`

          // 处理边界限制
          this.handleDragBounds(currentElementX, currentElementY, width, height)

          // 保存位置
          this.savePosition()
        }

        // 判断是否为点击操作（时间短且未移动）
        if (operationDuration < CLICK_TIME_THRESHOLD && !hasMoved) {
          this.handleClick()
        }

        // 通知父组件拖拽结束
        this.$emit('drag-end')

        // 重置状态
        const timeoutId = setTimeout(() => {
          if (!signal.aborted) {
            this.transitionDuration = '0s'
            this.isDragging = false
          }
        }, 30)

        // 监听取消信号
        signal.addEventListener('abort', () => {
          clearTimeout(timeoutId)
        })
      }

      // 修改事件监听器添加方式
      document.addEventListener('mousemove', handleMouseMove, { signal })
      document.addEventListener('mouseup', handleMouseUp, { signal })

      // 阻止默认行为
      e.preventDefault()
    },
  },
}
</script>

<style lang="scss" scoped>
.floating-button {
  position: fixed;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: #fff;
  border: 1px solid #ddd;
  padding: 4px;
  overflow: hidden;
  z-index: 2025;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);

  // 悬停效果
  &:hover {
    opacity: 0.95;
    transform: scale(1.1);
    box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.25);
  }

  .floating-button-content {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #3b82f6;
  }

  .floating-button-icon {
    font-size: 22px;
    color: #fff;
  }
}
</style>
