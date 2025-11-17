<!-- flex.vue文件 -->
<template>
  <div class="container">
    <ReForm v-bind="formData" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const formData = ref({
  size: 'default',
  layout: 'flex', // grid、flex
  cols: 24,
  items: [
    {
      field: 'id',
      defaultValue: 'just text content',
      type: 'text',
      span: 12,
    },
    {
      field: 'name',
      defaultValue: '测试数据',
      component: ElInput,
      tooltip: '这是tooltip',
      span: 12,
      props: {
        clearable: true,
      },
      rules: [{ required: true, message: '不能为空' }],
    },
    {
      field: 'age',
      component: ElInputNumber,
      defaultValue: 1,
      span: 24,
      props: {
        min: 1,
        max: 9999,
      },
    },
    {
      label: 'Remark',
      field: 'remark',
      component: 'el-textarea',
      props: {
        rows: 4,
      },
    },
    {
      label: 'Birthday',
      field: 'birthday',
      component: ElDatePicker,
      tooltip: '这是tooltip',
      props: {
        type: 'date',
        format: 'YYYY-MM-DD',
        class: 'w-full',
      },
    },
    {
      label: 'Subject',
      field: 'subject',
      component: ElSelect,
      childComp: ElOption,
      tooltip: '这是tooltip',
      tips: '这是说明或者提示',
      rules: [{ required: true, message: '不能为空' }],
      options: [
        {
          label: 'Subject1',
          value: '1',
        },
        {
          label: 'Subject2',
          value: '2',
        },
        {
          label: 'Subject3',
          value: '3',
        },
      ],
      props: {
        clearable: true,
      },
    },
    {
      label: 'Marry',
      field: 'marry',
      component: ElRadioGroup,
      childComp: ElRadio,
      options: [
        {
          label: 'married',
          value: '1',
        },
        {
          label: 'none',
          value: '2',
        },
      ],
      defaultValue: '2',
      props: {
        clearable: true,
      },
    },
    {
      label: 'Hobby',
      field: 'hobby',
      component: ElCheckboxGroup,
      childComp: ElCheckbox,
      labelKey: 'name',
      valueKey: 'id',
      defaultValue: ['1'],
      span: 8,
      options: [
        {
          name: 'hobby1',
          id: '1',
        },
        {
          name: 'hobby2',
          id: '2',
        },
        {
          name: 'hobby3',
          id: '3',
        },
      ],
      props: {
        clearable: true,
      },
    },
  ],
})
</script>

<style scoped>
.container {
  padding: 20px;
}
</style>
