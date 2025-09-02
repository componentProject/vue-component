<template>
  <div class="container">
    <WlSelect
      v-model="vals"
      :options="options"
      :filterable="true"
      :collapse-tags="true"
      :collapse-tags-tooltip="true"
      label="label"
      value="value"
      multiple
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const vals = ref<string[]>([])
const options = ref([
  { label: '苹果', value: 'apple' },
  { label: '香蕉', value: 'banana' },
  { label: '西瓜', value: 'watermelon' },
  { label: '葡萄', value: 'grape' },
])
</script>

<style scoped>
.container {
  padding: 8px;
}
</style>
