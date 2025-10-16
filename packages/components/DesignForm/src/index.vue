<template>
  <div class="design-form-container">
    <div class="design-form-left">
      <DesignFormList @add-form-item="handleAddFormItem" />
    </div>
    <div class="design-form-main">
      <div v-if="!formConfig" class="empty-form">
        <p>请从左侧添加表单项</p>
      </div>
      <ReForm v-else v-bind="formConfig" @submit="handleFormSubmit" @click="handleReFormClick" />
    </div>
    <div class="design-form-right">
      <DesignFormRules
        ref="formRulesRef"
        :selected-item="selectedItem"
        :form-config="defaultFormConfig"
        @update:form-config="handleFormConfigUpdate"
        @update:selected-item="handleSelectedItemUpdate"
        @delete-item="handleDeleteItem"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import ReForm from '@moluoxixi/components/ReForm'
import DesignFormRules from './components/DesignFormRules.vue'
import DesignFormList from './components/DesignFormList.vue'
import { componentMap, formItemObj } from './datas/index'
import { defaultFormConfig } from './datas/formData'
import { deepClone } from './utils/formSerializer'

defineOptions({ name: 'DesignForm' })

const formConfig = ref(null)
// 存储当前选中的表单项
const selectedItem = ref<any>(null)
const selectedItemIndex = ref<number | null>(null)

const formRulesRef = ref<any>(null)

// 添加表单项
function handleAddFormItem(componentKey: string) {
  const componentConfig = formItemObj[componentKey]
  // 初始化表单配置
  if (!formConfig.value) {
    // 深拷贝默认配置，避免直接修改源数据
    formConfig.value = {
      ...formRulesRef.value.getFormData(),
      items: [],
    }
  }
  if (componentConfig) {
    // 深拷贝组件配置
    const newItem = deepClone(componentConfig)
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 1000)
    newItem.field = `${componentKey}_${timestamp}_${random}`
    const newItemConfig = {
      ...formConfig.value,
      items: [...formConfig.value.items, newItem],
    }
    // 选中新添加的表单项
    selectedItemIndex.value = newItemConfig.items.length - 1
    selectedItem.value = newItem

    // 为所有表单项添加或移除选中样式
    newItemConfig.items = newItemConfig.items.map((item, index) => ({
      ...item,
      customClass: index === selectedItemIndex.value ? 'selected-form-item' : '',
    }))
    formConfig.value = { ...newItemConfig }
  }
}

// 更新表单配置
function handleFormConfigUpdate(newConfig: any) {
  if (formConfig.value && newConfig) {
    formConfig.value = {
      ...formConfig.value,
      ...newConfig,
    }
  }
}

// 更新选中的表单项
function handleSelectedItemUpdate(updatedItem: any) {
  if (selectedItemIndex.value !== null && formConfig.value) {
    const itemObj: any = {}
    Object.keys(updatedItem).forEach((key) => {
      if (key === 'component') {
        itemObj[key] = componentMap[updatedItem[key].toLowerCase()]
      }
      else if (key === 'required') {
        // 确保props对象存在
        if (!itemObj.rules) {
          itemObj.rules = []
        }
        itemObj.rules = [{ required: updatedItem[key], message: '不能为空' }]
      }
      else {
        itemObj[key] = updatedItem[key]
      }
    })

    const newItems = [...formConfig.value.items]
    newItems.splice(selectedItemIndex.value, 1, { ...itemObj })

    // 创建全新的formConfig对象，确保响应式更新
    formConfig.value = {
      ...formConfig.value,
      items: newItems,
    }

    selectedItem.value = itemObj
  }
}

function handleReFormClick(index: number) {
  console.log('0000000', index)
}

// 表单提交处理
function handleFormSubmit(values: any) {
  console.log('表单提交数据:', values)
  // 可以添加自定义的提交逻辑
}

// 删除表单项的处理函数
function handleDeleteItem() {
  if (selectedItemIndex.value !== null && formConfig.value) {
    // 从表单配置中删除选中的表单项
    formConfig.value.items.splice(selectedItemIndex.value, 1)
    // 更新选中状态
    selectedItem.value = null
    selectedItemIndex.value = null
    // 触发响应式更新
    formConfig.value = { ...formConfig.value }
  }
}

// 监听选中项索引变化，自动更新选中项引用
watch(selectedItemIndex, (newIndex) => {
  if (newIndex !== null && formConfig.value && newIndex < formConfig.value.items.length) {
    selectedItem.value = formConfig.value.items[newIndex]
  }
})
</script>

<style lang="scss" scoped>
.design-form-container {
  display: flex;
  justify-content: space-between;
  height: 100%;

  .empty-form {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #999;
    font-size: 16px;
  }

  .design-form-left {
    width: 140px;
    height: 100%;
    border-right: 1px solid #f0f0f0;
  }

  .design-form-main {
    flex: 1;
    height: 100%;

    :global(.selected-form-item) {
      padding: 2px;
      border: 1px solid #409eff;
      background-color: rgba(64, 158, 255, 0.05);
      transition: all 0.3s ease;
    }
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
