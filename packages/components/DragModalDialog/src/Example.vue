<template>
  <ElButton @click="visible = true">
    打开
  </ElButton>
  <DragModalDialog
    v-model:visible="visible"
    :buttons="[
      {
        type: 'primary',
      },
    ]"
  />
</template>

<script setup lang="ts">
import { ElButton } from 'element-plus'
import { ref } from 'vue'
import DragModalDialog from './index.vue'

const visible = ref(false)
</script>

<style scoped>

</style>
