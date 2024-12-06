<template>
  <el-progress v-if="show" v-bind="Options" v-on="Event">
    <!-- icon 自定义图标-->
    <template v-if="slots.icon" #icon="scope">
      <slot name="icon" v-bind="scope"></slot>
    </template>
    <!-- title 自定义标题-->
    <template v-if="slots.title" #title="scope">
      <slot name="title" v-bind="scope"></slot>
    </template>
    <!-- description 自定义描述性文字-->
    <template v-if="slots.description" #description="scope">
      <slot name="description" v-bind="scope"></slot>
    </template>
  </el-progress>
</template>

<script>
import { isType } from '../../utils';

import {defineComponent} from 'vue'
export default defineComponent({
  name: 'wlProgress',
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
        this.Event = event || {};
      },
      immediate: true,
      deep: true
    }
  }
});
</script>

<style scoped lang="scss"></style>
