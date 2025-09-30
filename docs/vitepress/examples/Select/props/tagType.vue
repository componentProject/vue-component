<template>
  <div class="container">
    <WlSelect
      v-model="vals"
      :options="options"
      :filterable="true"
      :collapse-tags="true"
      label="label"
      value="value"
      tag-type="success"
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
])
</script>

<style scoped>

</style>
