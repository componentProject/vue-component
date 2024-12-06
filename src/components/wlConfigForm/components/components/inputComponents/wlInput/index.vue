<template>
  <el-input v-if="show" v-model="model[prop]" v-bind="Options" v-on="Event">
    <!-- prefix 输入框头部内容，只对 type="text" 有效-->
    <template v-if="slots.prefix" #prefix="scope">
      <slot name="prefix" v-bind="scope"></slot>
    </template>
    <!-- suffix 输入框尾部内容，只对 type="text" 有效-->
    <template v-if="slots.suffix" #suffix="scope">
      <slot name="suffix" v-bind="scope"></slot>
    </template>
    <!-- prepend 输入框前置内容，只对 type="text" 有效-->
    <template v-if="slots.prepend" #prepend="scope">
      <slot name="prepend" v-bind="scope"></slot>
    </template>
    <!-- append 输入框后置内容，只对 type="text" 有效-->
    <template v-if="slots.append" #append="scope">
      <slot name="append" v-bind="scope"></slot>
    </template>
  </el-input>
</template>

<script>
import { isType } from '../../../utils';

import {defineComponent} from 'vue'
export default defineComponent({
  name: 'wlInput',
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
        // type : "textarea"|"text"|"button"|...
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
