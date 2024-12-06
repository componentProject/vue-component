<template>
  <el-tooltip v-bind="Options" v-on="Event">
    <!--  — 触发 tooltip 显示的 HTML 元素-->
    <template #default>
      <slot name="default"></slot>
    </template>
    <!--    content 内嵌 HTML 文本-->
    <template v-if="slots.content" #content>
      <slot name="content"></slot>
    </template>
  </el-tooltip>
</template>

<script>
// import { isType } from '../../utils';

import {defineComponent} from 'vue'
export default defineComponent({
  name: 'wlTooltip',
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
