<template>
  <Tree :data="tree" label-field="name" children-field="children" :buttons="buttons" show-type="click" />
</template>

<script setup lang="ts">
import type { ButtonsItem } from '@moluoxixi/components/Tree/src/types/index.ts'

const tree = [
  { id: 1, name: '根 1', children: [
    { id: 11, name: '子 1-1' },
  ] },
]

function buttons(row: any): ButtonsItem[] {
  return [
    { type: 'edit', tooltip: '编辑', event: () => console.log(`edit ${row.name}`) },
  ]
}
</script>
