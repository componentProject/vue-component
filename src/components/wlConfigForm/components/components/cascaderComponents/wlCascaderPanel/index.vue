<template>
  <el-cascader-panel v-if="show" v-model="model[prop]" v-bind="Options" v-on="Event">
    <!-- default自定义备选项的节点内容，参数为 { node, data }，分别为当前节点的 Node 对象和数据-->
    <template v-if="slots.default" #default="scope">
      <slot name="default" v-bind="scope" />
    </template>
  </el-cascader-panel>
</template>

<script>
import { isType } from '../../../utils';

import {defineComponent} from 'vue'
export default defineComponent({
  name: 'index',
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
};
</script>

<style scoped lang="scss"></style>
