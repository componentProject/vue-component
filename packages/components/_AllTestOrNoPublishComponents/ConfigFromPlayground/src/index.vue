<template>
  <div class="w-full h-full">
    <FcDesigner v-if="isReady" ref="designerRef" />
  </div>
</template>

<script setup lang="ts">
import { getCurrentInstance, onMounted, ref } from 'vue'
import FcDesigner from '@form-create/designer'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

defineOptions({
  name: 'ConfigFromPlayground',
})

const designerRef = ref()
const isReady = ref(false)

function getRule() {
  return designerRef.value?.getRule?.() || []
}

function getOption() {
  return designerRef.value?.getOption?.() || {}
}

defineExpose({ getRule, getOption })

onMounted(() => {
  // 静态引入并注册设计器
  try {
    const app = getCurrentInstance()?.appContext.app
    if (app) {
      app.use(FcDesigner)
      app.use(FcDesigner.formCreate)
      app.use(ElementPlus)
    }
  }
  catch (e) {
    console.warn('[ConfigFromPlayground] 注册 @form-create/designer 失败：', e)
  }
  finally {
    isReady.value = true
  }
})
</script>

<style lang="scss" scoped>
</style>
