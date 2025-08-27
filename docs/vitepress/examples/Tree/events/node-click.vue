<template>
  <Tree :data="tree" label-field="name" children-field="children" @node-click="onNodeClick" />
  <div style="margin-top:8px">最近一次点击：{{ last }}</div>

</template>

<script setup lang="ts">
import Tree from '@moluoxixi/components/Tree/index.ts'
import { ref } from 'vue'

const tree = [
  { id: 1, name: '根 1', children: [
    { id: 11, name: '子 1-1' },
  ]},
]

const last = ref('')
function onNodeClick(data: any){
  last.value = data?.name || ''
}
</script>


