<!-- AIAgent的Select组件 -->
<template>
  <div class="ts-select" :class="{ 'is-active': isOpen, 'is-disabled': disabled }">
    <div class="ts-select__input" @click.stop="toggleDropdown">
      <div class="ts-select__value">
        {{ selectedLabel || placeholder }}
      </div>
      <div class="ts-select__suffix">
        <i class="ai-iconfont icon-angle-down" :class="{ 'is-reverse': isOpen }" />
      </div>
    </div>

    <transition name="ts-select-dropdown">
      <div v-show="isOpen" class="ts-select__dropdown" :style="dropdownStyle">
        <ul class="ts-select__options">
          <li
            v-for="item in options"
            :key="item.value"
            class="ts-select__option"
            :class="{ 'is-selected': item.value === modelValue }"
            @click.stop="handleSelect(item)"
          >
            {{ item.label }}
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'TsSelect',
  props: {
    // v-model绑定值
    modelValue: {
      type: [String, Number, Boolean, Object],
      default: '',
    },

    // 选项数组，格式: [{label: '显示文本', value: '值'}]
    options: {
      type: Array,
      default: () => [],
    },

    // 占位文本
    placeholder: {
      type: String,
      default: '请选择',
    },

    // 是否禁用
    disabled: {
      type: Boolean,
      default: false,
    },
    popoverWidth: {
      type: Number,
      default: '',
    },
  },

  data() {
    return {
      isOpen: false,
      dropdownStyle: {},
    }
  },

  computed: {
    // 获取当前选中项的标签文本
    selectedLabel() {
      const selected = this.options.find(item => item.value === this.modelValue)
      return selected ? selected.label : ''
    },
  },

  mounted() {
    // 点击组件外部时关闭下拉框
    document.addEventListener('click', this.handleOutsideClick)
    // 窗口大小变化时重新计算位置
    window.addEventListener('resize', this.handleResize)
    window.addEventListener('scroll', this.handleScroll)
  },

  beforeUnmount() {
    // 组件销毁前移除事件监听
    document.removeEventListener('click', this.handleOutsideClick)
    window.removeEventListener('resize', this.handleResize)
    window.removeEventListener('scroll', this.handleScroll)
  },

  methods: {
    // 切换下拉框显示状态
    toggleDropdown() {
      if (this.disabled)
        return
      if (!this.isOpen) {
        this.calculateDropdownPosition()
      }
      this.isOpen = !this.isOpen
    },

    // 计算下拉框位置
    calculateDropdownPosition() {
      this.$nextTick(() => {
        const inputEl = this.$el.querySelector('.ts-select__input')
        if (!inputEl)
          return

        const rect = inputEl.getBoundingClientRect()
        const windowHeight = window.innerHeight
        const windowWidth = window.innerWidth
        const itemHeight = 36 // 每个选项的高度
        const maxVisibleItems = 5 // 最多显示5个选项
        const maxDropdownHeight = Math.min(this.options.length, maxVisibleItems) * itemHeight
        const dropdownHeight = maxDropdownHeight
        const spacing = 5 // 间距

        // 计算下拉框的基本位置
        let top = rect.bottom + spacing
        let left = rect.left
        let transformOrigin = 'center top'
        let maxHeight = maxDropdownHeight

        // 检查下方是否有足够空间
        const spaceBelow = windowHeight - rect.bottom - spacing
        const spaceAbove = rect.top - spacing

        if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
          // 下方空间不够且上方空间更大，显示在上方
          top = rect.top - Math.min(dropdownHeight, spaceAbove) - spacing
          transformOrigin = 'center bottom'
          maxHeight = Math.min(maxDropdownHeight, spaceAbove)
        }
        else {
          // 显示在下方
          maxHeight = Math.min(maxDropdownHeight, spaceBelow)
        }

        // 确保不超出屏幕右边界
        if (left + rect.width > windowWidth) {
          left = windowWidth - rect.width - 10
        }

        // 确保不超出屏幕左边界
        if (left < 10) {
          left = 10
        }

        this.dropdownStyle = {
          position: 'fixed',
          top: `${Math.max(10, top)}px`,
          left: `${left}px`,
          width: `${this.popoverWidth || rect.width}px`,
          height: `${maxHeight}px`,
          transformOrigin,
        }
      })
    },

    // 处理选项选择
    handleSelect(item) {
      this.$emit('update:modelValue', item.value)
      this.$emit('change', item)
      this.isOpen = false
    },

    // 处理组件外部点击
    handleOutsideClick(event) {
      const select = this.$el
      if (select && !select.contains(event.target)) {
        this.isOpen = false
      }
    },

    // 处理窗口大小变化
    handleResize() {
      if (this.isOpen) {
        this.calculateDropdownPosition()
      }
    },

    // 处理滚动事件
    handleScroll() {
      if (this.isOpen) {
        this.calculateDropdownPosition()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.ts-select {
  position: relative;
  width: 100%;
  font-size: 14px;

  &__input {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 32px;
    padding: 0 12px;
    border: 1px solid rgba(58, 119, 255, 0.3);
    border-radius: 8px;
    background-color: rgba(58, 119, 255, 0.05);
    cursor: pointer;
    transition: border-color 0.2s;

    &:hover {
      border-color: #3a77ff;
    }
  }

  &__value {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #3a77ff;

    &:empty::before {
      content: attr(placeholder);
      color: rgba(58, 119, 255, 0.3);
    }
  }

  &__suffix {
    margin-left: 8px;
    color: #3a77ff;
    .iconfont {
      font-size: 12px;
      transition: transform 0.3s;

      &.is-reverse {
        transform: rotate(180deg);
      }
    }
  }

  &__dropdown {
    overflow-y: auto;
    overflow-x: hidden;
    background-color: #fff;
    border: 1px solid #e4e7ed;
    border-radius: 12px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    z-index: 9999;
  }

  &__options {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__option {
    padding: 0 8px;
    height: 36px;
    line-height: 36px;
    color: #3a77ff;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &:hover {
      background-color: rgba(58, 119, 255, 0.05);
    }

    &.is-selected {
      background-color: rgba(58, 119, 255, 0.05);
      color: #3a77ff;
    }
  }

  &.is-active {
    .ts-select__input {
      border-color: #409eff;
    }
  }

  &.is-disabled {
    .ts-select__input {
      background-color: #f5f7fa;
      border-color: #e4e7ed;
      color: #c0c4cc;
      cursor: not-allowed;
    }
  }
}

// 下拉动画
.ts-select-dropdown-enter-active,
.ts-select-dropdown-leave-active {
  opacity: 1;
  transform: scaleY(1);
  transition:
    transform 0.3s cubic-bezier(0.23, 1, 0.32, 1),
    opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  // transform-origin 现在由JavaScript动态设置
}

.ts-select-dropdown-enter-from,
.ts-select-dropdown-leave-to {
  opacity: 0;
  transform: scaleY(0);
}
</style>
