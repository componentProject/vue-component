<template>
  <transition name="fade">
    <div v-if="visible" class="toast" :class="[`toast-${type}`]" :style="{ top: position }">
      <span class="icon" v-html="typeIcon" />
      <span class="message">{{ message }}</span>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      message: '',
      type: 'info',
      position: '60px',
      duration: 3000,
    }
  },
  computed: {
    typeIcon() {
      const icons = {
        success: `<i class="ai-iconfont icon-check"></i>`,
        error: `<i class="ai-iconfont icon-times-circle"></i>`,
        warning: `<i class="ai-iconfont icon-exclamation-circle"></i>`,
        info: `<i class="ai-iconfont icon-info-circle"></i>`,
      }
      return icons[this.type]
    },
  },
  methods: {
    show(message, options = {}) {
      // 合并配置选项
      Object.assign(this, {
        message,
        visible: true,
        ...options,
      })

      // 自动关闭
      setTimeout(() => {
        this.visible = false
      }, this.duration)
    },
  },
}
</script>

<style>
.toast {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 16px;
  border-radius: 4px;
  color: white;
  display: flex;
  align-items: center;
  box-shadow:
    0px 16px 48px 16px rgba(0, 0, 0, 0.08),
    0px 12px 32px rgba(0, 0, 0, 0.12),
    0px 8px 16px -8px rgba(0, 0, 0, 0.16);
  z-index: 9999;
  background-color: #fff;
}

.toast + .toast {
  margin-top: 20px;
}

.icon {
  margin-right: 12px;
  font-size: 18px;
}

.toast-success {
  color: #67c23a;
}

.toast-error {
  color: #f56c6c;
}

.toast-warning {
  color: #e6a23c;
}

.toast-info {
  color: #909399;
  border: 1px solid #909399;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}
</style>
