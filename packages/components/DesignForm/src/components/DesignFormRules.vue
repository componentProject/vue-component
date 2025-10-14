<template>
  <div class="design-form-rules">
    <Tabs v-model="activeTab" :tab-list="tabList">
      <template #组件配置>
        <ReForm v-bind="formItemConfig" />
      </template>
      <template #表单配置>
        <ReForm v-bind="formConfig" />
      </template>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import Tabs from '@moluoxixi/components/Tabs'
import ReForm from '@moluoxixi/components/ReForm'
import { formConfig, formItemConfig } from '../datas/formData'

defineOptions({ name: 'DesignFormRules' })

// 接收外部传入的formConfig
const props = defineProps<{
  formConfig?: any
}>()

// 事件定义
const emits = defineEmits<{
  (e: 'addFormItem', values: any): void
}>()

const activeTab = ref('form')
const tabList = [
  { label: '组件配置', name: 'component' },
  { label: '表单配置', name: 'form' },
]

// 定义更新配置的方法
// function updateFormConfig(values: any) {
//   emits('update:formConfig', values)
// }
</script>

<style lang="scss" scoped>
.design-form-rules {
  height: 100%;

  :deep(#pane-component) {
    .ap-form-wrapper {
      padding-bottom: 40px;
    }
  }

  :deep(.el-tabs__nav) {
    width: 100%;

    .el-tabs__item {
      flex: 1;
    }
  }
  :deep(.el-tabs) {
    height: 100%;
    overflow: hidden;
  }
  :deep(.el-tabs__content) {
    .el-tab-pane {
      padding: 16px;
      overflow-x: auto;
    }
  }
}
</style>
