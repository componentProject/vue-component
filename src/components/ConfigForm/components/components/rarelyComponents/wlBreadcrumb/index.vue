<template>
  <el-breadcrumb v-if="show" v-bind="Options" v-on="Event">
    <el-breadcrumb-item v-bind="item" v-for="(item, index) in config.items" :key="index" />
  </el-breadcrumb>
</template>

<script lang="ts">
import { isType } from '../../../utils'
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'wlBreadcrumb',
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
        if (!v.items) v.items = []
        this.Event = event || {}
      },
      immediate: true,
      deep: true,
    },
  },
})
</script>

<style scoped lang="scss"></style>
