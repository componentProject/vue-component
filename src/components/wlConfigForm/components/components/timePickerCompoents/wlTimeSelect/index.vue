<template>
  <el-time-select v-if="show" v-model="model[prop]" v-bind="Options" v-on="Event" />
</template>

<script>
import { isType } from '../../../utils';
import {defineComponent} from 'vue'
export default defineComponent({
  name: 'wlTimeSelect',
  props: {
    prop: {
      type: String,
      default: ''
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
