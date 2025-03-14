<template>
  <el-button class="button" :loading="loading" v-bind="$attrs">
    <template #default>
      <span v-if="title">{{ title }}</span>
      <slot name="default"></slot>
    </template>
  </el-button>
</template>

<script lang="js">
import { defineComponent } from 'vue'
/**
 *  throttleButton
 *  一个debounce,throttle,async,depValue的el-button组件
 *  可以单独或组合使用这些功能
 *  @see https://github.com/pikax/vue-throttle-debounce
 */
export default defineComponent({
  name: 'throttleButton',
  props: {
    /**
     *  按钮的title
     */
    title: { type: String, default: '' },
    /**
     *  防抖
     */
    debounce: {
      type: Boolean,
      default: false,
    },
    /**
     *  节流
     */
    throttle: {
      type: Boolean,
      default: false,
    },
    /**
     *  等待时间
     */
    wait: {
      type: [String, Number],
      default: 200,
    },
    /**
     *  是否异步
     */
    async: {
      type: Boolean,
      default: false,
    },
    /**
     *  是否loading
     */
    isLoad: {
      type: Boolean,
      default: false,
    },

    /**
     *  依赖的值
     */
    depValue: {
      type: [Array, Object, String, Number, Boolean, undefined, null],
      default: '依赖',
    },
    /**
     *  是否深度监听
     */
    isDeep: {
      type: Boolean,
      default: false,
    },
    /**
     *  信息
     */
    message: undefined,
    /**
     *  事件配置
     */
    eventConfig: {
      type: Object,
      default: () => {
        return {
          click: {
            message: '正在操作中,请稍后',
            depValue: undefined,
          },
        }
      },
    },
  },
  data() {
    return {
      loading: false,
      asyncEventQueue: new Set(),
      depValueQueue: new Set(),
    }
  },
  beforeMount() {
    const messageHandler = (key) =>
      this.$message.warning(
        this.message || this.eventConfig[key]?.message || '正在操作中,请稍后...',
      )
    const asyncHandler = (fn, key) => {
      return async (...args) => {
        if (this.isLoad) {
          this.loading = true
          await fn(...args)
          this.loading = false
        } else {
          if (this.asyncEventQueue.has(key)) return messageHandler(key)
          this.asyncEventQueue.add(key)
          await fn(...args)
          this.asyncEventQueue.delete(key)
        }
      }
    }
    const depHandler = (fn, key) => {
      return (...args) => {
        const stopQueue = []
        const deleteDepValueHandler = () => {
          this.depValueQueue.delete(key)
          stopQueue.forEach((stop) => stop?.())
        }
        stopQueue.push(
          this.$watch(`eventConfig${key}.depValue`, deleteDepValueHandler, { deep: this.isDeep }),
          this.$watch(`depValue`, deleteDepValueHandler, { deep: this.isDeep }),
        )
        if (!this.depValueQueue.has(key)) {
          fn(...args)
          this.depValueQueue.add(key)
        } else {
          messageHandler(key)
        }
      }
    }
    const debounce = (fn) => {
      let timeout
      return (...args) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          fn(...args)
        }, +this.wait)
      }
    }
    const throttle = (fn) => {
      let inThrottle
      let timer
      return (...args) => {
        if (!inThrottle) {
          fn(...args)
          inThrottle = true
          clearTimeout(timer)
          timer = setTimeout(() => (inThrottle = false), +this.wait)
        }
      }
    }
    for (const key of Object.keys(this.$listeners)) {
      const fn = this.$listeners[key]
      if (this.throttle) {
        this.$listeners[key] = throttle(fn)
      } else if (this.debounce) {
        this.$listeners[key] = debounce(fn)
      } else if (this.async) {
        // let newFn = getType(fn) === 'AsyncFunction' ? asyncHandler(fn, key) : fn;
        this.$listeners[key] = asyncHandler(fn, key)
      } else if (this.depValue != '依赖') {
        this.$listeners[key] = depHandler(fn, key)
      }
    }
  },
})
</script>
<style scoped>
.button {
  font-size: 14px;
}
</style>
