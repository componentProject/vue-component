<template>
  <div class="tips-popover">
    <div class="tips-popover-container">
      <i
        class="ai-iconfont icon-wenhaofill"
        @mouseenter="handleIconMouseEnter"
        @mouseleave="handleIconMouseLeave"
      />
      <!-- 版本号浮窗 -->
      <div
        v-show="showVersionPopover"
        class="tips-popover"
        :class="{ show: showVersionPopover }"
        @mouseenter="handlePopoverMouseEnter"
        @mouseleave="handlePopoverMouseLeave"
      >
        <div class="popover-content">
          <div class="popover-item" @click="handleAboutClick">
            关于
          </div>
          <div class="popover-item" @click="handleGuideClick">
            系统指南
          </div>
          <div class="popover-item" @click="handleNoticeClick">
            用户须知
          </div>
          <div class="popover-item" @click="handleShepherdClick">
            用户引导
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TipsPopover',
  data() {
    return {
      showVersionPopover: false,
      hideTimeout: null,
    }
  },
  beforeUnmount() {
    this.clearHideTimeout()
  },
  methods: {
    // 鼠标进入图标
    handleIconMouseEnter() {
      this.clearHideTimeout()
      this.showVersionPopover = true
    },
    // 鼠标离开图标
    handleIconMouseLeave() {
      this.startHideTimeout()
    },
    // 鼠标进入浮窗
    handlePopoverMouseEnter() {
      this.clearHideTimeout()
    },
    // 鼠标离开浮窗
    handlePopoverMouseLeave() {
      this.startHideTimeout()
    },
    // 开始隐藏定时器
    startHideTimeout() {
      this.hideTimeout = setTimeout(() => {
        this.showVersionPopover = false
      }, 300)
    },
    // 清除隐藏定时器
    clearHideTimeout() {
      if (this.hideTimeout) {
        clearTimeout(this.hideTimeout)
        this.hideTimeout = null
      }
    },
    // 关于点击
    handleAboutClick() {
      this.$emit('about-click')
      this.showVersionPopover = false
    },
    // 系统指南点击
    handleGuideClick() {
      window.open('https://www.baidu.com', '_blank')
      this.showVersionPopover = false
    },
    // 用户须知点击
    handleNoticeClick() {
      this.$emit('notice-click')
      this.showVersionPopover = false
    },
    // 用户引导点击
    handleShepherdClick() {
      this.$emit('shepherd-click')
    },
  },
}
</script>

<style lang="scss" scoped>
.tips-popover-container {
  position: relative;
  display: inline-block;
  margin-right: 16px;

  .icon-wenhaofill {
    cursor: pointer;
    font-size: 18px;
    color: #999;
    transition: all 0.2s ease;

    &:hover {
      color: #3a77ff;
      transform: scale(1.1);
    }
  }

  .tips-popover {
    position: absolute;
    top: 24px;
    right: 0;
    z-index: 1000;
    opacity: 0;
    transform: translateY(-10px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: auto;

    // 允许鼠标交互

    &.show {
      opacity: 1;
      transform: translateY(0);
    }

    .popover-content {
      background: #ffffff;
      border: 1px solid #e4e7ed;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      padding: 8px 0;
      min-width: 120px;

      .popover-item {
        padding: 8px 16px;
        font-size: 14px;
        color: #333;
        cursor: pointer;
        transition: all 0.2s ease;
        line-height: 1.4;

        &:hover {
          background: #f5f7fa;
          color: #3a77ff;
        }

        &:active {
          background: #e6f7ff;
        }

        &:first-child {
          border-radius: 8px 8px 0 0;
        }

        &:last-child {
          border-radius: 0 0 8px 8px;
        }
      }
    }
  }
}
</style>
