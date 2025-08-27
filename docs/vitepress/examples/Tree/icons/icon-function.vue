<template>
  <Tree :data="list" row-field="id" parent-field="pid" label-field="name" :icon="iconByType" />

</template>

<script setup lang="ts">
import Tree from '@moluoxixi/components/Tree/index.ts'
import { Folder, Document } from '@element-plus/icons-vue'

const list = [
  { id: 1, pid: null, name: '根 1', type: 'dir' },
  { id: 11, pid: 1, name: '子 1-1', type: 'file' },
  { id: 2, pid: null, name: '根 2', type: 'dir' },
]

function iconByType(row: any){
  return row.type === 'dir' ? Folder : Document
}
</script>


