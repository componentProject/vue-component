<template>
  <Tree :data="tree" label-field="title" children-field="children" />

</template>

<script setup lang="ts">
import Tree from '@moluoxixi/components/Tree/index.ts'

const tree = [
  { id: 1, title: '根 1', children: [
    { id: 11, title: '子 1-1' },
  ]},
]
</script>


