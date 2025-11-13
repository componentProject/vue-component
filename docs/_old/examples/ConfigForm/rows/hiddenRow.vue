<!-- hiddenRow.vue文件 -->
<template>
  <div style="padding: 16px;">
    <div style="margin-bottom: 16px;">
      <label style="margin-right: 8px;">
        <input
          v-model="showAdvanced"
          type="checkbox"
          style="margin-right: 4px;"
        >
        显示高级选项
      </label>
    </div>

    <ConfigForm
      :form-options="formOptions"
      :rows="rows"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const showAdvanced = ref(false)

const formOptions = reactive({
  model: {
    name: '',
    email: '',
    advancedOption1: '',
    advancedOption2: '',
  },
  labelWidth: '120px',
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
        prop: 'email',
        label: '邮箱',
        type: 'input',
        colConfig: { span: 12 },
        config: {
          placeholder: '请输入邮箱',
        },
      },
    ],
  },
  {
    hidden: () => !showAdvanced.value,
    formItems: [
      {
        prop: 'advancedOption1',
        label: '高级选项1',
        type: 'input',
        colConfig: { span: 12 },
        config: {
          placeholder: '请输入高级选项1',
        },
      },
      {
        prop: 'advancedOption2',
        label: '高级选项2',
        type: 'input',
        colConfig: { span: 12 },
        config: {
          placeholder: '请输入高级选项2',
        },
      },
    ],
  },
])
</script>
