<!-- group.vue文件 -->
<template>
  <div class="container">
    <ReForm v-bind="formData" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const formData = ref({
  size: 'default',
  items: [
    {
      label: 'Name',
      field: 'name',
      defaultValue: '',
      component: ElInput,
      tooltip: '这是tooltip',
      props: {
        clearable: true,
      },
      rules: [{ required: true, message: '不能为空' }],
    },
    {
      label: 'Age',
      field: 'age',
      defaultValue: 3,
      component: ElInput,
    },
    {
      type: 'group',
      field: 'extra', // 单纯为了一个唯一值，所以一定要配置，不记录表单数据
      defaultCollapsed: true, // 默认展开/收起
      collapsedText: '更多配置', // ['展开更多配置', '收起更多配置']
      labelPosition: 'right', // ['left', 'right']
      collapsedTriggerIndex: true, // 触发器缩进 - label-position === 'left' / 'right' 需要控制
      component: '',
      children: [
        {
          label: 'Age3',
          field: 'age3',
          defaultValue: 3,
          component: ElInput,
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
            format: 'YYYY/MM/DD',
          },
        },
        {
          label: 'Subject',
          field: 'subject',
          component: ElSelect,
          tooltip: '这是tooltip',
          tips: '这是显眼的tips',
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
          rules: [{ required: true, message: '不能为空' }],
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
          defaultValue: ['1'],
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
      ],
    },
    {
      label: '随意发挥',
      field: 'easygoing',
      defaultValue: '',
      component: 'el-textarea',
      tooltip: '这是tooltip',
      props: {
        rows: 4,
      },
      rules: [{ required: true, message: '不能为空' }],
    },
  ],
})
</script>

<style scoped>
.container {
  padding: 20px;
}
</style>
