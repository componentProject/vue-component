<template>
  <div class="h-full bg-white">
    <ElTabs
      v-model="activeName"
      :type="props.type"
      :class="props.type === 'border-card' && 'tabs-card'"
      @tab-change="handleTabChange"
    >
      <ElTabPane
        v-for="item in filteredOptions"
        :key="item[computedValue]"
        :label="item[computedLabel]"
        :name="item[computedValue]"
        :disabled="
          computedDisabledHandler({
            label: item[computedLabel],
            value: item[computedValue],
            data: item,
          })
        "
        style="height: 100%"
        v-bind="item"
      >
        <slot name="default" :item="item" />
        <slot :name="item.slot || item[computedLabel]" />
      </ElTabPane>
    </ElTabs>
  </div>
</template>

<script setup lang="ts">
import { computed, withDefaults } from 'vue'
import { ElTabPane, ElTabs } from 'element-plus'
import { getTypeDefault } from '@moluoxixi/utils/_utils'
import { useOptions } from '../../_hooks'
import type { emitsType, propsType, slotsType } from './_types'

defineOptions({
  name: 'Tabs',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<propsType>(), {
  tabList: () => [],
  type: '',
  // 新增的 options 模式默认值
  options: () => [],
  label: 'label',
  value: 'name',
  disabledValues: () => [],
  disabledLabels: () => [],
  requestMethod: 'POST',
  requestUrl: '',
  requestParams: () => ({}),
  requestParamsType: 'body',
  requestHeaders: () => ({}),
  responseDataPath: '',
})

const emit = defineEmits<emitsType>()

// 获取插槽
const slots = defineSlots<slotsType>()

const activeName = defineModel({ default: '0', type: String })

// 计算字段名
const computedLabel = computed(() => props.labelKey || props.label)
const computedValue = computed(() => props.valueKey || props.value)

// 使用 useOptions hook 来处理 options 获取逻辑
const { options: serverOrLocalOptions } = useOptions(props)

// 过滤 options
const filteredOptions = computed(() => {
  if (props.tabList?.length) {
    return props.tabList?.filter(item => item.show ? item.show(item) : true) || []
  }
  else {
    return serverOrLocalOptions.value.filter(item => item.show ? item.show(item) : true)
  }
})

// 默认禁用处理函数
function defaultDisabledHandler({ label, value }: { [label: string]: any }) {
  return props.disabledValues.includes(value) || props.disabledLabels.includes(label)
}

const computedDisabledHandler = computed(() => {
  return getTypeDefault(props.disabledHandler, 'function') || defaultDisabledHandler
})

function handleTabChange(val: any) {
  emit('tabChange', val)
}
</script>

<style scoped>
@import 'element-plus/theme-chalk/el-tabs.css';

:deep(*) {
  @import 'element-plus/theme-chalk/el-tabs.css';
}
</style>

<style scoped lang="scss">
@forward '@moluoxixi/components/_assets/styles/tailwind.scss';
.el-tabs {
  height: 100%;
}
.tabs-card {
  background: #fff;
  border-radius: 8px !important;
  overflow: hidden;
  box-shadow: 2px 2px 10px 0 rgb(52 81 212 / 20%);

  &.no-shadow {
    box-shadow: none;
  }

  :deep(.el-tabs__header) {
    background: #fafbfc !important;
  }

  :deep(.el-tabs__content) {
    height: calc(100% - 40px);
    padding: 0 !important;
  }

  :deep(.el-tabs__item) {
    margin-left: 0 !important;
    margin-top: 0 !important;
    border-bottom: none !important;
  }

  :deep(.el-tabs__nav .is-active) {
    border-radius: 8px 8px 0 0;
    border: 1px solid var(--el-color-primary) !important;
    border-bottom: none !important;
    background-color: #fff;
  }

  :deep(.tabs-normal .el-tabs__nav .is-active) {
    border-radius: 0 !important;
    border-bottom: none !important;
    border-color: #dcdfe6 !important;
  }

  :deep(.tabs-normal .el-tabs__header) {
    background: #f5f7fa !important;
  }

  :deep(.tabs-normal .el-tabs__item) {
    margin-left: -1px !important;
    margin-top: -1px !important;
    border-bottom: none !important;

    // background-color: #fff;
  }
}
</style>
