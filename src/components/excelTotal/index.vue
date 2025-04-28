<template>
  <div class="excel-total">
    <el-dialog
      v-model="configDialogVisible"
      title="Excel列配置"
      width="800px"
    >
      <config-table v-model="excelConfig" />
      <template #footer>
        <el-button @click="configDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveConfig">保存</el-button>
      </template>
    </el-dialog>

    <el-button @click="configDialogVisible = true">编辑配置</el-button>
    <el-upload
      class="upload-demo"
      action="#"
      :auto-upload="false"
      :on-change="handleEnterFileChange"
    >
      <el-button type="primary">上传进车记录</el-button>
    </el-upload>
    <el-upload
      class="upload-demo"
      action="#"
      :auto-upload="false"
      :on-change="handleFeeFileChange"
    >
      <el-button type="primary">上传收费记录</el-button>
    </el-upload>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { UploadFile } from 'element-plus'
import { parseEnterRecords, parseFeeRecords } from './utils'
import type { ExcelConfig, EnterRecord, FeeRecord } from './types'
import { defaultExcelConfig } from './types'
import ConfigTable from './ConfigTable.vue'

const configDialogVisible = ref(false)
const excelConfig = ref<ExcelConfig>({ ...defaultExcelConfig })
const enterRecords = ref<EnterRecord[]>([])
const feeRecords = ref<FeeRecord[]>([])

// 更新文件解析函数
const handleEnterFileChange = async (uploadFile: UploadFile) => {
  try {
    const records = await parseEnterRecords(uploadFile.raw!, excelConfig.value);
    enterRecords.value = records;
  } catch (error: any) {
    ElMessage.error(error?.message || '解析文件失败');
  }
};

const handleFeeFileChange = async (uploadFile: UploadFile) => {
  try {
    const records = await parseFeeRecords(uploadFile.raw!, excelConfig.value);
    feeRecords.value = records;
  } catch (error: any) {
    ElMessage.error(error?.message || '解析文件失败');
  }
};

const saveConfig = () => {
  configDialogVisible.value = false
  ElMessage.success('配置已保存')
}
</script>

<style scoped lang="scss">
.excel-total {
  padding: 20px;

  .upload-demo {
    margin-top: 20px;
  }
}
</style>
