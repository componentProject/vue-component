<template>
  <Tree :data="tree" label-field="name" children-field="children" :buttons="buttons" />
</template>

<script setup lang="ts">
import { Document } from '@element-plus/icons-vue'

const tree = [
  { id: 1, name: '根 1', children: [
    { id: 11, name: '子 1-1' },
  ] },
]

function buttons(row: any): any[] {
  return [
    { icon: Document, tooltip: '文档', event: () => console.log(`doc ${row.name}`) },
  ]
}
</script>
