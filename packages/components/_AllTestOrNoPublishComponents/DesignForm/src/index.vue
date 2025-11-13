<template>
  <div class="design-form-container">
    <div class="design-form-left">
      <DesignFormList @add-form-item="handleAddFormItem" />
    </div>
    <div class="design-form-main">
      <div v-if="!formConfig" class="empty-form">
        <p>请从左侧添加表单项</p>
      </div>
      <ReForm
        v-else
        v-bind="formConfig"
        draggable
        @submit="handleFormSubmit"
        @update:items="handleItemsUpdate"
        @form-item-click="handleReFormClick"
      />
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
import type {
  DesignFormRulesInstance,
  FormConfig,
  FormConfigData,
  FormItem,
  FormItemClickEvent,
} from './types'
import { ElMessage } from 'element-plus'
import { isObject } from 'lodash'
import { onMounted, ref, watch } from 'vue'
import DesignFormList from './components/DesignFormList.vue'
import DesignFormRules from './components/DesignFormRules.vue'
import { componentMap, formItemObj } from './datas'
import { defaultFormConfig } from './datas/formData'
import { deepClone, deserializeWithFunctions, serializeWithFunctions } from './utils/formSerializer'

defineOptions({ name: 'DesignForm' })

// 定义组件属性，接收外部传入的表单配置
const props = defineProps<{
  /**
   * 外部传入的表单配置对象
   * 如果提供，则会覆盖默认配置并回显
   */
  initialFormConfig?: FormConfig | null
}>()

// 定义emit事件
const emit = defineEmits<{
  (e: 'update:formConfig', config: FormConfig): void
}>()

const formConfig = ref<FormConfig | null>(null)
// 存储当前选中的表单项
const selectedItem = ref<FormItem | null>(null)
const selectedItemIndex = ref<number | null>(null)

const formRulesRef = ref<DesignFormRulesInstance | null>(null)

// ===== 辅助函数 =====

// 检查组件是否为指定类型
function isComponentOfType(item: any, componentType: string): boolean {
  if (!item || !item.component)
    return false
  const typeToCheck = String(componentType).toLowerCase()

  // 检查对象形式的组件名称
  const isObjectComponent = typeof item.component === 'object'
    && item.component.name
    && String(item.component.name).toLowerCase() === typeToCheck

  // 检查字符串形式的组件名称
  const isStringComponent = typeof item.component === 'string'
    && item.component.toLowerCase() === typeToCheck

  return isObjectComponent || isStringComponent
}

// 处理表单项默认值，特别是特殊组件
function processItemDefaultValue(item: FormItem | undefined | null): void {
  if (!item)
    return

  // 对于TsCheckbox组件，确保默认值是数组类型
  if (isComponentOfType(item, 'tscheckbox')) {
    // 检查并转换defaultValue为数组类型
    if (item.defaultValue !== undefined && item.defaultValue !== null) {
      if (typeof item.defaultValue === 'string') {
        try {
          // 尝试将字符串解析为JSON数组
          const parsedArray = JSON.parse(item.defaultValue)
          if (Array.isArray(parsedArray)) {
            item.defaultValue = parsedArray
          }
          else {
            // 如果字符串包含逗号，按逗号分割为数组
            if (item.defaultValue.includes(',')) {
              item.defaultValue = item.defaultValue.split(',').map(str => str.trim())
            }
            else {
              // 否则创建包含该字符串的数组
              item.defaultValue = [item.defaultValue]
            }
          }
        }
        catch {
          // 如果解析失败，检查是否包含逗号
          if (item.defaultValue.includes(',')) {
            item.defaultValue = item.defaultValue.split(',').map(str => str.trim())
          }
          else {
            // 否则创建包含该字符串的数组
            item.defaultValue = [item.defaultValue]
          }
        }
      }
      else if (!Array.isArray(item.defaultValue)) {
        // 其他非数组类型转换为数组
        item.defaultValue = [item.defaultValue]
      }
    }
    else if (item.defaultValue === null || item.defaultValue === undefined) {
      // 如果是null或undefined，设为空数组
      item.defaultValue = []
    }
  }
}

