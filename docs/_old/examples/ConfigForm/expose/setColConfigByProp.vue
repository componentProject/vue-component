<!-- setColConfigByProp.vue文件 -->
<template>
  <div style="padding: 16px;">
    <ConfigForm
      ref="formRef"
      :rows="rows"
      :form-options="formOptions"
    />

    <div style="margin-top: 16px;">
      <button
        style="padding: 8px 16px; background-color: #409eff; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 8px;"
        @click="changeLayout1"
      >
        布局1：全宽度
      </button>

      <button
        style="padding: 8px 16px; background-color: #67c23a; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 8px;"
        @click="changeLayout2"
      >
        布局2：半宽度
      </button>

      <button
        style="padding: 8px 16px; background-color: #e6a23c; color: white; border: none; border-radius: 4px; cursor: pointer;"
        @click="changeLayout3"
      >
        布局3：三分之一
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const formRef = ref()

const formOptions = reactive({
  model: {
    field1: '',
    field2: '',
    field3: '',
  },
  labelWidth: '100px',
})

const rows = reactive([
  {
    formItems: [
      {
        prop: 'field1',
        label: '字段1',
        type: 'input',
        colConfig: { span: 24 },
        config: {
          placeholder: '字段1',
        },
      },
      {
        prop: 'field2',
        label: '字段2',
        type: 'input',
        colConfig: { span: 24 },
        config: {
          placeholder: '字段2',
        },
      },
      {
        prop: 'field3',
        label: '字段3',
        type: 'input',
        colConfig: { span: 24 },
        config: {
          placeholder: '字段3',
        },
      },
    ],
  },
])

function changeLayout1() {
  // 设置为全宽度
  formRef.value.setColConfigByProp('field1', 24, 'span')
  formRef.value.setColConfigByProp('field2', 24, 'span')
  formRef.value.setColConfigByProp('field3', 24, 'span')
}

function changeLayout2() {
  // 设置为半宽度
  formRef.value.setColConfigByProp('field1', 12, 'span')
  formRef.value.setColConfigByProp('field2', 12, 'span')
  formRef.value.setColConfigByProp('field3', 12, 'span')
}

function changeLayout3() {
  // 设置为三分之一宽度
  formRef.value.setColConfigByProp('field1', 8, 'span')
  formRef.value.setColConfigByProp('field2', 8, 'span')
  formRef.value.setColConfigByProp('field3', 8, 'span')
}
</script>
