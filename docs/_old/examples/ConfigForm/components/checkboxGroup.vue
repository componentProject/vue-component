<!-- checkboxGroup.vue的checkboxGroup组件 -->
<template>
  <div style="padding: 16px;">
    <ConfigForm
      :form-options="formOptions"
      :rows="rows"
    />

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
    hobbies: [],
    permissions: [],
    features: [],
  },
  labelWidth: '120px',
})

const rows = reactive([
  {
    formItems: [
      {
        prop: 'hobbies',
        label: '兴趣爱好',
        type: 'checkbox-group',
        colConfig: { span: 24 },
        config: {
          checkboxs: [
            { label: '读书', value: 'reading' },
            { label: '运动', value: 'sports' },
            { label: '音乐', value: 'music' },
            { label: '旅行', value: 'travel' },
            { label: '电影', value: 'movies' },
          ],
        },
      },
      {
        prop: 'permissions',
        label: '权限设置',
        type: 'checkbox-group',
        colConfig: { span: 24 },
        config: {
          checkboxs: [
            { label: '查看', value: 'view' },
            { label: '编辑', value: 'edit' },
            { label: '删除', value: 'delete' },
            { label: '管理', value: 'manage' },
          ],
        },
      },
      {
        prop: 'features',
        label: '功能选择',
        type: 'checkbox-group',
        colConfig: { span: 24 },
        config: {
          checkboxs: [
            { label: '邮件通知', value: 'email' },
            { label: '短信通知', value: 'sms' },
            { label: '微信通知', value: 'wechat' },
            { label: '系统通知', value: 'system' },
          ],
        },
      },
    ],
  },
])
</script>
