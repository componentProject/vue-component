<!-- default.vue文件 -->
<template>
  <Tree :data="tree" label-field="name" children-field="children">
    <template #default="{ data }">
      <div class="row">
        <span class="name">自定义行：</span>
        <strong>{{ (data as any).name }}</strong>
      </div>
    </template>
  </Tree>
</template>

<script setup lang="ts">
const tree = [
  { id: 1, name: '根 1', children: [
    { id: 11, name: '子 1-1' },
    { id: 12, name: '子 1-2' },
  ] },
  { id: 2, name: '根 2' },
]
</script>

<style scoped>
.row {
  display: flex;
  align-items: center;
}
.name {
  color: #666;
  margin-right: 6px;
}
</style>
