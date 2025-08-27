<template>
  <Tree :data="tree" label-field="name" children-field="children" levelSelect @change="onChange" />
  <div style="margin-top:8px">已选：{{ names }}</div>

</template>

<script setup lang="ts">
import Tree from '@moluoxixi/components/Tree/index.ts'
import { ref, computed } from 'vue'

const tree = [
  { id: 1, name: '根 1', children: [
    { id: 11, name: '子 1-1', children: [
      { id: 111, name: '子 1-1-1' },
    ]},
  ]},
]

const rows = ref<any[]>([])
const names = computed(()=> rows.value.map(r=>r.name).join(', '))
function onChange(list: any[]){
  rows.value = list
}
</script>


