<template>
  <div class="design-form-rules">
    <Tabs v-model="activeTab" :tab-list="tabList">
      <template #组件配置>
        <div v-if="selectedItem" class="config-section">
          <ReForm
            ref="formItemConfigRef"
            v-bind="formItemConfig"
            v-model="formData"
            @change="handleItemConfigChange"
          />
          <!-- 添加表单项操作按钮 -->
          <div class="item-actions">
            <ElButton type="primary" @click="handleDeleteItem">
              删除表单项
            </ElButton>
          </div>
        </div>
        <div v-else class="empty-state">
          <p>请先选择要配置的表单项</p>
        </div>
      </template>
      <template #表单配置>
        <div class="config-section">
          <ReForm
            ref="formConfigRef"
            v-bind="formConfig"
            @change="handleFormConfigChange"
          />
        </div>
      </template>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import Tabs from '@moluoxixi/components/Tabs'
import ReForm from '@moluoxixi/components/ReForm'
import { formItemConfig as defaultFormItemConfig } from '../datas/formData'
import { deepClone } from '../utils/formSerializer'

const props = defineProps<{
  formConfig?: any
  selectedItem?: any
}>()

// 定义事件
const emits = defineEmits<{
  (e: 'update:formConfig', config: any): void
  (e: 'update:selectedItem', item: any): void
  (e: 'deleteItem'): void
}>()

// 组件内部状态
const activeTab = ref('form')
const tabList = [
  { label: '组件配置', name: 'component' },
  { label: '表单配置', name: 'form' },
]

const formData = ref<any>({})

const formItemConfigRef = ref<any>(null)
const formConfigRef = ref<any>(null)

// 表单配置数据（深拷贝避免修改原始数据）
const formConfigData = ref<any>(null)
// 表单项配置（深拷贝）
const formItemConfig = ref<any>(deepClone(defaultFormItemConfig))

// 监听外部表单配置变化
watch(
  () => props.formConfig,
  (newConfig) => {
    if (newConfig) {
      formConfigData.value = { ...newConfig }
    }
  },
  { immediate: true },
)

// 监听选中项变化，自动切换到组件配置标签
watch(
  () => props.selectedItem,
  (newItem) => {
    if (newItem) {
      setFormItemConfig(newItem)
      activeTab.value = 'component'
    }
  },
)

// 根据添加的组件设置表单项配置
function setFormItemConfig(item: any) {
  const itemObj = {}
  // 简单循环item对象的所有属性
  if (item && typeof item === 'object') {
    Object.keys(item).forEach((key) => {
      if (key === 'component') {
        itemObj[key] = item[key].name
      }
      else if (key === 'props') {
        Object.keys(item[key]).forEach((propKey) => {
          itemObj[propKey] = item[key][propKey]
        })
      }
      else {
        itemObj[key] = item[key]
      }
      formData.value = itemObj
    })
  }
}

// 表单项配置实时变化
function handleItemConfigChange() {
  emits('update:selectedItem', formItemConfigRef.value.formData)
}

// 表单配置实时变化
function handleFormConfigChange() {
  emits('update:formConfig', formConfigRef.value.formData)
}

// 删除表单项
function handleDeleteItem() {
  if (props.selectedItem && confirm('确定要删除当前表单项吗？')) {
    emits('deleteItem')
    console.log('删除表单项:', props.selectedItem)
  }
}

function getFormData() {
  return formConfigRef?.value?.formData || null
}

defineExpose({
  getFormData,
})
</script>

<style lang="scss" scoped>
.design-form-rules {
  height: 100%;

  .config-section {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 300px;
    color: #999;
  }

  .item-actions {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #f0f0f0;
  }

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
