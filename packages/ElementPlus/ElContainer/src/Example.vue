<template>
  <ElContainer class="example-container">
    <ElHeader height="60px" class="example-header">
      Header
    </ElHeader>
    <ElContainer>
      <ElMain class="example-main">
        Main Content
      </ElMain>
    </ElContainer>
  </ElContainer>
</template>

<script setup lang="ts">
import { ElHeader, ElMain } from 'element-plus'
import ElContainer from './index.vue'
</script>

<style scoped>
.example-container {
  border: 1px solid var(--el-color-primary);
}
.example-header {
  background-color: var(--el-color-primary);
  color: #fff;
  display: flex;
  align-items: center;
  padding: 0 16px;
}
.example-main {
  padding: 16px;
}
</style>
