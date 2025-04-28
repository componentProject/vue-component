<template>
  <div class="excel-total">
    <div class="config-section">
      <h3>Excel列配置</h3>
      <config-table v-model="excelConfig" />
    </div>

    <div class="upload-section">
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
</script>

<style scoped lang="scss">
.excel-total {
  padding: 20px;

  .config-section {
    margin-bottom: 30px;

    h3 {
      margin-bottom: 15px;
      font-size: 16px;
      font-weight: 500;
    }
  }

  .upload-section {
    .upload-demo {
      margin-top: 20px;
    }
  }
}
</style>
