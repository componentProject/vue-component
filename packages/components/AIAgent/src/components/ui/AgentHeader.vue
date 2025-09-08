<template>
  <div class="chat-agent-header">
    <div v-if="showBack" class="back-btn" @click="back">
      <i class="ai-iconfont icon-arrow-left" />
    </div>
    <div class="agent-icon">
      <i v-if="!agent.logo" class="ai-iconfont icon-robot" />
      <img v-else :src="agent.logo" alt="图标">
    </div>
    <div class="agent-info">
      <div class="agent-name">
        {{ agent.appName }}
        <i v-if="isStar == 2" class="ai-iconfont icon-star1" style="color: #ffd100" @click="handleStar" />
        <i v-else class="ai-iconfont icon-star" @click="handleStar" />
      </div>
      <div class="agent-description" :title="agent.description">
        {{ agent.description }}
      </div>
    </div>
    <div v-if="showParams" class="params-btn" @click="handleParams">
      <i class="ai-iconfont icon-office_baozhizhedie_newspaper-folding_linear" />
      <span>补充信息</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AgentHeader',
  props: {
    agent: {
      type: Object,
      default: () => ({}),
    },
    showBack: {
      type: Boolean,
      default: true,
    },
    isStar: {
      type: [Number, String],
      default: 1,
    },
    showParams: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    back() {
      this.$emit('back')
    },
    handleStar() {
      this.$emit('star', this.agent.agentInfo.id, this.isStar == 1 ? 2 : 1)
    },
    handleParams() {
      this.$emit('show-params')
    },
  },
}
</script>

<style lang="scss" scoped>
.chat-agent-header {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eaedf1;
  padding: 12px 16px;
  background-color: #fff;
  .back-btn {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    color: #333;
    cursor: pointer;
    margin-right: 16px;
    border-radius: 8px;
    transition: all 0.2s ease;
    &:hover {
      color: #3a77ff;
      background-color: rgba(58, 119, 255, 0.08);
    }
  }
  .agent-icon {
    width: 48px;
    height: 48px;
    border-radius: 10px;
    overflow: hidden;
    background: #e6f0ff;
    color: #3a77ff;
    display: flex;
    align-items: center;
    justify-content: center;
    i {
      font-size: 24px;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .agent-info {
    height: 100%;
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-left: 12px;
    .agent-name {
      font-size: 16px;
      font-weight: 500;
      color: #1a2233;
      margin-bottom: 4px;
      .icon-star,
      .icon-star1 {
        margin-left: 8px;
        cursor: pointer;
        font-size: 18px;
        transition: all 0.2s ease;
        &:hover {
          transform: scale(1.1);
          color: #ffd100;
        }
      }
    }
    .agent-description {
      font-size: 13px;
      color: #6b7a90;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .params-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    padding: 4px 8px;
    border-radius: 4px;
    color: #333;
    cursor: pointer;
    &:hover {
      color: #333;
      background-color: rgba(0, 0, 0, 0.08);
    }
    i {
      font-size: 16px;
      margin-right: 2px;
    }
  }
}
</style>
