<template>
  <div v-if="visible" class="about-me-overlay">
    <div class="about-me">
      <div class="about-me-header">
        <div class="about-me-header-title">
          关于
        </div>
        <div class="about-me-close" @click="handleClose">
          <i class="ai-iconfont icon-times" />
        </div>
      </div>
      <div v-if="type == 'agent'" class="about-me-content">
        <div class="about-me-content-item">
          <div class="about-me-content-item-title">
            智能体名称
          </div>
          <div class="about-me-content-item-value">
            {{ data.agentInfo.agentName }}
          </div>
        </div>
        <div class="about-me-content-item">
          <div class="about-me-content-item-title">
            智能体版本
          </div>
          <div class="about-me-content-item-value">
            {{ data.agentInfo.versionNumber }}
          </div>
        </div>
      </div>
      <div v-if="type == 'list'" class="about-me-content">
        <div class="about-me-content-item">
          <div class="about-me-content-item-title">
            星助手版本
          </div>
          <div class="about-me-content-item-value">
            v2.1.0
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutMe',
  data() {
    return {
      visible: false,
      data: {},
      type: 'agent',
    }
  },
  methods: {
    show(data, type) {
      this.data = data
      this.type = type
      this.visible = true
    },
    handleClose() {
      this.visible = false
    },
  },
}
</script>

<style lang="scss" scoped>
.about-me {
  width: 400px;
  max-height: calc(100% - 100px);
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;

  .about-me-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    border-bottom: 1px solid #e6e8eb;
    background: #fafbfc;

    &-title {
      font-size: 16px;
      color: #333;
    }

    .about-me-close {
      cursor: pointer;
      color: #666;
      font-size: 16px;
      width: 30px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 50%;
      transition: all 0.2s ease;

      &:hover {
        background: #e6e8eb;
        color: #333;
      }
    }
  }

  .about-me-content {
    padding: 16px 24px;
    font-size: 14px;
    .about-me-content-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .about-me-content-item-title {
      color: #333;
    }
    .about-me-content-item-value {
      color: #333;
    }
    .about-me-content-item-value {
      color: #333;
    }
  }
}
.about-me-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
</style>
