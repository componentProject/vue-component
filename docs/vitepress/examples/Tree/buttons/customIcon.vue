<template>
  <Tree :data="tree" label-field="name" children-field="children" :buttons="buttons" />

</template>

<script setup lang="ts">
import { Document } from '@element-plus/icons-vue'
import type { ButtonsItem } from '@moluoxixi/components/Tree/src/types/index.ts'

const tree = [
  { id: 1, name: '根 1', children: [
    { id: 11, name: '子 1-1' },
  ]},
]

function buttons(row: any): ButtonsItem[] {
  return [
    { icon: Document, tooltip: '文档', event: () => window.alert('doc ' + row.name) },
  ]
}
</script>


