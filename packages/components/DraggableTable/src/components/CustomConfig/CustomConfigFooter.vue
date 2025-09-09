<template>
  <div class="custom-config-footer">
    <el-checkbox v-model="unifyCustomConfig" style="margin-right: 40px;" label="作为统一配置" size="large" />
    <el-button @click="handleEvent('reset')">
      恢复默认
    </el-button>
    <el-button type="primary" @click="handleEvent('confirm')">
      确认
    </el-button>
    <el-button type="info" @click="handleEvent('cancel')">
      取消
    </el-button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const emit = defineEmits(['customAction'])
const unifyCustomConfig = ref(false)
function handleEvent(str: string) {
  emit('customAction', str, unifyCustomConfig.value)
}
</script>

<style scoped lang="scss">
.custom-config-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
