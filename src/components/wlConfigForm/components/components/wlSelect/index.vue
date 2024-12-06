<template>
  <el-select v-if="show" v-model="model[prop]" v-bind="Options" v-on="Event">
    <!-- default	Option 组件列表-->
    <el-option v-bind="option" v-for="(option, index) in config.options" :key="index" />
    <!-- prefix Select 组件头部内容-->
    <template v-if="slots.prefix" #prefix="scope">
      <slot name="prefix" v-bind="scope"></slot>
    </template>
    <!-- empty 无选项时的列表-->
    <template v-if="slots.empty" #empty="scope">
      <slot name="empty" v-bind="scope"></slot>
    </template>
  </el-select>
</template>

<script>
import { isType } from '../../utils';

import {defineComponent} from 'vue'
export default defineComponent({
  name: 'wlSelect',
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
        const { show, options, event, ...Options } = v;
        if (isType(show, 'boolean')) {
          this.show = !!show;
        }
        this.Options = Options;
        this.Event = event || {};
        if (!options) v.options = [];
      },
      immediate: true,
      deep: true
    }
  }
});
</script>

<style scoped lang="scss"></style>
