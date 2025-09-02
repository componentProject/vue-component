<template>
  <Tree :data="tree" label-field="name" children-field="children" show-line />

</template>

<script setup lang="ts">

const tree = [
  { id: 1, name: '根 1', children: [
    { id: 11, name: '子 1-1', children: [
      { id: 111, name: '子 1-1-1' },
    ]},
  ]},
]
</script>


