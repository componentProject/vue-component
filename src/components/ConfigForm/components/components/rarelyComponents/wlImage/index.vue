<template>
  <el-image v-if="show" v-bind="Options" v-on="Event">
    <!-- placeholder 图片未加载的占位内容-->
    <template v-if="slots.placeholder" #placeholder="scope">
      <slot name="placeholder" v-bind="scope"></slot>
    </template>
    <!-- error 加载失败的内容-->
    <template v-if="slots.error" #error="scope">
      <slot name="error" v-bind="scope"></slot>
    </template>
  </el-image>
</template>

<script lang="ts">
import { isType } from '../../../utils'

import { defineComponent } from 'vue'
export default defineComponent({
  name: 'wlImage',
  props: {
    prop: {
      type: String,
      default: '',
    },
    slots: {
      type: Object,
      default: () => {
        return {}
      },
    },
    model: {
      type: Object,
      default: () => {
        return {}
      },
    },
    config: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {
      show: true,
      Event: {},
      Options: {},
    }
  },
  watch: {
    config: {
      handler(v) {
        const { show, event, ...Options } = v
        if (isType(show, 'boolean')) {
          this.show = !!show
        }
        this.Options = Options
        this.Event = event || {}
      },
      immediate: true,
      deep: true,
    },
  },
})
</script>

<style scoped lang="scss"></style>
