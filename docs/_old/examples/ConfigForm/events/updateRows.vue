<!-- updateRows.vue文件 -->
<template>
  <div style="padding: 16px;">
    <ConfigForm
      :form-options="formOptions"
      :rows="rows"
      @update:rows="handleUpdateRows"
    />

    <div style="margin-top: 16px; padding: 12px; background-color: #f0f9ff; border: 1px solid #b3e5fc; border-radius: 4px;">
      <h4 style="margin: 0 0 8px 0; color: #1976d2;">
        更新事件日志：
      </h4>
      <div v-for="(log, index) in updateLogs" :key="index" style="margin: 4px 0; font-size: 12px; color: #424242;">
        {{ log }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const updateLogs = ref<string[]>([])

const formOptions = reactive({
  model: {
    name: '',
    status: '',
  },
  labelWidth: '100px',
})

const rows = reactive([
  {
    formItems: [
      {
        prop: 'name',
        label: '姓名',
        type: 'input',
        colConfig: { span: 12 },
        config: {
          placeholder: '请输入姓名',
        },
      },
      {
        prop: 'status',
        label: '状态',
        type: 'select',
        colConfig: { span: 12 },
        config: {
          placeholder: '请选择状态',
          options: [
            { label: '激活', value: 'active' },
            { label: '禁用', value: 'inactive' },
          ],
        },
      },
    ],
  },
])

function handleUpdateRows(newRows: any) {
  const timestamp = new Date().toLocaleTimeString()
  updateLogs.value.unshift(`${timestamp}: rows 数据已更新`)

  // 保持日志数量在合理范围内
  if (updateLogs.value.length > 10) {
    updateLogs.value = updateLogs.value.slice(0, 10)
  }

  Object.assign(rows, newRows)
}
</script>
