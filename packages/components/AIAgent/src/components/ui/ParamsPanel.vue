<!-- AIAgent的ParamsPanel组件 -->
<template>
  <div
    v-if="visible"
    class="params-panel"
    :style="{ maxHeight: showSubmit ? '190px' : '130px', marginBottom: showSubmit ? '0' : '16px' }"
  >
    <div id="tsAiAgent-params-panel" class="params-panel-content">
      <div
        v-for="param in params.filter(item => item.paramType == 2)"
        :key="param.id"
        class="params-panel-content-item"
      >
        <div class="params-panel-content-item-title">
          {{ param.paramExplain || param.paramName }}
          <span v-if="param.isRequired == 1" class="required-icon">*</span>
        </div>
        <div class="params-panel-content-item-input">
          <input v-model="param.paramValue" type="text">
        </div>
      </div>
    </div>
    <div v-if="showSubmit" class="params-panel-actions">
      <button class="submit-btn" @click="handleSubmit">
        发送
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ParamsPanel',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    params: {
      type: Array,
      default: () => [],
    },
    showSubmit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {}
  },
  methods: {
    handleSubmit() {
      this.$emit('submit', this.params)
    },
  },
}
</script>

<style lang="scss" scoped>
.params-panel {
  max-height: 130px;
  margin: 16px 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .params-panel-content {
    flex: 1;
    overflow-y: auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    &-item {
      &-title {
        font-size: 14px;
        color: #333;
        margin-bottom: 4px;
        .required-icon {
          color: #ff4d4f;
        }
      }
      &-input {
        input {
          width: 100%;
          height: 32px;
          padding: 0 4px;
          outline: none;
          border: 1px solid #e6e8eb;
          border-radius: 4px;
          &:focus-within {
            border-color: #3a77ff;
            box-shadow: 0 4px 16px rgba(58, 119, 255, 0.1);
          }
        }
      }
    }
  }
  .params-panel-actions {
    margin-top: 16px;
    display: flex;
    justify-content: center;
    button {
      height: 40px;
      width: 200px;
      border-radius: 12px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
      border: 1px solid transparent;

      &.submit-btn {
        background: #3a77ff;
        color: #fff;

        &:hover {
          background: #2c5dd0;
        }
      }
    }
  }
}
</style>
