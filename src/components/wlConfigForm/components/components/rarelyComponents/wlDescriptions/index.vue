<template>
  <el-descriptions v-if="show" v-bind="Options" v-on="Event">
    <!-- title 自定义标题，显示在左上方-->
    <template v-if="slots.title" #title="scope">
      <slot name="title" v-bind="scope"></slot>
    </template>
    <!-- extra 自定义操作区，显示在右上方-->
    <template v-if="slots.extra" #extra="scope">
      <slot name="extra" v-bind="scope"></slot>
    </template>
    <el-descriptions-item v-bind="item" v-for="(item, index) in config.items" :key="index">
      <!-- label	自定义标签文本-->
      <template v-if="slots.label" #label="scope">
        <slot name="label" v-bind="scope"></slot>
      </template>
    </el-descriptions-item>
  </el-descriptions>
</template>

<script lang="ts">
import { isType } from '../../../utils';

import {defineComponent} from 'vue'
export default defineComponent({
  name: 'wlDescriptions',
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
        const { items, show, event, ...Options } = v;
        if (isType(show, 'boolean')) {
          this.show = !!show;
        }
        this.Options = Options;
        this.Event = event || {};
        if (!items) v.items = [];
      },
      immediate: true,
      deep: true
    }
  }
});
</script>

<style scoped lang="scss"></style>
