<template>
  <el-radio v-if="show" v-model="model[prop]" v-bind="Options" v-on="Event">
    <template v-if="slots.default" #default>
      <slot name="default"></slot>
    </template>
  </el-radio>
</template>

<script lang="js">
import { isType } from '../../../utils'

import { defineComponent } from 'vue'
export default defineComponent({
  name: 'wlRadio',
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
