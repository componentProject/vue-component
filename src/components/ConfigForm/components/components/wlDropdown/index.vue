<template>
  <el-dropdown v-if="show" v-bind="Options" v-on="Event">
    <template #default>
      <slot>
        <span class="el-dropdown-link">
          <span>{{ model[prop] || '下拉菜单' }}</span>
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
      </slot>
    </template>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-bind="item" v-for="(item, index) in config.items" :key="index" />
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts">
import { isType } from '../../utils'

import { defineComponent } from 'vue'

export default defineComponent({
  name: 'wlDropdown',
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
