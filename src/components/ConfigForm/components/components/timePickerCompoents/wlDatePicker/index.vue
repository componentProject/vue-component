<template>
  <yearDatePicker
    v-if="show && Options.rangeType === 'yearrange'"
    v-model="computedModel"
    v-bind="Options"
    v-on="Event"
  />
  <el-date-picker v-else-if="show" v-model="computedModel" v-bind="Options" v-on="Event" />
</template>

<script lang="js">
import { isType } from '../../../utils'
import yearDatePicker from '../yearDatePicker/index.vue'
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'wlDatePicker',
  components: { yearDatePicker },
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
        const { show, options, event, ...Options } = v
        if (isType(show, 'boolean')) {
          this.show = !!show
        }
        this.Options = Options
        this.Event = event || {}
        if (!options) v.options = []
      },
      immediate: true,
      deep: true,
    },
  },
})
</script>

<style scoped lang="scss"></style>
