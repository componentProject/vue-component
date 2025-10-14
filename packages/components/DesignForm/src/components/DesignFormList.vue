<template>
  <div class="design-form-list-main">
    <ElMenu
      class="el-menu-vertical-demo"
      @select="handleClick"
    >
      <ElMenuItem v-for="item in sourceObj" :key="item.value" :index="item.value">
        {{ item.label }}
      </ElMenuItem>
    </ElMenu>
  </div>
</template>

<script setup lang="ts">
import { ElMenu, ElMenuItem } from 'element-plus'

defineOptions({ name: 'DesignFormList' })

// 事件定义
const emits = defineEmits<{
  (e: 'addFormItem', values: any): void
}>()

const sourceObj = ref([
  {
    value: 'elInput',
    label: '输入框',
  },
  {
    value: 'eltextarea',
    label: '多行输入框',
  },
  {
    value: 'elinputnumber',
    label: '数字输入框',
  },
  {
    value: 'elselect',
    label: '下拉框',
  },
  {
    value: 'elcheckboxgroup',
    label: '多选',
  },
  {
    value: 'elradiogroup',
    label: '单选',
  },
])

function handleClick(key: string) {
  emits('addFormItem', key)
}
</script>

<style lang="scss" scoped>
.design-form-list-main {
  height: 100%;
  text-align: center;

  :deep(.el-menu) {
    border: none;

    .el-menu-item {
      display: block;
      height: 40px;
      line-height: 40px;
      text-align: center;
    }
  }
}

.design-form-list-item {
  padding: 12px 0;
}
</style>
