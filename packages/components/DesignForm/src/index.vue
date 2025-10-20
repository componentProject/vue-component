<template>
  <div class="design-form-container">
    <div class="design-form-left">
      <DesignFormList @add-form-item="handleAddFormItem" />
    </div>
    <div class="design-form-main">
      <div v-if="!formConfig" class="empty-form">
        <p>请从左侧添加表单项</p>
      </div>
      <ReForm v-else v-bind="formConfig" draggable @submit="handleFormSubmit" @update:items="handleItemsUpdate" @form-item-click="handleReFormClick" />
    </div>
    <div class="design-form-right">
      <DesignFormRules
        ref="formRulesRef"
        :selected-item-index="selectedItemIndex"
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
    console.log('添加表单项顺序', newItemConfig)
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

// 拖动排序更新表单项
function handleItemsUpdate(newItems: any[]) {
  if (formConfig.value) {
    // 深拷贝确保响应式更新
    const updatedConfig = { ...formConfig.value, items: deepClone(newItems) }
    formConfig.value = updatedConfig
  }
}

// 更新选中的表单项
function handleSelectedItemUpdate(updatedItem: any) {
  if (selectedItemIndex.value !== null && formConfig.value) {
    // 获取现有表单项对象的深拷贝，而不是创建空对象
    const originalItem = formConfig.value.items[selectedItemIndex.value]
    const itemObj: any = deepClone(originalItem || {})

    Object.keys(updatedItem).forEach((key) => {
      if (key === 'component') {
        const componentType = updatedItem[key].toLowerCase()
        itemObj[key] = componentMap[componentType]
        if (componentType === 'eltextarea') {
          itemObj.props = {
            type: 'textarea',
          }
        }
      }
      else if (key === 'required' || key === 'trigger' || key === 'message' || key === 'validator') {
        // let validatorObj = {}
        // 组装验证信息对象
        if (!itemObj.rules) {
          itemObj.rules = []
        }
        if (key === 'validator' && updatedItem?.validator) {
          try {
            // 确保rules数组已初始化
            if (!itemObj.rules) {
              itemObj.rules = []
            }

            // 清理validator代码中的TypeScript类型注解，确保JavaScript语法正确
            let cleanValidatorCode = updatedItem.validator
            cleanValidatorCode = cleanValidatorCode.replace(/\b(\w+):\s*\w+/g, '$1')
            const validatorFn = new Function(`return ${cleanValidatorCode}`)()

            // 检查并更新或添加validator规则
            const validatorIndex = itemObj.rules.findIndex(rule => rule.validator)
            const triggerConfig = updatedItem.trigger
              ? (Array.isArray(updatedItem.trigger) ? updatedItem.trigger : [updatedItem.trigger])
              : ['blur', 'change'] // 默认使用双触发机制

            if (validatorIndex !== -1) {
              // 更新现有validator规则
              itemObj.rules[validatorIndex] = {
                ...itemObj.rules[validatorIndex],
                validator: validatorFn,
                trigger: triggerConfig,
              }
            }
            else {
              // 添加新的validator规则
              itemObj.rules.push({
                validator: validatorFn,
                trigger: triggerConfig,
              })
            }
          }
          catch (error) {
            console.error('创建validator函数失败:', error)
          }
        }
        // 处理required/message/trigger规则
        else if (key === 'required' || key === 'message' || key === 'trigger') {
          // 确保rules数组已初始化
          if (!itemObj.rules) {
            itemObj.rules = []
          }
          // 查找或创建required规则
          let requiredRuleIndex = itemObj.rules.findIndex(rule => rule.required !== undefined && !rule.validator)
          if (requiredRuleIndex === -1) {
            // 创建新的required规则
            itemObj.rules.push({
              required: updatedItem?.required ?? false,
              message: updatedItem?.message ?? '不能为空',
              trigger: updatedItem?.trigger
                ? (Array.isArray(updatedItem.trigger) ? updatedItem.trigger : [updatedItem.trigger])
                : ['blur', 'change'],
            })
          }
          else {
            // 精确更新现有required规则的对应属性，确保所有属性都有默认值
            itemObj.rules[requiredRuleIndex] = {
              ...itemObj.rules[requiredRuleIndex],
              required: key === 'required' ? updatedItem[key] ?? false : (itemObj.rules[requiredRuleIndex].required !== undefined ? itemObj.rules[requiredRuleIndex].required : false),
              message: key === 'message' ? updatedItem[key] ?? '不能为空' : (itemObj.rules[requiredRuleIndex].message || '不能为空'),
              trigger: key === 'trigger' ? updatedItem[key] ?? ['blur', 'change'] : itemObj.rules[requiredRuleIndex].trigger || ['blur', 'change'],
            }
          }
        }
      }
      else if (key === 'maxlength' || key === 'min' || key === 'max' || key === 'disabled' || key === 'clearable') {
        // 组装props属性对象
        if (!itemObj.props) {
          itemObj.props = {}
        }
        itemObj.props[key] = updatedItem[key]
      }
      else {
        itemObj[key] = updatedItem[key]
      }
    })
    console.log('跟新表单项数据', itemObj)
    // 使用深拷贝创建完全新的items数组，确保响应式系统能检测到rules数组的变化
    const newItems = deepClone(formConfig.value.items)
    // 完全替换目标项，确保所有嵌套属性都被更新
    newItems.splice(selectedItemIndex.value, 1, deepClone(itemObj))

    newItems.forEach((item, index) => {
      item.customClass = index === selectedItemIndex.value ? 'selected-form-item' : ''
    })

    // 使用深拷贝创建全新的formConfig对象，确保响应式更新
    formConfig.value = deepClone({
      ...formConfig.value,
      items: newItems,
    })
    console.log('更新后的表单项rules:', itemObj.rules || [])

    selectedItem.value = itemObj
  }
}

