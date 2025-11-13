<!-- renderSlot.vue文件 -->
<template>
  <div style="padding: 16px;">
    <ConfigForm
      :form-options="formOptions"
      :rows="rows"
    >
      <template #customField="{ model, formItem, cellValue }">
        <div style="padding: 8px; border: 2px dashed #409eff; border-radius: 4px; text-align: center;">
          <p style="margin: 0 0 8px 0; color: #409eff; font-weight: bold;">
            自定义插槽内容
          </p>
          <input
            v-model="model[formItem.prop]"
            style="padding: 8px; border: 1px solid #dcdfe6; border-radius: 4px; width: 100%;"
            :placeholder="`自定义输入: ${formItem.label}`"
          >
          <p style="margin: 8px 0 0 0; font-size: 12px; color: #909399;">
            当前值: {{ cellValue || '未输入' }}
          </p>
        </div>
      </template>

      <template #statusSelect="{ model, formItem }">
        <div style="display: flex; gap: 8px; align-items: center;">
          <select
            v-model="model[formItem.prop]"
            style="padding: 8px; border: 1px solid #dcdfe6; border-radius: 4px; flex: 1;"
          >
            <option value="">
              请选择状态
            </option>
            <option value="active">
              激活
            </option>
            <option value="inactive">
              禁用
            </option>
            <option value="pending">
              待审核
            </option>
          </select>
          <span
            :style="{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: getStatusColor(model[formItem.prop]),
            }"
          />
        </div>
      </template>
    </ConfigForm>

    <div style="margin-top: 16px; padding: 12px; background-color: #f5f5f5; border-radius: 4px;">
      <h4 style="margin: 0 0 8px 0;">
        表单数据：
      </h4>
      <pre style="margin: 0; font-size: 12px;">{{ JSON.stringify(formOptions.model, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const formOptions = reactive({
  model: {
    name: '',
    customField: '',
    status: '',
  },
  labelWidth: '120px',
})

const rows = reactive([
  {
    formItems: [
      {
        prop: 'name',
        label: '普通字段',
        type: 'input',
        colConfig: { span: 24 },
        config: {
          placeholder: '请输入姓名',
        },
      },
      {
        prop: 'customField',
        label: '自定义字段',
        renderSlot: 'customField',
        colConfig: { span: 24 },
      },
      {
        prop: 'status',
        label: '状态选择',
        renderSlot: 'statusSelect',
        colConfig: { span: 24 },
      },
    ],
  },
])

function getStatusColor(status: string) {
  const colorMap: Record<string, string> = {
    active: '#67c23a',
    inactive: '#f56c6c',
    pending: '#e6a23c',
  }
  return colorMap[status] || '#dcdfe6'
}
</script>
