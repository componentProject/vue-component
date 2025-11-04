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
import { ref, watch } from 'vue'
import { ElButton, ElMessageBox } from 'element-plus'
import { formItemConfig as defaultFormItemConfig } from '../datas/formData'
import { deepClone } from '../utils/formSerializer'
import { debounce } from 'lodash'
import type {
  ComponentInstance,
  FormConfig,
  FormConfigData,
  FormRule,
  ItemProps,
  ReFormInstance,
  SelectedItem,
  TabItem,
} from '../types'

// 定义组件属性
const props = defineProps<{
  selectedItemIndex?: number
  formConfig?: FormConfig | null
  selectedItem?: SelectedItem | null | undefined
}>()

// 定义事件
const emits = defineEmits<{
  (e: 'update:formConfig', config: FormConfigData): void
  (e: 'update:selectedItem', item: FormConfigData): void
  (e: 'deleteItem'): void
}>()

// 组件内部状态
const activeTab = ref<string>('form')
const tabList: TabItem[] = [
  { label: '组件配置', name: 'component' },
  { label: '表单配置', name: 'form' },
]

const formData = ref<FormConfigData>({})
const formItemConfigRef = ref<ReFormInstance | null>(null)
const formConfigRef = ref<ReFormInstance | null>(null)

// 表单配置数据（深拷贝避免修改原始数据）
const formConfigData = ref<FormConfig | null>(null)
// 表单项配置（深拷贝）
const formItemConfig = ref<any>(deepClone(defaultFormItemConfig))

// 监听外部表单配置变化
watch(
  () => props.selectedItemIndex,
  (newIndex: number | undefined) => {
    if (newIndex !== undefined) {
      formItemConfig.value = deepClone(defaultFormItemConfig)
    }
  },
  { immediate: true },
)

// 监听外部表单配置变化
watch(
  () => props.formConfig,
  (newConfig: FormConfig | null | undefined) => {
    if (newConfig) {
      formConfigData.value = { ...newConfig }
    }
  },
  { immediate: true },
)

// 监听选中项变化，自动切换到组件配置标签
watch(
  () => props.selectedItem,
  (newItem: SelectedItem | null | undefined) => {
    if (newItem) {
      setFormItemConfig(newItem)
      activeTab.value = 'component'
    }
    else {
      activeTab.value = 'form'
    }
  },
  { immediate: true },
)

// 根据添加的组件设置表单项配置
function setFormItemConfig(item: SelectedItem | null | undefined): void {
  // 添加空值检查
  if (!item || typeof item !== 'object') {
    return
  }

  // 创建新的配置对象
  const itemObj: FormConfigData = {}

  // 一次性收集所有属性
  Object.keys(item).forEach((key: string) => {
    if (key === 'component') {
      const componentInstance = item[key] as ComponentInstance
      const isObjectComponent = typeof componentInstance === 'object'
      console.log('isObjectComponent', isObjectComponent)
      if (isObjectComponent) {
        if (componentInstance.name === 'ElInput' && item?.props?.type === 'textarea') {
          itemObj[key] = 'ElTextarea'
        }
        else {
          itemObj[key] = componentInstance.name
        }
      }
      else {
        itemObj[key] = componentInstance
      }
    }
    else if (key === 'props') {
      const propsObj = item[key] as ItemProps
      Object.keys(propsObj).forEach((propKey: string) => {
        if (propKey === 'options' || propKey === 'requestParams') {
          try {
            itemObj[propKey] = propsObj[propKey] !== undefined && propsObj[propKey] !== null && propsObj[propKey] !== '' ? JSON.stringify(propsObj[propKey]) : undefined
          }
          catch (error) {
            // 处理JSON序列化错误
            console.error(`序列化${propKey}失败:`, error)
            itemObj[propKey] = undefined
          }
        }
        else {
          itemObj[propKey] = propsObj[propKey]
        }
      })
    }
    else if (key === 'rules') {
      // 确保rules是数组类型
      if (Array.isArray(item[key])) {
        const rulesArray = item[key] as FormRule[]
        rulesArray.forEach((rule: FormRule) => {
          if (rule && typeof rule === 'object') {
            Object.keys(rule).forEach((propKey: string) => {
              if (propKey === 'validator') {
                const validatorValue = rule[propKey]
                // 根据类型处理不同情况
                if (typeof validatorValue === 'function') {
                  itemObj[propKey] = validatorValue.toString()
                }
                else {
                  // 已经是字符串或其他类型，直接赋值
                  itemObj[propKey] = validatorValue
                }
              }
              else {
                itemObj[propKey] = rule[propKey]
              }
            })
          }
        })
      }
    }
    else {
      itemObj[key] = item[key]
    }
  })
  // 一次性赋值，避免多次更新导致的重复渲染
  formData.value = itemObj
}

// 创建防抖的更新函数，延迟300ms执行
const debouncedUpdateSelectedItem = debounce((data: FormConfigData) => {
  emits('update:selectedItem', data)
}, 300)

// 创建防抖的表单配置更新函数，延迟300ms执行
const debouncedUpdateFormConfig = debounce((data: FormConfigData) => {
  emits('update:formConfig', data)
}, 300)

// 表单项配置实时变化
function handleItemConfigChange(): void {
  // 确保formItemConfigRef和formData存在
  if (formItemConfigRef.value && formItemConfigRef.value.formData) {
    debouncedUpdateSelectedItem(formItemConfigRef.value.formData)
  }
}

// 表单配置实时变化
function handleFormConfigChange(): void {
  // 确保formConfigRef和formData存在
  if (formConfigRef.value && formConfigRef.value.formData) {
    debouncedUpdateFormConfig(formConfigRef.value.formData)
  }
}

// 删除表单项
function handleDeleteItem(): void {
  if (props.selectedItem) {
    ElMessageBox.confirm('确定要删除当前表单项吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    }).then(() => {
      emits('deleteItem')
    }).catch(() => {
      // 用户取消删除，无需处理
    })
  }
}

// 获取表单配置数据
function getFormData(): FormConfigData | null {
  // 确保formConfigRef及其value存在
  if (!formConfigRef.value) {
    return null
  }
  return formConfigRef.value.formData || null
}

// 暴露方法给外部调用
defineExpose({
  getFormData,
  // 符合ReForm标准的回调函数形式的验证方法
  validate(callback?: (valid: boolean) => void): boolean {
    // 确保formItemConfigRef及其value和validate方法存在
    if (formItemConfigRef.value && typeof formItemConfigRef.value.validate === 'function') {
      return formItemConfigRef.value.validate(callback)
    }
    return false
  },
})
</script>

<style lang="scss" scoped>
.design-form-rules {
  height: 100%;

  .config-section {
    height: 100%;
  }

  .empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 300px;
    color: #999;
  }

  #pane-component {
    position: relative;
    padding-bottom: 40px;
  }

  .item-actions {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: white;
    padding: 10px;
  }

  :deep(#pane-component) {
    .ap-form-wrapper {
      padding-bottom: 40px;
    }
  }

  // 标签样式
  :deep(.el-tabs__nav) {
    width: 100%;

    .el-tabs__item {
      flex: 1;
    }
  }

  // 标签容器样式
  :deep(.el-tabs) {
    height: 100%;
    overflow: hidden;
  }

  // 标签内容样式
  :deep(.el-tabs__content) {
    .el-tab-pane {
      padding: 16px;
      overflow-x: auto;
    }
  }
}
</style>
