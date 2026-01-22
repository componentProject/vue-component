<template>
  <Tree :data="tree" label-field="name" children-field="children" :buttons="buttons" show-type="hover" />
</template>

<script setup lang="ts">
const tree = [
  { id: 1, name: '根 1', children: [
    { id: 11, name: '子 1-1' },
  ] },
]

function buttons(row: any): any[] {
  return [
    { btnType: 'add', tooltip: '新增', event: () => console.log(`add ${row.name}`) },
  ]
}
</script>
