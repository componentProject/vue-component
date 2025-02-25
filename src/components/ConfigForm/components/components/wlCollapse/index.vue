<template>
  <el-carousel v-if="show" v-bind="Options" v-on="Event">
    <el-carousel-item v-bind="item" v-for="(item, index) in config.items" :key="index">
    </el-carousel-item>
  </el-carousel>
</template>

<script lang="js">
import { isType } from '../../utils'
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'wlCollapse',
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
