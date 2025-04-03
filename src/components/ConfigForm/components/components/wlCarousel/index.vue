<template>
  <el-collapse v-model="computedModel" v-if="show" v-bind="Options" v-on="Event">
    <el-collapse-item v-bind="item" v-for="(item, index) in config.items" :key="index">
      <template v-if="slots.title" #title="scope">
        <slot name="title" v-bind="scope"></slot>
      </template>
    </el-collapse-item>
  </el-collapse>
</template>

<script lang="js">
import { deepClone, isType } from '../../utils'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'wlCarousel',
  props: {
    prop: {
      type: String,
      default: '',
    },
    slots: {
      type: Object,
      default: () => {
        return {}
      },
    },
    model: {
      type: Object,
      default: () => {
        return {}
      },
    },
    config: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  computed: {
    computedModel: {
      get() {
        return this.model
      },
      set(value) {
        this.$emit('update:modelValue', value)
      },
    },
  },
  data() {
    return {
      show: true,
      Event: {},
      Options: {},
    }
  },
  watch: {
    config: {
      handler(v) {
        const { show, event, ...Options } = v
        if (isType(show, 'boolean')) {
          this.show = !!show
        }
        this.Options = Options
        if (!v.items) v.items = []
        this.Event = event || {}
      },
      immediate: true,
      deep: true,
    },
  },
})
</script>

<style scoped lang="scss"></style>
