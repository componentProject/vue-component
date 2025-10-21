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
import { ref } from 'vue'
import { ElMenu, ElMenuItem } from 'element-plus'

defineOptions({ name: 'DesignFormList' })

// 定义事件
const emits = defineEmits<{
  (e: 'addFormItem', componentKey: string): void
}>()

// 组件列表数据
const sourceObj = ref([
  { value: 'elInput', label: '输入框' },
  { value: 'eltextarea', label: '多行输入框' },
  { value: 'elinputnumber', label: '数字输入框' },
  { value: 'tsselect', label: '下拉框' },
  { value: 'elcheckboxgroup', label: '多选' },
  { value: 'elradiogroup', label: '单选' },
  // 可以根据需要添加更多组件类型
])

// 处理组件选择
function handleClick(key: string) {
  emits('addFormItem', key)
  console.log('选择了组件:', key)
}
</script>

<style lang="scss" scoped>
.design-form-list-main {
  height: 100%;
  display: flex;
  flex-direction: column;

  .list-header {
    padding: 12px 16px;
    border-bottom: 1px solid #f0f0f0;
    background-color: #fafafa;

    h3 {
      margin: 0;
      font-size: 14px;
      font-weight: 500;
      color: #333;
    }
  }

  :deep(.el-menu) {
    border: none;
    flex: 1;
    overflow-y: auto;

    .el-menu-item {
      display: block;
      height: 40px;
      line-height: 40px;
      text-align: center;
      transition: all 0.3s;

      &:hover {
        background-color: #f5f7fa;
        color: #409eff;
      }
    }
  }
}

.design-form-list-item {
  padding: 12px 0;
}
</style>
