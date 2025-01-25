<template>
  <el-button class="button" :loading="loading" v-bind="$attrs">
    <template #default>
      <span v-if="title">{{ title }}</span>
      <slot name="default"></slot>
    </template>
  </el-button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'defaultButton',
  props: {
    title: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
})
</script>

<style scoped lang="scss"></style>
