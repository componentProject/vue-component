<template>
  <div class="design-form-container">
    <div class="design-form-left">
      <DesignFormList @add-form-item="handleAddFormItem" />
    </div>
    <div class="design-form-main">
      <ReForm v-if="formConfig" v-bind="formConfig" />
    </div>
    <div class="design-form-right">
      <DesignFormRules />
    </div>
  </div>
</template>

<script setup lang="ts">
import ReForm from '@moluoxixi/components/ReForm'
import DesignFormRules from './components/designFormRules.vue'
import DesignFormList from './components/DesignFormList.vue'
import { formItemObj } from './datas/index'

defineOptions({ name: 'DesignForm' })

const formConfig: any = ref(null)

function handleAddFormItem(componentKey: string) {
  const componentConfig = formItemObj[componentKey]
  if (componentConfig && formConfig.value) {
    // 深拷贝避免直接修改源配置
    const newItem = { ...componentConfig }
    // 生成唯一字段名
    newItem.field = `field_${Date.now()}`
    // 添加到formConfig的items数组
    formConfig.value.items.push(newItem)
    // 触发响应式更新
    formConfig.value = { ...formConfig.value }
  }
  else if (!formConfig.value) {
    // 初始化表单配置
    formConfig.value = { ...formConfig }
  }
}
</script>

<style lang="scss" scoped>
.design-form-container {
  display: flex;
  justify-content: space-between;
  height: 100%;

  .design-form-left {
    width: 140px;
    height: 100%;
    border-right: 1px solid #f0f0f0;
  }

  .design-form-main {
    flex: 1;
    height: 100%;
  }

  .design-form-right {
    width: 400px;
    height: 100%;
    border-left: 1px solid #f0f0f0;
  }

  :deep(.el-radio) {
    margin-left: 16px;
  }
}
</style>
