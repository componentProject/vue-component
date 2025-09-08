<template>
  <div id="tsAiAgent-chat-input" class="chat-input">
    <div class="chat-textarea">
      <textarea
        ref="promptTextarea"
        v-model="inputValue"
        class="chat-textarea__inner"
        placeholder="请输入消息..."
        :style="{ maxHeight: `${10 * lineHeight + 18}px` }"
        @keydown="handleKeydown"
        @input="adjustHeight"
      />
    </div>
    <div class="chat-bottom">
      <div class="chat-actions">
        <div v-if="showNewMessage" class="chat-new-message action-item" @click="newMessage">
          <i class="ai-iconfont icon-plus chat-icon" />
          <span>新对话</span>
        </div>
        <slot name="actions" />
      </div>
      <div
        v-if="!stopDisabled"
        id="tsAiAgent-chat-input-send"
        class="chat-button"
        :class="{ 'chat-is-disabled': submitDisabled }"
        @click="sendMessage"
      >
        <i class="ai-iconfont icon-arrowup chat-icon" />
      </div>
      <div v-if="stopDisabled" class="chat-stop-btn" @click="stop">
        <i class="ai-iconfont icon-stopcircle-fill chat-icon" />
        <span>中止</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChatInput',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    stopDisabled: {
      type: Boolean,
      default: false,
    },
    showNewMessage: {
      type: Boolean,
      default: true,
    },
    params: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      inputValue: '',
      lineHeight: 22,
      rows: 1,
    }
  },
  computed: {
    submitDisabled() {
      const requiredParams = this.params.filter(param => param.isRequired == 1)
      const allParamsDone
                = requiredParams.length > 0
                  ? requiredParams.every(param => param.paramValue)
                  : this.params.some(param => param.paramValue)
      let allDone = false
      if (requiredParams.length > 0) {
        allDone = allParamsDone
      }
      else {
        allDone = this.params.some(param => param.paramValue) || !!this.inputValue
      }
      return this.stopDisabled || !allDone
    },
  },
  watch: {
    modelValue: {
      handler(newVal) {
        this.inputValue = newVal
      },
      immediate: true,
    },
    inputValue: {
      handler(newVal) {
        this.$emit('update:modelValue', newVal)
      },
      immediate: true,
    },
  },
  methods: {
    sendMessage() {
      if (this.submitDisabled) {
        return
      }
      this.$emit('send', this.inputValue)
    },
    stop() {
      this.$emit('stop')
    },
    newMessage() {
      this.stopDisabled && this.stop()
      this.$emit('newMessage')
      // 新对话时清空输入框
    },
    adjustHeight(e) {
      const target = this.$refs.promptTextarea
      if (!target)
        return
      target.style.height = 'auto'
      const rows = Math.floor(target.scrollHeight / this.lineHeight)
      this.rows = rows < 2 ? 2 : rows > 10 ? 10 : rows
      target.style.height = `${this.rows * this.lineHeight}px`
    },
    handleKeydown(e) {
      const isEnter = e.key === 'Enter' || e.keyCode === 13
      const isCtrl = e.ctrlKey
      const isShift = e.shiftKey

      if (isEnter) {
        // Enter 发送消息
        if (!isCtrl && !isShift) {
          e.preventDefault()
          this.sendMessage()
        }
        else if (isCtrl || isShift) {
          // 手动插入换行符
          e.preventDefault()
          const textarea = e.target
          const start = textarea.selectionStart
          const end = textarea.selectionEnd
          const value = this.inputValue

          // 在光标位置插入换行符
          this.inputValue = `${value.substring(0, start)}\n${value.substring(end)}`

          // 设置光标位置到换行符后
          this.$nextTick(() => {
            textarea.selectionStart = textarea.selectionEnd = start + 1
            // 触发高度调整
            this.adjustHeight(e)
          })
        }
      }
    },
  },
}
</script>

<style lang="scss">
.chat-input {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 12px;
  transition: all 0.3s ease;

  &:focus-within {
    border-color: #3a77ff;
    box-shadow: 0 4px 16px rgba(58, 119, 255, 0.1);
  }

  .chat-textarea {
    border-radius: 12px 12px 0 0;
    overflow: hidden;
    .chat-textarea__inner {
      border: none;
      outline: none;
      padding: 12px 16px 6px;
      resize: none;
      scrollbar-width: none;
      height: 44px;
      line-height: 22px;
      width: 100%;
      box-sizing: border-box;
      font-size: 15px;
      transition: all 0.2s ease;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;

      &::placeholder {
        color: #a0aec0;
      }

      &::-webkit-scrollbar {
        display: none;
      }
    }
  }

  .chat-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 16px 12px;
    .chat-actions {
      flex: 1;
      display: flex;
      align-items: center;
      .action-item {
        height: 32px;
        padding: 0 8px;
        border-radius: 8px;
        border: 1px solid rgba(58, 119, 255, 0.3);
        background-color: rgba(58, 119, 255, 0.05);
        color: #3a77ff;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 16px;
        i {
          margin-right: 6px;
          font-size: 16px;
          font-weight: bold;
        }
      }

      .chat-new-message {
        &:hover {
          background-color: #3a77ff;
          color: #fff;
          transform: translateY(-1px);
        }

        &:active {
          transform: translateY(0);
        }
      }
    }

    .chat-button {
      height: 36px;
      width: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #3a77ff;
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 2px 6px rgba(58, 119, 255, 0.3);

      .chat-icon {
        font-size: 18px;
        color: #fff;
      }

      &:hover {
        background-color: #2c6bff;
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(58, 119, 255, 0.4);
      }

      &:active {
        transform: translateY(0);
      }

      &.chat-is-disabled {
        cursor: not-allowed;
        background-color: #e2e8f0;
        box-shadow: none;

        .chat-icon {
          color: #a0aec0;
        }
      }
    }

    .chat-stop-btn {
      height: 36px;
      padding: 0 14px;
      display: flex;
      align-items: center;
      background-color: #f8fafc;
      border-radius: 18px;
      font-size: 18px;
      border: 1px solid #e2e8f0;
      box-sizing: border-box;
      margin-left: 16px;
      color: #4a5568;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        border-color: #3a77ff;
        color: #3a77ff;
        background-color: rgba(58, 119, 255, 0.05);
      }

      span {
        margin-left: 8px;
        font-size: 14px;
        font-weight: 500;
      }
    }
  }
}
</style>
