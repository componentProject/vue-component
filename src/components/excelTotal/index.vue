<template>
  <div class="excel-total">
    <el-button @click="editConfig">编辑配置</el-button>
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
import { ElMessage, ElMessageBox } from 'element-plus'
import type { UploadFile } from 'element-plus'
import { parseEnterRecords, parseFeeRecords } from './utils'
import type { ExcelConfig, EnterRecord, FeeRecord } from './types'
import { defaultExcelConfig } from './types'

const excelConfig = ref<ExcelConfig>(defaultExcelConfig);
const enterRecords = ref<EnterRecord[]>([]);
const feeRecords = ref<FeeRecord[]>([]);

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

// 添加配置编辑功能
const editConfig = () => {
  ElMessageBox.prompt('请输入配置JSON', '编辑配置', {
    inputValue: JSON.stringify(excelConfig.value, null, 2),
    inputType: 'textarea',
    beforeClose: (action, instance, done) => {
      if (action === 'confirm') {
        try {
          const newConfig = JSON.parse(instance.inputValue);
          excelConfig.value = newConfig;
          done();
        } catch {
          ElMessage.error('配置格式错误');
          return false;
        }
      } else {
        done();
      }
    }
  });
};
</script>
<style scoped lang="scss">
.excel-total {
  padding: 20px;

  .upload-demo {
    margin-top: 20px;
  }
}
</style>
