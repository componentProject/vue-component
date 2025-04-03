<template>
  <el-radio-group v-if="show" v-model="computedModel" v-bind="Options" v-on="Event">
    <el-radio v-bind="radio" v-for="radio in config.radios" :key="radio.label" />
    <el-radio-button v-bind="button" v-for="button in config.buttons" :key="button.label" />
  </el-radio-group>
</template>

<script lang="js">
import { isType } from '../../../utils'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'wlRadioGroup',
  props: {
    prop: {
      type: String,
      default: '',
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
        this.Event = event || {}

        if (!v.buttons) v.buttons = []
        if (!v.radios) v.radios = []
      },
      immediate: true,
      deep: true,
    },
  },
})
</script>

<style scoped lang="scss"></style>
