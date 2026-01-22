<template>
  <Tree :data="list" row-field="id" parent-field="pid" label-field="name" />
</template>

<script setup lang="ts">
const list = [
  { id: 1, pid: null, name: '根 1' },
  { id: 11, pid: 1, name: '子 1-1' },
  { id: 12, pid: 1, name: '子 1-2' },
  { id: 2, pid: null, name: '根 2' },
  { id: 21, pid: 2, name: '子 2-1' },
]
</script>