function handleReFormClick(event) {
  console.log('点击表单项22222', event)
  // 获取点击的表单项field值或索引
  const fieldOrIndex = event.detail?.field || event.detail?.item?.field || event.index || event

  // 确保formConfig存在且有items
  if (formConfig.value && formConfig.value.items && fieldOrIndex !== null && fieldOrIndex !== undefined) {
    // 支持通过索引或field查找表单项
    let itemIndex = -1
    let targetItem = null

    // 如果是数字，直接作为索引使用
    if (typeof fieldOrIndex === 'number') {
      itemIndex = fieldOrIndex
      targetItem = formConfig.value.items[itemIndex]
    }
    else {
      // 如果是字符串，查找对应field的表单项
      itemIndex = formConfig.value.items.findIndex(item => item.field === fieldOrIndex)
      targetItem = formConfig.value.items[itemIndex]
    }

    // 确保找到了有效的表单项
    if (itemIndex >= 0 && targetItem) {
      // 更新选中状态
      selectedItemIndex.value = itemIndex
      // 使用深拷贝确保selectedItem的独立性
      selectedItem.value = deepClone(targetItem)

      // 为所有表单项添加或移除选中样式
      const newItems = deepClone(formConfig.value.items)
      newItems.forEach((item, index) => {
        item.customClass = index === itemIndex ? 'selected-form-item' : ''
      })

      // 使用深拷贝创建全新的formConfig对象，确保响应式更新
      formConfig.value = deepClone({
        ...formConfig.value,
        items: newItems,
      })
    }
  }
}

// 表单提交处理
function handleFormSubmit(values: any) {
  console.log('表单提交数据:', values)
  // 可以添加自定义的提交逻辑
}

// 删除表单项的处理函数
function handleDeleteItem() {
  if (selectedItemIndex.value !== null && formConfig.value) {
    // 采用与handleSelectedItemUpdate相同的方式，创建items数组的新副
    const newItems = [...formConfig.value.items]
    newItems.splice(selectedItemIndex.value, 1)

    // 更新选中状态
    selectedItem.value = null
    selectedItemIndex.value = null

    // 创建全新的formConfig对象，确保响应式更新
    formConfig.value = {
      ...formConfig.value,
      items: newItems,
    }
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
    margin-right: 16px;
  }
  :deep(.el-checkbox) {
    margin-right: 16px;
  }
}
</style>
