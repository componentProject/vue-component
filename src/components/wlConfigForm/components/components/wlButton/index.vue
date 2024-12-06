<template>
  <component v-if="show" v-bind="Options" v-on="Event" :is="buttonType">
    <template #default>
      <slot name="default">
        <span>{{ text }}</span>
      </slot>
    </template>
  </component>
</template>

<script lang="ts">
import { isType } from '../../utils';
import components from './components.js';

import {defineComponent} from 'vue'
export default defineComponent({
  name: 'wlButton',
  components,
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
      Options: {},
      buttonType: 'defaultButton',
      text: ''
    };
  },
  watch: {
    config: {
      handler(v) {
        const { show, event, text = '', buttonType = 'defaultButton', ...Options } = v;
        this.text = text;
        this.buttonType = buttonType;
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
