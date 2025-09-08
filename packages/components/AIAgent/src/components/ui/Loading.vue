<template>
  <div v-if="visible" class="loading-mask" :style="{ backgroundColor: background }">
    <div class="loading-wrapper">
      <div class="loading-spinner">
        <svg class="circular" viewBox="0 0 50 50">
          <circle
            class="path"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="#409eff"
            stroke-width="3"
            stroke-linecap="round"
            stroke-dasharray="90, 150"
            stroke-dashoffset="0"
          />
        </svg>
      </div>
      <div v-if="text" class="loading-text">
        {{ text }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Loading',
  props: {
    // 是否显示loading
    visible: {
      type: Boolean,
      default: false,
    },
    // 加载文本
    text: {
      type: String,
      default: '生成中...',
    },
    // 背景颜色透明度
    background: {
      type: String,
      default: 'rgba(255, 255, 255, 0.9)',
    },
  },
}
</script>

<style scoped>
.loading-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  position: relative;
}

.circular {
  width: 100%;
  height: 100%;
  animation: rotate 2s linear infinite;
}

.path {
  animation: dash 1.5s ease-in-out infinite;
}

.loading-text {
  margin-top: 16px;
  font-size: 14px;
  color: #333;
  text-align: center;
  line-height: 1.4;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .loading-spinner {
    width: 40px;
    height: 40px;
  }

  .loading-text {
    font-size: 12px;
    margin-top: 12px;
  }
}
</style>
