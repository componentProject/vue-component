<template>
  <el-transfer v-if="show" v-model="model[prop]" v-bind="Options" v-on="Event">
    <!-- default 自定义数据项的内容，参数为 { option }-->
    <template v-if="slots.default" #default="scope">
      <slot name="default" v-bind="scope"></slot>
    </template>
    <!-- left-footer 左侧列表底部的内容-->
    <template v-if="slots.leftFooter" #left-footer>
      <slot name="left-footer"></slot>
    </template>
    <!-- right-footer 右侧列表底部的内容-->
    <template v-if="slots.rightFooter" #right-footer>
      <slot name="right-footer"></slot>
    </template>
  </el-transfer>
</template>

<script>
import { isType } from '../../utils';
import {defineComponent} from 'vue'
export default defineComponent({
  name: 'wlTransfer',
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
