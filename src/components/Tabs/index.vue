<template>
  <div class="height-100">
    <el-tabs
      v-model="activeName"
      type="border-card"
      :class="props.tabCard && 'tabs-card'"
      @tab-change="handleTabChange"
    >
      <template v-for="item in props.tabList">
        <el-tab-pane
          style="height: 100%"
          v-if="item.show ? item.show(item) : true"
          :label="item.label"
          :name="item.id"
          :lazy="item.lazy"
          :key="item.id"
        >
          <slot :name="item.slot || item.label"></slot>
        </el-tab-pane>
      </template>
    </el-tabs>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  tabCard: {
    type: Boolean,
    default: true,
  },
  tabList: {
    type: Array<{
      id: string
      label: string
      slot?: string
      lazy?: boolean
      show?: (item: any) => boolean
    }>,
    default: () => [],
  },
})
const activeName = defineModel({ default: '1', type: String })
const emits = defineEmits(['tab-change'])

function handleTabChange(val: any) {
  emits('tab-change', val)
}
</script>

<style scoped lang="scss">
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
  }
}
</style>