// 处理组件属性设置
function handleComponentProperty(itemObj: FormItem, key: string, updatedItem: Record<string, any>): void {
  const componentType = String(updatedItem[key]).toLowerCase()
  itemObj[key] = componentMap[componentType]

  if (componentType === 'eltextarea') {
    itemObj.props = {
      type: 'textarea',
    }
  }

  if (componentType !== 'tsselect' && componentType !== 'tscheckbox' && componentType !== 'tsradio') {
    delete updatedItem?.dataType
    delete updatedItem?.requestUrl
    delete updatedItem?.requestParams
    delete updatedItem?.requestMethod
    delete updatedItem?.responseDataPath
    delete updatedItem?.options
    delete updatedItem?.valueKey
    delete updatedItem?.labelKey
  }
  else {
    if (updatedItem?.dataType) {
      delete updatedItem?.options
    }
  }

  if (componentType !== 'elinputnumber') {
    delete updatedItem?.min
    delete updatedItem?.max
  }
}

// 处理验证规则配置
function handleValidationRules(itemObj: FormItem, key: string, updatedItem: Record<string, any>): void {
  // 确保rules数组已初始化
  if (!itemObj.rules) {
    itemObj.rules = []
  }

  // 处理validator规则
  if (key === 'validator' && updatedItem?.validator) {
    try {
      // 清理validator代码中的TypeScript类型注解，确保JavaScript语法正确
      let cleanValidatorCode = updatedItem.validator
      cleanValidatorCode = cleanValidatorCode.replace(/\b(\w+):\s*\w+/g, '$1')
      // eslint-disable-next-line no-new-func
      const validatorFn = new Function(`return ${cleanValidatorCode}`)() as (rule: any, value: any, callback: (...item: any) => any) => void

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
  else if (['required', 'message', 'trigger'].includes(key)) {
    // 查找或创建required规则
    const requiredRuleIndex = itemObj.rules.findIndex(rule => rule.required !== undefined && !rule.validator)

    if (requiredRuleIndex === -1) {
      // 创建新的required规则
      itemObj.rules.push({
        required: updatedItem.required !== undefined ? updatedItem.required : false,
        message: updatedItem.message || '不能为空',
        trigger: updatedItem.trigger
          ? (Array.isArray(updatedItem.trigger) ? updatedItem.trigger : [updatedItem.trigger])
          : ['blur', 'change'],
      })
    }
    else {
      // 精确更新现有required规则的对应属性，确保所有属性都有默认值
      itemObj.rules[requiredRuleIndex] = {
        ...itemObj.rules[requiredRuleIndex],
        required: key === 'required'
          ? (updatedItem.required !== undefined ? updatedItem.required : false)
          : (itemObj.rules[requiredRuleIndex].required !== undefined ? itemObj.rules[requiredRuleIndex].required : false),
        message: key === 'message'
          ? (updatedItem.message || '不能为空')
          : (itemObj.rules[requiredRuleIndex].message || '不能为空'),
        trigger: key === 'trigger'
          ? (updatedItem.trigger || ['blur', 'change'])
          : (itemObj.rules[requiredRuleIndex].trigger || ['blur', 'change']),
      }
    }
  }
}

// 处理组件props属性
function handleComponentProps(itemObj: FormItem, key: string, updatedItem: Record<string, any>): void {
  // 组装props属性对象
  if (!itemObj.props) {
    itemObj.props = {}
  }

  if ((key === 'options' || key === 'requestParams') && updatedItem[key]?.length > 0) {
    // 处理options属性，确保是数组格式
    if (key === 'options') {
      itemObj.props.options = typeof updatedItem[key] === 'string'
        ? JSON.parse(updatedItem[key] || '[]')
        : (Array.isArray(updatedItem[key]) ? updatedItem[key] : [])
    }
    // 处理requestParams属性，确保是对象格式
    else if (key === 'requestParams') {
      itemObj.props.requestParams = typeof updatedItem[key] === 'string'
        ? JSON.parse(updatedItem[key] || '{}')
        : (isObject(updatedItem[key]) ? updatedItem[key] : {})
    }
  }
  else {
    itemObj.props[key] = updatedItem[key]
  }
}

// 应用选中样式到表单项
function applySelectedClass(items: FormItem[], selectedIndex: number | null): FormItem[] {
  return items.map((item, index) => ({
    ...item,
    customClass: index === selectedIndex ? 'selected-form-item' : '',
  }))
}

// 生成唯一字段名
function generateUniqueFieldName(componentKey: string): string {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000)
  return `${componentKey}_${timestamp}_${random}`
}

// ===== 主要功能函数 =====

// 新增表单项事件
function addFormItemEvent(componentKey: string, componentConfig: any): void {
  // 初始化表单配置
  if (!formConfig.value && formRulesRef.value && typeof formRulesRef.value.getFormData === 'function') {
    // 深拷贝默认配置，避免直接修改源数据
    formConfig.value = {
      ...formRulesRef.value.getFormData(),
      items: [],
    }
  }

  if (!componentConfig)
    return

  // 深拷贝组件配置
  const newItem = deepClone(componentConfig)
  newItem.field = generateUniqueFieldName(componentKey)

  // 对特定组件进行特殊处理
  if (['tsselect', 'tscheckbox', 'tsradio'].includes(componentKey)) {
    newItem.dataType = false
  }

  // 创建新的配置
  const updatedItems = [...formConfig.value.items, newItem]

  // 选中新添加的表单项
  const newIndex = updatedItems.length - 1
  selectedItemIndex.value = newIndex
  selectedItem.value = newItem

  // 应用选中样式
  const styledItems = applySelectedClass(updatedItems, newIndex)

  // 更新表单配置
  formConfig.value = deepClone({
    ...formConfig.value,
    items: styledItems,
  })
}

// 添加表单项
function handleAddFormItem(componentKey: string): void {
  // 获取组件配置
  const componentConfig = formItemObj[componentKey]

  if (selectedItem.value && selectedItemIndex.value !== null && formRulesRef.value && typeof formRulesRef.value.validate === 'function') {
    // 使用回调函数方式调用validate方法
    formRulesRef.value.validate((valid) => {
      if (valid) {
        addFormItemEvent(componentKey, componentConfig)
      }
      else {
        ElMessage.error({
          message: '请先完成必填项，再添加',
          duration: 5 * 1000,
        })
      }
    })
  }
  else {
    addFormItemEvent(componentKey, componentConfig)
  }
}

// 更新表单配置
function handleFormConfigUpdate(newConfig: FormConfigData | Partial<FormConfig>): void {
  // 只有在formConfig和newConfig都存在时才更新
  if (formConfig.value && newConfig) {
    formConfig.value = {
      ...formConfig.value,
      ...newConfig,
    }
  }
}

// 拖动排序更新表单项
function handleItemsUpdate(newItems: FormItem[]): void {
  if (!formConfig.value)
    return

  // 深拷贝确保响应式更新
  const updatedItems = deepClone(newItems)
  formConfig.value = { ...formConfig.value, items: updatedItems }

  // 更新selectedItemIndex，确保选中项索引与新顺序保持一致
  if (selectedItemIndex.value !== null && selectedItem.value?.field) {
    const currentSelectedField = selectedItem.value.field

    // 在新的items数组中查找该field的新索引位置
    const newIndex = updatedItems.findIndex(item => item.field === currentSelectedField)

    // 如果找到了对应的项，则更新索引，否则重置选中状态
    selectedItemIndex.value = newIndex !== -1 ? newIndex : null
  }
}

// 更新选中的表单项
function handleSelectedItemUpdate(updatedItem: Record<string, any>): void {
  if (selectedItemIndex.value === null || !formConfig.value) {
    return
  }

  // 获取现有表单项对象的深拷贝
  const originalItem = formConfig.value.items[selectedItemIndex.value]
  const itemObj = deepClone(originalItem || {})

  // 遍历更新的属性
  Object.keys(updatedItem).forEach((key) => {
    // 根据不同类型的属性使用不同的处理函数
    if (key === 'component') {
      handleComponentProperty(itemObj, key, updatedItem)
    }
    else if (['required', 'trigger', 'message', 'validator'].includes(key)) {
      handleValidationRules(itemObj, key, updatedItem)
    }
    else if (['maxlength', 'min', 'max', 'disabled', 'clearable', 'options', 'requestParams', 'requestMethod', 'responseDataPath', 'labelKey', 'valueKey', 'requestUrl'].includes(key)) {
      handleComponentProps(itemObj, key, updatedItem)
    }
    else {
      // 直接设置其他属性
      itemObj[key] = updatedItem[key]
    }
  })

  // 使用深拷贝创建完全新的items数组，确保响应式系统能检测到rules数组的变化
  const newItems = deepClone(formConfig.value.items)
  // 完全替换目标项，确保所有嵌套属性都被更新
  newItems.splice(selectedItemIndex.value, 1, deepClone(itemObj))

  // 应用选中样式并处理特殊组件默认值
  const styledItems = applySelectedClass(newItems, selectedItemIndex.value)
  styledItems.forEach(item => processItemDefaultValue(item))

  // 使用深拷贝创建全新的formConfig对象，确保响应式更新
  formConfig.value = deepClone({
    ...formConfig.value,
    items: styledItems,
  })

  // 更新选中项引用
  selectedItem.value = itemObj
}

// 处理ReForm组件的点击事件
function handleReFormClick(event: FormItemClickEvent | Record<string, any>): void {
  // 获取点击的表单项field值或索引
  const fieldOrIndex = event.detail?.field || event.detail?.item?.field || event.index || event

  // 空值检查
  if (!formConfig.value || !formConfig.value.items || fieldOrIndex === null || fieldOrIndex === undefined) {
    return
  }

  // 获取目标表单项的索引
  let itemIndex = -1
  if (typeof fieldOrIndex === 'number') {
    itemIndex = fieldOrIndex
  }
  else {
    // 按字段名查找索引
    itemIndex = formConfig.value.items.findIndex(item => item.field === fieldOrIndex)
  }

  // 验证索引有效性
  if (itemIndex < 0 || itemIndex >= formConfig.value.items.length) {
    return
  }

  // 更新选中状态
  selectedItemIndex.value = itemIndex
  selectedItem.value = deepClone(formConfig.value.items[itemIndex])

  // 应用选中样式到所有表单项
  const newItems = applySelectedClass(deepClone(formConfig.value.items), itemIndex)

  // 创建新的formConfig对象，确保响应式更新
  formConfig.value = deepClone({
    ...formConfig.value,
    items: newItems,
  })
}

// 表单提交处理
function handleFormSubmit(values: Record<string, any>): void {
  console.log('表单提交数据:', values)
  // 可以添加自定义的提交逻辑
}

// 删除表单项的处理函数
function handleDeleteItem(): void {
  if (selectedItemIndex.value === null || !formConfig.value) {
    return
  }

  // 创建items数组的新副本
  const newItems = deepClone(formConfig.value.items)
  newItems.splice(selectedItemIndex.value, 1)

  // 重置选中状态
  selectedItem.value = null
  selectedItemIndex.value = null

  // 创建全新的formConfig对象，确保响应式更新
  formConfig.value = deepClone({
    ...formConfig.value,
    items: newItems,
  })
}

// 监听选中项索引变化，自动更新选中项引用
watch(selectedItemIndex, (newIndex: number | null) => {
  if (newIndex !== null && formConfig.value && newIndex < formConfig.value.items.length) {
    selectedItem.value = formConfig.value.items[newIndex]
  }
})

// 组件挂载后，处理初始配置
onMounted((): void => {
  // 如果传入了初始表单配置，则处理并显示
  if (props.initialFormConfig && props.initialFormConfig.items) {
    try {
      // 深拷贝避免直接修改props
      const deserializedConfig = deserializeWithFunctions(JSON.stringify(props.initialFormConfig))
      const initialConfig = deepClone(deserializedConfig)

      // 处理组件引用，确保组件名称被正确映射为组件对象
      if (initialConfig.items && Array.isArray(initialConfig.items)) {
        initialConfig.items.forEach((item) => {
          // 处理组件引用
          if (typeof item.component === 'string') {
            const componentName = item.component.toLowerCase()
            if (componentMap[componentName]) {
              item.component = componentMap[componentName]
            }
          }
          // 初始化自定义类，未选中状态
          item.customClass = ''

          // 处理特殊组件默认值
          processItemDefaultValue(item)
        })
      }

      // 设置表单配置
      formConfig.value = initialConfig
    }
    catch (error) {
      console.error('加载初始表单配置失败:', error)
      ElMessage.error('表单配置格式错误，请检查配置对象')
    }
  }
})

// 获取最终表单配置的函数
function getFormConfigEvent(): string | null {
  // 检查formConfig是否存在
  if (!formConfig.value) {
    return null
  }

  // 创建配置的深拷贝
  const formConfigEvent = deepClone(formConfig.value)

  // 处理items数组中的每个表单项
  if (formConfigEvent.items && Array.isArray(formConfigEvent.items)) {
    formConfigEvent.items.forEach((item) => {
      // 移除内部使用的自定义类
      if (item) {
        delete item.customClass

        // 将组件对象转换为组件名称字符串
        if (item.component && typeof item.component === 'object' && item.component.name) {
          item.component = item.component.name
        }
      }
    })
  }

  // 序列化配置
  return serializeWithFunctions(formConfigEvent)
}

// 暴露方法给外部调用
defineExpose<DesignFormInstance>({
  getFinalFormConfig: getFormConfigEvent,
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
    padding: 24px;
    height: 100%;
    background: #fafafa;
    overflow-y: auto;

    .ap-form-wrapper {
      padding: 16px;
      background: white;
    }

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
