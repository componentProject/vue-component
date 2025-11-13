<!-- setConfigByProp.vue文件 -->
<template>
  <div style="padding: 16px;">
    <ConfigForm
      ref="formRef"
      :rows="rows"
      :form-options="formOptions"
    />

    <div style="margin-top: 16px;">
      <button
        style="padding: 8px 16px; background-color: #67c23a; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 8px;"
        @click="updateCityOptions"
      >
        更新城市选项
      </button>

      <button
        style="padding: 8px 16px; background-color: #e6a23c; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 8px;"
        @click="disableNameInput"
      >
        禁用姓名输入
      </button>

      <button
        style="padding: 8px 16px; background-color: #f56c6c; color: white; border: none; border-radius: 4px; cursor: pointer;"
        @click="enableNameInput"
      >
        启用姓名输入
      </button>
    </div>

    <div style="margin-top: 16px; padding: 12px; background-color: #f5f5f5; border-radius: 4px;">
      <h4 style="margin: 0 0 8px 0;">
        表单数据：
      </h4>
      <pre style="margin: 0; font-size: 12px;">{{ JSON.stringify(formOptions.model, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const formRef = ref()

const formOptions = reactive({
  model: {
    name: '',
    city: '',
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
        colConfig: { span: 24 },
        config: {
          placeholder: '请输入姓名',
        },
      },
      {
        prop: 'city',
        label: '城市',
        type: 'select',
        colConfig: { span: 24 },
        config: {
          placeholder: '请选择城市',
          options: [
            { label: '北京', value: 'beijing' },
            { label: '上海', value: 'shanghai' },
          ],
        },
      },
    ],
  },
])
function updateCityOptions() {
  const newOptions = [
    { label: '北京', value: 'beijing' },
    { label: '上海', value: 'shanghai' },
    { label: '广州', value: 'guangzhou' },
    { label: '深圳', value: 'shenzhen' },
    { label: '杭州', value: 'hangzhou' },
    { label: '成都', value: 'chengdu' },
  ]

  formRef.value.setConfigByProp('city', newOptions, 'options')
}

function disableNameInput() {
  formRef.value.setConfigByProp('name', true, 'disabled')
}

function enableNameInput() {
  formRef.value.setConfigByProp('name', false, 'disabled')
}
</script>
