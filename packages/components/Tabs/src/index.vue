<template>
  <div class="h-full bg-white">
    <ElTabs
      v-model="activeName"
      :type="props.type"
      :class="props.type === 'border-card' && 'tabs-card'"
      @tab-change="handleTabChange"
    >
      <template v-for="item in props.tabList">
        <ElTabPane
          v-if="item.show ? item.show(item) : true"
          :key="item.label"
          style="height: 100%"
          v-bind="item"
        >
          <slot :name="item.slot || item.label" />
        </ElTabPane>
      </template>
    </ElTabs>
  </div>
</template>

<script setup lang="ts">
import { ElTabPane, ElTabs } from 'element-plus'
import type { emitsType, propsType, slotsType } from './_types'

defineOptions({
  name: 'Tabs',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<propsType>(), {
  tabList: () => [],
  type: '',
})

const emit = defineEmits<emitsType>()

// 获取插槽
const slots = defineSlots<slotsType>()

const activeName = defineModel({ default: '0', type: String })

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
.tabs-card {
  background: #fff;
  border-radius: 8px !important;
  overflow: hidden;
  box-shadow: 2px 2px 10px 0 rgb(52 81 212 / 20%);
  height: 100%;

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
