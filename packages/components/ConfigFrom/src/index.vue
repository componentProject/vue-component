<template>
  <div class="w-full">
    <form-create
      v-if="isReady"
      v-model="model"
      :rule="props.rule"
      :option="props.option"
      v-bind="$attrs"
    />
  </div>
</template>

<script setup lang="ts">
import { getCurrentInstance, onMounted, ref } from 'vue'
import formCreate from '@form-create/element-ui'
import install from '@form-create/element-ui/auto-import'

defineOptions({
  name: 'ConfigFrom',
})

// 允许用户传入 form-create 的 rule 与 option（运行时声明，避免类型参数解析问题）
const props = defineProps({
  rule: { type: Array as any, default: () => [] },
  option: { type: Object as any, default: () => ({}) },
})

const model = defineModel<Record<string, any>>({ default: {} })
const isReady = ref(false)

onMounted(() => {
  // 静态引入并注册 @form-create/element-ui
  try {
    const app = getCurrentInstance()?.appContext.app
    if (app) {
      formCreate.use(install as any)
      app.use(formCreate as any)
    }
  }
  catch (e) {
    console.warn('[ConfigFrom] 注册 form-create 插件失败：', e)
  }
  finally {
    isReady.value = true
  }
})
</script>

<style scoped></style>
