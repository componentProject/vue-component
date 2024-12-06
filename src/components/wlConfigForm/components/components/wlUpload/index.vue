<template>
  <el-upload v-if="show" v-bind="Options" v-on="Event">
    <!-- trigger 触发文件选择框的内容-->
    <template v-if="slots.trigger" #trigger="scope">
      <slot name="trigger" v-bind="scope"></slot>
    </template>
    <!-- tip 提示说明文字-->
    <template v-if="slots.tip" #tip="scope">
      <slot name="tip" v-bind="scope"></slot>
    </template>
  </el-upload>
</template>

<script lang="ts">
import { isType } from '../../utils';
import {defineComponent} from 'vue'
export default defineComponent({
  name: 'wlUpload',
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
      names: ['a', 'b', 'c'],
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
