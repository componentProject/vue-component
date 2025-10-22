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
import { ElButton, ElMessageBox } from 'element-plus'
import Tabs from '@moluoxixi/components/Tabs'
import ReForm from '@moluoxixi/components/ReForm'
import { formItemConfig as defaultFormItemConfig } from '../datas/formData'
import { deepClone } from '../utils/formSerializer'
import { debounce } from 'lodash'

const props = defineProps<{
  selectedItemIndex?: number
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
  () => props.selectedItemIndex,
  (newIndex) => {
    if (newIndex !== undefined) {
      formItemConfig.value = deepClone(defaultFormItemConfig)
    }
  },
  { immediate: true },
)

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
    else {
      activeTab.value = 'form'
    }
  },
  { immediate: true },
)

// 根据添加的组件设置表单项配置
function setFormItemConfig(item: any) {
  // 添加空值检查
  if (!item || typeof item !== 'object') {
    return
  }
  // 创建新的配置对象
  const itemObj: any = {}
  // 一次性收集所有属性
  Object.keys(item).forEach((key) => {
    if (key === 'component') {
      if (item[key].name === 'ElInput' && item?.props?.type === 'textarea') {
        itemObj[key] = 'ElTextarea'
      }
      else {
        itemObj[key] = item[key].name
      }
    }
    else if (key === 'props') {
      Object.keys(item[key]).forEach((propKey) => {
        if (propKey === 'options' || propKey === 'requestParams') {
          itemObj[propKey] = JSON.stringify(item[key][propKey]) || null
        }
        else {
          itemObj[propKey] = item[key][propKey]
        }
      })
    }
    else if (key === 'rules') {
      item[key].forEach((rule: any) => {
        if (rule) {
          Object.keys(rule).forEach((propKey) => {
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
    else {
      itemObj[key] = item[key]
    }
  })
  // 一次性赋值，避免多次更新导致的重复渲染
  formData.value = itemObj
}

// 创建防抖的更新函数，延迟300ms执行
const debouncedUpdateSelectedItem = debounce((data: any) => {
  emits('update:selectedItem', data)
}, 300)

// 创建防抖的表单配置更新函数，延迟300ms执行
const debouncedUpdateFormConfig = debounce((data: any) => {
  emits('update:formConfig', data)
}, 300)

// 表单项配置实时变化
function handleItemConfigChange() {
  debouncedUpdateSelectedItem(formItemConfigRef.value.formData)
}

// 表单配置实时变化
function handleFormConfigChange() {
  debouncedUpdateFormConfig(formConfigRef.value.formData)
}

// 删除表单项
function handleDeleteItem() {
  if (props.selectedItem) {
    ElMessageBox.confirm('确定要删除当前表单项吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    }).then(async () => {
      emits('deleteItem')
    }).catch(() => {})
  }
}

function getFormData() {
  return formConfigRef?.value?.formData || null
}

defineExpose({
  getFormData,
  // 修改为符合ReForm标准的回调函数形式
  validate: (callback) => {
    return formItemConfigRef?.value?.validate(callback)
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
