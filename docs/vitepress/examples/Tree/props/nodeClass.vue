<template>
  <Tree :data="tree" label-field="name" children-field="children" :props="treeOptionProps" />
</template>

<script setup lang="ts">
const tree = [
  { id: 1, name: '根 1', disabled: false, children: [
    { id: 11, name: '子 1-1', disabled: true },
    { id: 12, name: '子 1-2', disabled: false },
  ] },
  { id: 2, name: '根 2', disabled: true },
]

const treeOptionProps = {
  class: (data: any) => ({ 'is-disabled-row': !!data.disabled }),
}
</script>

<style scoped>
:deep(.is-disabled-row) {
  color: #bbb;
}
</style>
