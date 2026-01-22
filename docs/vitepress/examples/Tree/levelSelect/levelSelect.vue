<template>
  <Tree :data="tree" label-field="name" children-field="children" level-select @change="onChange" />
  <div style="margin-top:8px">
    已选：{{ names }}
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const tree = [
  { id: 1, name: '根 1', children: [
    { id: 11, name: '子 1-1', children: [
      { id: 111, name: '子 1-1-1' },
    ] },
  ] },
]

const rows = ref<any[]>([])
const names = computed(() => rows.value.map(r => r.name).join(', '))
function onChange(list: any[]) {
  rows.value = list
}
</script>
