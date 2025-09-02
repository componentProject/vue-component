<template>
  <div class="container" style="height: 100px;">
    <ElButton @click="visible = true">自定义头部内容</ElButton>

    <DragModalDialog
      v-model:visible="visible"
      :width="500"
      :height="300"
    >
      <!-- 完全自定义头部 -->
      <template #header="{ close, title }">
        <div class="custom-header">
          <h3 style="margin: 0; color: #409EFF;">🎯 自定义标题</h3>
          <ElButton type="danger" size="small" @click="close">关闭</ElButton>
        </div>
      </template>

      <div>
        <p>这是通过 header 插槽完全自定义的头部内容</p>
        <p>可以包含任何自定义的HTML结构和样式</p>
      </div>
    </DragModalDialog>

    <ElButton @click="visible2 = true" style="margin-left: 10px;">头部左右插槽</ElButton>

    <DragModalDialog
      v-model:visible="visible2"
      title="原始标题"
    >
      <!-- 自定义左侧内容 -->
      <template #header-left="{ title }">
        <div style="display: flex; align-items: center;">
          <ElIcon style="margin-right: 8px; color: #67C23A;"><SuccessFilled /></ElIcon>
          <span>{{ title }}</span>
        </div>
      </template>

      <!-- 自定义右侧内容 -->
      <template #header-right="{ close }">
        <ElButton type="primary" size="small" @click="close">确认关闭</ElButton>
      </template>

      <p>通过 header-left 和 header-right 插槽分别自定义头部左右区域</p>
    </DragModalDialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElButton, ElIcon } from 'element-plus'
import { SuccessFilled } from '@element-plus/icons-vue'
import DragModalDialog from '@moluoxixi/components/DragModalDialog'

const visible = ref(false)
const visible2 = ref(false)
</script>

<style scoped>
.container {
  padding: 20px;
}

.custom-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 100%;
}
</style>
