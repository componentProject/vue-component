<!-- src的示例文件 -->
<template>
  <div class="api-dialog-demo">
    <h2>ApiDialog 对话框演示</h2>
    <div class="demo-actions">
      <ElButton type="primary" @click="showDefaultDialog">
        显示默认对话框
      </ElButton>
      <ElButton type="success" @click="showCustomDialog">
        显示自定义对话框
      </ElButton>
      <ElButton type="warning" @click="showDialogWithSlots">
        显示带自定义插槽的对话框
      </ElButton>
      <ElButton type="info" @click="showDialogWithData">
        显示带数据传递的对话框
      </ElButton>
    </div>
  </div>
</template>

<script lang="tsx" setup>
import { ElButton, ElInput, ElMessage } from 'element-plus'
import CustomDialog from './components/CustomDialog.vue'
import FormDialog from './components/FormDialog.vue'
import { createApiDialog } from './index.tsx'

// 1. 使用默认对话框
const { show: showDefault } = createApiDialog()

// 显示默认对话框
function showDefaultDialog() {
  try {
    showDefault({
      props: {
        title: '默认对话框',
        width: '30%',
      },
      slots: {
        default: '这是通过API调用创建的默认对话框，无需在模板中预先定义',
      },
    }).then((result) => {
      ElMessage.success(`对话框确认: ${JSON.stringify(result)}`)
    }).catch((error) => {
      ElMessage.info(`对话框关闭: ${error.message}`)
    })
  }
  catch (error) {
    ElMessage.error(`发生错误: ${error.message}`)
  }
}

// 2. 使用自定义对话框组件 (CustomDialog.vue)
const { show: showCustom } = createApiDialog(CustomDialog)

// 显示自定义对话框
function showCustomDialog() {
  try {
    showCustom({
      props: {
        title: '自定义对话框',
        data: { id: 1, name: '测试数据' },
      },
    }).then((result) => {
      ElMessage.success(`自定义对话框确认: ${JSON.stringify(result)}`)
    }).catch((error) => {
      ElMessage.info(`自定义对话框关闭: ${error.message}`)
    })
  }
  catch (error) {
    ElMessage.error(`发生错误: ${error.message}`)
  }
}

// 显示带插槽的对话框
function showDialogWithSlots() {
  try {
    showCustom({
      props: {
        title: '带自定义插槽的对话框',
        width: '40%',
      },
      slots: {
        default: () => (
          <div class="custom-content">
            <h3 style="color: #409EFF">自定义内容</h3>
            <p>这是通过JSX方式传入的插槽内容</p>
            <ElInput
              modelValue=""
              placeholder="请输入内容"
              style="margin: 10px 0"
            />
          </div>
        ),
        footer: () => (
          <div class="custom-footer">
            <ElButton type="info">返回</ElButton>
            <ElButton type="success">提交</ElButton>
          </div>
        ),
      },
    }).then(() => {
      ElMessage.success('操作成功')
    }).catch(() => {
      ElMessage.info('对话框已关闭')
    })
  }
  catch (error) {
    ElMessage.error(`发生错误: ${error.message}`)
  }
}

// 显示带数据传递的对话框
function showDialogWithData() {
  // 使用导入的FormDialog组件
  const { show } = createApiDialog(FormDialog)

  try {
    show({
      props: {
        title: '请填写用户信息',
      },
    }).then((formResult) => {
      ElMessage.success(`表单提交成功: ${JSON.stringify(formResult)}`)
    }).catch(() => {
      ElMessage.info('表单已取消')
    })
  }
  catch (error) {
    ElMessage.error(`发生错误: ${error.message}`)
  }
}
</script>

<style scoped>
.api-dialog-demo {
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.demo-actions {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #303133;
}

.custom-content {
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background-color: #f5f7fa;
}
</style>
