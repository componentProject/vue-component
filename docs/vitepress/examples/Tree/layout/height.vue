<template>
  <Tree :data="tree" label-field="name" children-field="children" :height="200" />

</template>

<script setup lang="ts">
import Tree from '@moluoxixi/components/Tree/index.ts'

const tree = Array.from({ length: 30 }).map((_, i) => ({
  id: i + 1,
  name: '节点 ' + (i + 1),
}))
</script>


