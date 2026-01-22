<template>
  <Tree :data="tree" label-field="name" children-field="children" :child-icon="Child" />
</template>

<script setup lang="ts">
import { Document as Child } from '@element-plus/icons-vue'

const tree = [
  { id: 1, name: '根 1', children: [
    { id: 11, name: '子 1-1' },
    { id: 12, name: '子 1-2' },
  ] },
]
</script>
