<template>
  <div style="padding: 16px;">
    <ConfigForm
      :form-options="formOptions"
      :rows="rows"
    >
      <div style="padding: 16px; background-color: #f0f9ff; border: 1px solid #b3e5fc; border-radius: 4px; text-align: center; margin: 16px 0;">
        <h3 style="margin: 0 0 8px 0; color: #1976d2;">
          自定义表单内容
        </h3>
        <p style="margin: 0; color: #424242;">
          这是通过默认插槽添加的自定义内容，会替换所有配置的表单项
        </p>

        <div style="margin-top: 16px; text-align: left;">
          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 4px; font-weight: bold;">自定义姓名输入：</label>
            <input
              v-model="formOptions.model.name"
              style="width: 100%; padding: 8px; border: 1px solid #dcdfe6; border-radius: 4px;"
              placeholder="请输入姓名"
            >
          </div>

          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 4px; font-weight: bold;">自定义描述输入：</label>
            <textarea
              v-model="formOptions.model.description"
              style="width: 100%; padding: 8px; border: 1px solid #dcdfe6; border-radius: 4px; resize: vertical;"
              rows="3"
              placeholder="请输入描述"
            />
          </div>

          <div>
            <label style="display: block; margin-bottom: 4px; font-weight: bold;">自定义选项：</label>
            <div style="display: flex; gap: 16px;">
              <label style="display: flex; align-items: center; gap: 4px;">
                <input
                  v-model="formOptions.model.option"
                  type="radio"
                  value="option1"
                >
                选项1
              </label>
              <label style="display: flex; align-items: center; gap: 4px;">
                <input
                  v-model="formOptions.model.option"
                  type="radio"
                  value="option2"
                >
                选项2
              </label>
              <label style="display: flex; align-items: center; gap: 4px;">
                <input
                  v-model="formOptions.model.option"
                  type="radio"
                  value="option3"
                >
                选项3
              </label>
            </div>
          </div>
        </div>
      </div>
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
    description: '',
    option: '',
  },
  labelWidth: '120px',
})

// 注意：当使用默认插槽时，rows 配置会被忽略
const rows = reactive([
  {
    formItems: [
      {
        prop: 'name',
        label: '姓名',
        type: 'input',
        colConfig: { span: 24 },
        config: {
          placeholder: '这个配置会被默认插槽覆盖',
        },
      },
    ],
  },
])
</script>
