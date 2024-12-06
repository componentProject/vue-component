<template>
  <el-popover v-bind="Options" v-on="Event">
    <!--  — Popover 内嵌 HTML 文本-->
    <template v-if="slots.default" #default>
      <slot name="default"></slot>
    </template>
    <!-- reference 触发 Popover 显示的 HTML 元素-->
    <template #reference>
      <slot name="reference"></slot>
    </template>
  </el-popover>
</template>

<script>
// import { isType } from '../../utils';

import {defineComponent} from 'vue'
export default defineComponent({
  name: 'wlPopover',
  props: {
    slots: {
      type: Object,
      default: () => {
        return {};
      }
    },
    config: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      Event: {},
      Options: {}
    };
  },
  watch: {
    config: {
      handler(v) {
        const { event, ...Options } = v;
        this.Options = Options;
        this.Event = event || {};
      },
      immediate: true,
      deep: true
    }
  }
});
</script>

<style scoped lang="scss"></style>
