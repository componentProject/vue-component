<template>
  <el-timeline v-if="show" v-bind="Options" v-on="Event">
    <el-timeline-item v-bind="item" v-for="(item, index) in config.items" :key="index">
      <!-- default Timeline-Item 的内容-->
      <template v-if="slots.default" #default>
        <slot name="default"></slot>
      </template>
      <!-- dot 自定义节点-->
      <template v-if="slots.dot" #dot>
        <slot name="dot"></slot>
      </template>
    </el-timeline-item>
  </el-timeline>
</template>

<script>
import { isType } from '../../utils';

import {defineComponent} from 'vue'
export default defineComponent({
  name: 'wlTimeline',
  props: {
    prop: {
      type: String,
      default: ''
    },
    slots: {
      type: Object,
      default: () => {
        return {};
      }
    },
    model: {
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
      show: true,
      Event: {},
      Options: {}
    };
  },
  watch: {
    config: {
      handler(v) {
        const { show, event, ...Options } = v;
        if (isType(show, 'boolean')) {
          this.show = !!show;
        }
        this.Options = Options;
        if (!v.items) v.items = [];
        this.Event = event || {};
      },
      immediate: true,
      deep: true
    }
  }
});
</script>

<style scoped lang="scss"></style>
