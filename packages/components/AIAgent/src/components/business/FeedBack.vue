<template>
  <div v-if="visible" class="feedback-overlay">
    <div class="feed-back">
      <div class="feed-back-header">
        <div class="feed-back-header-title">
          反馈
        </div>
        <div class="feed-back-close" @click="handleClose">
          <i class="ai-iconfont icon-times" />
        </div>
      </div>
      <div class="feed-back-content">
        <div class="feed-back-reasons">
          <div
            v-for="reason in reasons"
            :key="reason"
            class="reason-item" :class="[{ active: selectedReason === reason }]"
            @click="selectedReason = reason"
          >
            {{ reason }}
          </div>
        </div>
        <div class="feed-back-reason">
          <textarea v-model="customReason" placeholder="请详细描述您的反馈..." rows="4" />
        </div>
        <div class="feed-back-actions">
          <button class="submit-btn" @click="handleSubmit">
            提交
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { $toast } from '../ui/toast'
import { feedback } from '../api/api'

export default {
  name: 'FeedBack',
  props: {
    messageId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      reasons: ['违法有害', '理解错误', '内容不专业', '其他'],
      selectedReason: '',
      customReason: '',
      visible: '',
      curItem: {},
      callBack: null,
    }
  },
  methods: {
    show(data, callBack) {
      this.callBack = callBack
      this.curItem = data
      this.visible = true
    },
    handleClose() {
      this.$emit('close')
      this.visible = false
      this.selectedReason = ''
      this.customReason = ''
    },
    async handleSubmit() {
      if (!this.selectedReason) {
        $toast('请选择原因', {
          type: 'warning',
        })
        return
      }
      this.visible = false
      await feedback({
        messageId: this.curItem.message_id,
        userFeedback: 2,
        badType: this.selectedReason,
        remark: this.customReason,
      })
      this.callBack()
    },
  },
}
</script>

<style lang="scss" scoped>
.feed-back {
  width: 400px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;

  .feed-back-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    border-bottom: 1px solid #e6e8eb;
    background: #fafbfc;

    .feed-back-header-title {
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }

    .feed-back-close {
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

  .feed-back-content {
    padding: 20px;

    .feed-back-reasons {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 16px;

      .reason-item {
        padding: 6px 12px;
        border: 1px solid #e5e5e5;
        border-radius: 16px;
        font-size: 13px;
        color: #666;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          border-color: #3a77ff;
          color: #3a77ff;
        }

        &.active {
          background: #3a77ff;
          border-color: #3a77ff;
          color: #fff;
        }
      }
    }

    .feed-back-reason {
      margin-bottom: 20px;

      textarea {
        width: 100%;
        border: 1px solid #e5e5e5;
        border-radius: 6px;
        padding: 12px;
        font-size: 14px;
        color: #333;
        resize: vertical;
        min-height: 80px;
        font-family: inherit;

        &:focus {
          outline: none;
          border-color: #3a77ff;
        }

        &::placeholder {
          color: #999;
        }
      }
    }

    .feed-back-actions {
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
}
.feedback-overlay {
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
