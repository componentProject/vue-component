<template>
  <Tree :data="tree" label-field="name" children-field="children" :buttons="buttons" />

</template>

<script setup lang="ts">
import type { ButtonsItem } from '@moluoxixi/components/Tree/src/types/index.ts'

const tree = [
  { id: 1, name: '根 1', children: [
    { id: 11, name: '子 1-1' },
  ]},
]

function buttons(row: any): ButtonsItem[] {
  return [
    { type: 'add', tooltip: '新增', event: () => window.alert('add ' + row.name) },
    { type: 'edit', tooltip: '编辑', event: () => window.alert('edit ' + row.name) },
    { type: 'delete', tooltip: '删除', event: () => window.alert('delete ' + row.name) },
  ]
}
</script>


