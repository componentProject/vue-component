<template>
  <Tree :data="tree" label-field="name" children-field="children" :buttons="buttons">
    <template #customBtn="{ data }">
      <button class="link" @click.stop="onClick(data)">
        自定义
      </button>
    </template>
  </Tree>
</template>

<script setup lang="ts">
import type { ButtonsItem } from '@moluoxixi/components/Tree/src/types/index.ts'

const tree = [
  { id: 1, name: '根 1', children: [
    { id: 11, name: '子 1-1' },
  ] },
]

function buttons(): ButtonsItem[] {
  return [
    { slot: 'customBtn', tooltip: '自定义按钮' },
  ]
}

function onClick(row: any) {
  console.log(`slot ${row.name}`)
}
</script>

<style scoped>
.link {
  background: none;
  border: none;
  color: #409eff;
  cursor: pointer;
  padding: 0;
}
</style>
