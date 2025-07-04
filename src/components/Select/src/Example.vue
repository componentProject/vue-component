<template>
  <div>
    <Select :options="data" label="name" value="age" @change="onChangeValue" />
    {{ value }}
  </div>
</template>

<script setup lang="ts">
import Select from '@/components/Select/src/index.vue'
import { ref } from 'vue'

const data = [
  { name: '测试1', age: '12' },
  { name: '测试2', age: '13' },
  { name: '测试3', age: '14' },
  { name: '测试4', age: '15' },
  { name: '测试5', age: '16' },
  { name: '测试6', age: '17' },
  { name: '测试7', age: '18' },
  { name: '测试8', age: '19' },
]

const value = ref('')

function onChangeValue(a) {
  console.log(a)
  value.value = a
}
</script>

<style scoped lang="scss"></style>
