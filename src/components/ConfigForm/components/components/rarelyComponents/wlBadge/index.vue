<template>
  <el-badge v-if="show" v-bind="Options" v-on="Event">
    <template #default>
      <slot name="default">{{ model[prop] }}</slot>
    </template>
  </el-badge>
</template>

<script lang="js">
import { isType } from '../../../utils'
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'wlBadge',
  props: {
    prop: {
      type: String,
      default: '',
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
