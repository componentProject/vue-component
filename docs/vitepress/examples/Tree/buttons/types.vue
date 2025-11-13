<!-- types.vue文件 -->
<template>
  <Tree :data="tree" label-field="name" children-field="children" :buttons="buttons" />
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
    { btnType: 'edit', tooltip: '编辑', event: () => console.log(`edit ${row.name}`) },
    { btnType: 'delete', tooltip: '删除', event: () => console.log(`delete ${row.name}`) },
  ]
}
</script>
