<!-- _AllTestOrNoPublishComponents的示例文件 -->
<template>
  <DesignForm v-bind="initialFormConfig" />
</template>

<script setup lang="ts">
import DesignForm from './index.vue'

const initialFormConfig = {
  formName: '',
  formCode: '',
  size: 'default',
  layout: 'grid',
  colGap: 16,
  labelPosition: 'right',
  labelWidth: 120,
  scrollToError: true,
  hideBtns: true,
  submitBtnText: '确定',
  cancelBtnText: '取消',
  items: [
    {
      label: '输入框',
      component: 'ElInput',
      props: { clearable: true, disabled: false, maxlength: '3' },
      field: 'elInput_1761034725634_159',
      labelWidth: '200',
      tooltip: '这是一个提示',
      tips: '底部说明信息',
      defaultValue: '10',
      rules: [{
        required: true,
        message: '输入框不能为空哦',
        trigger: ['blur', 'change'],
      }, {
        validator: '[FUNCTION](rule, value, callback, form) => { if (value>10) { callback(new Error("该字段不能大于10")); } else { callback(); } }',
        trigger: ['blur', 'change'],
      }],
    },
    {
      label: '多行输入框',
      component: 'ElInput',
      props: { type: 'textarea', disabled: true },
      field: 'eltextarea_1761034726283_507',
      rules: [{ required: false, message: '不能为空', trigger: ['blur', 'change'] }],
    },
    {
      label: '输入框数字',
      component: 'ElInputNumber',
      props: { clearable: true, disabled: false },
      field: 'elInput_1761034725307_284',
      rules: [{ required: false, message: '不能为空', trigger: ['blur', 'change'] }],
    },
    {
      label: '下拉框',
      component: 'TsSelect',
      props: {
        clearable: true,
        filterable: true,
        labelKey: 'name',
        valueKey: 'id',
        requestUrl: '/ompBase/upgServices',
        requestMethod: 'GET',
        requestParams: { applicationId: 2, pageNo: 1, pageSize: 999 },
        responseDataPath: 'rows',
      },
      field: 'tsselect_1761034727885_611',
      dataType: true,
      rules: [{ required: false, message: '不能为空', trigger: ['blur', 'change'] }],
    },
    {
      label: '多选',
      component: 'TsCheckbox',
      props: {
        options: [{ label: '多选1', value: '1' }, { label: '多选2', value: '2' }],
        clearable: true,
        requestParams: null,
      },
      field: 'tscheckbox_1761034729144_945',
      dataType: false,
      defaultValue: ['1', '2'],
      rules: [{ required: false, message: '不能为空', trigger: ['blur', 'change'] }],
    },
    {
      label: '单选',
      component: 'TsRadio',
      props: { options: [{ label: '单选1', value: '1' }, { label: '单选2', value: '2' }] },
      field: 'tsradio_1761123562740_267',
      dataType: false,
      defaultValue: '1',
      rules: [{ required: false, message: '不能为空', trigger: ['blur', 'change'] }],
    },
  ],
}
</script>

<style scoped>

</style>
