<template>
  <el-collapse v-model="model[prop]" v-if="show" v-bind="Options" v-on="Event">
    <el-collapse-item v-bind="item" v-for="(item, index) in config.items" :key="index">
      <template v-if="slots.title" #title="scope">
        <slot name="title" v-bind="scope"></slot>
      </template>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
import { isType } from '../../utils';
import {defineComponent} from 'vue'
export default defineComponent({
  name: 'wlCarousel',
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
        const { show, event, slots = {}, ...Options } = v;
        if (isType(show, 'boolean')) {
          this.show = !!show;
        }
        this.slots = slots;
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
