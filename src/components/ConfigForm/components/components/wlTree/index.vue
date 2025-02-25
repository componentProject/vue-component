<template>
  <el-tree v-if="show" v-bind="Options" v-on="Event">
    <!-- default 自定义树节点的内容，参数为 { node, data },分别为当前节点的 Node 对象和数据 -->
    <template v-if="slots.default" #default="scope">
      <slot name="default" v-bind="scope"></slot>
    </template>
  </el-tree>
</template>

<script lang="js">
import { isType } from '../../utils'
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'wlTree',
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
