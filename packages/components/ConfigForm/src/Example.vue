<template>
  <div class="config-form-example">
    <h3>配置表单示例</h3>
    <div class="example-container">
      <ConfigForm
        ref="configFormRef"
        :form-result="formResult"
        :all-form-list="formList"
        :global-config="globalConfig"
        @change="handleFormChange"
      />
      <div class="btn-list">
        <ElButton type="primary" @click="handleReset">
          重置表单
        </ElButton>
        <ElButton type="primary" @click="handleGetData">
          获取数据
        </ElButton>
        <ElButton type="primary" @click="handleValidate">
          校验表单
        </ElButton>
      </div>
    </div>
    <div v-if="formData" class="data-display">
      <h4>表单数据：</h4>
      <pre>{{ JSON.stringify(formData, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElButton, ElMessage } from 'element-plus'
import ConfigForm from './index.vue'

const configFormRef = ref()
const formResult = ref<Record<string, any>>({})
const formData = ref<Record<string, any>>({})

// 示例表单配置列表
const formList = ref([
  {
    ControlType: 'Text',
    nameCn: '文本框',
    id: 'text_1',
    layout: false,
    show: true,
    data: {
      fieldName: 'username',
      label: '用户名',
      tip: '请输入用户名',
      placeholder: '请输入用户名',
      showRule: '{}',
      required: true,
      rule: '[]',
      default: '',
    },
  },
  {
    ControlType: 'TextArea',
    nameCn: '多行文本',
    id: 'textarea_1',
    layout: false,
    show: true,
    data: {
      fieldName: 'description',
      label: '描述',
      tip: '请输入描述信息',
      placeholder: '请输入描述',
      showRule: '{}',
      required: false,
      rule: '[]',
      default: '',
    },
  },
  {
    ControlType: 'Selected',
    nameCn: '下拉选择',
    id: 'select_1',
    layout: false,
    show: true,
    data: {
      fieldName: 'gender',
      label: '性别',
      tip: '请选择性别',
      placeholder: '请选择',
      showRule: '{}',
      required: true,
      rule: '[]',
      default: '',
      itemConfig: {
        value: '',
        items: [
          { label: '男', value: 'male' },
          { label: '女', value: 'female' },
        ],
      },
    },
  },
  {
    ControlType: 'Radio',
    nameCn: '单选框',
    id: 'radio_1',
    layout: false,
    show: true,
    data: {
      fieldName: 'status',
      label: '状态',
      tip: '请选择状态',
      showRule: '{}',
      required: true,
      rule: '[]',
      default: '',
      itemConfig: {
        value: '',
        items: [
          { label: '启用', value: 'enabled' },
          { label: '禁用', value: 'disabled' },
        ],
      },
    },
  },
])

const globalConfig = ref({
  size: 'default',
})

function handleFormChange() {
  console.log('表单数据变化:', formResult.value)
  formData.value = { ...formResult.value }
}

function handleReset() {
  if (configFormRef.value) {
    configFormRef.value.reset()
    formResult.value = {}
    formData.value = {}
    ElMessage.success('表单已重置')
  }
}

function handleGetData() {
  formData.value = { ...formResult.value }
  ElMessage.success('数据已获取，请查看下方显示区域')
  console.log('表单数据:', formResult.value)
}

async function handleValidate() {
  if (configFormRef.value) {
    try {
      const isValid = await configFormRef.value.getValidate()
      if (isValid) {
        ElMessage.success('表单验证通过')
      }
      else {
        ElMessage.warning('表单验证失败，请检查表单字段')
      }
    }
    catch (error) {
      ElMessage.error('表单验证出错')
      console.error('验证错误:', error)
    }
  }
}
</script>

<style scoped lang="scss">
.config-form-example {
  padding: 20px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;

  h3 {
    margin-bottom: 20px;
    font-size: 18px;
    font-weight: bold;
  }

  .example-container {
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;

    .btn-list {
      padding: 15px;
      border-top: 1px solid #e4e7ed;
      background: #f5f7fa;
      display: flex;
      gap: 10px;
      justify-content: center;
    }
  }

  .data-display {
    margin-top: 20px;
    padding: 15px;
    background: #f5f7fa;
    border-radius: 4px;
    max-height: 400px;
    overflow: auto;

    h4 {
      margin-bottom: 10px;
      font-size: 14px;
      font-weight: bold;
    }

    pre {
      margin: 0;
      padding: 10px;
      background: #fff;
      border-radius: 4px;
      font-size: 12px;
      line-height: 1.5;
      overflow: auto;
    }
  }
}
</style>
