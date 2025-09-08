<template>
  <Tree :data="tree" label-field="name" children-field="nodes" />
</template>

<script setup lang="ts">
const tree = [
  { id: 1, name: '根 1', nodes: [
    { id: 11, name: '子 1-1' },
    { id: 12, name: '子 1-2' },
  ] },
  { id: 2, name: '根 2' },
]
</script>
