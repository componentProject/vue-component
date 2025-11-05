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
import DragModalDialog from './index.vue'
import { ref } from 'vue'
import { ElButton } from 'element-plus'

const visible = ref(false)
</script>

<style scoped>

</style>
