<!-- label.vue文件 -->
<template>
  <Tree :data="tree" label-field="name" children-field="children">
    <template #label="{ data }">
      <span>[自定义] {{ data.name }}</span>
    </template>
  </Tree>
</template>

<script setup lang="ts">
const tree = [
  { id: 1, name: '根 1', children: [
    { id: 11, name: '子 1-1' },
  ] },
]
</script>
