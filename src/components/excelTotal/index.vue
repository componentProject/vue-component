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

    <div v-if="statData.length > 0" class="stat-section">
      <h3>车辆数据统计周表</h3>
      <el-table :data="statData" border style="width: 100%">
        <el-table-column prop="date" label="日期" width="120" />
        <el-table-column prop="weekday" label="星期" width="100" />
        <el-table-column prop="enterCount" label="入库/台" width="100" />
        <el-table-column prop="exitCount" label="出库/台" width="100" />
        <el-table-column prop="totalAmount" label="金额" width="120" />
        <el-table-column prop="paidCount" label="收费台数" width="100" />
        <el-table-column prop="unpaidCount" label="未收台数" width="100" />
        <el-table-column prop="exitRatio" label="出库占比" width="100" />
      </el-table>
      <div class="table-actions">
        <el-button type="primary" @click="exportExcel">导出统计表</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { UploadFile } from 'element-plus'
import { parseEnterRecords, parseFeeRecords, generateStatData, exportExcel } from './utils'
import type { ExcelConfig, EnterRecord, FeeRecord, StatRow } from './types'
import { defaultExcelConfig } from './types'
import ConfigTable from './ConfigTable.vue'

const excelConfig = ref<ExcelConfig>({ ...defaultExcelConfig })
const enterRecords = ref<EnterRecord[]>([])
const feeRecords = ref<FeeRecord[]>([])

// 计算统计表数据
const statData = computed<StatRow[]>(() => {
  if (enterRecords.value.length === 0 || feeRecords.value.length === 0) {
    return []
  }
  return generateStatData(enterRecords.value, feeRecords.value)
})

// 更新文件解析函数
const handleEnterFileChange = async (uploadFile: UploadFile) => {
  try {
    const records = await parseEnterRecords(uploadFile.raw!, excelConfig.value);
    enterRecords.value = records;
    if (feeRecords.value.length > 0) {
      ElMessage.success('进车记录导入成功，统计表已更新');
    }
  } catch (error: any) {
    ElMessage.error(error?.message || '解析文件失败');
  }
};

const handleFeeFileChange = async (uploadFile: UploadFile) => {
  try {
    const records = await parseFeeRecords(uploadFile.raw!, excelConfig.value);
    feeRecords.value = records;
    if (enterRecords.value.length > 0) {
      ElMessage.success('收费记录导入成功，统计表已更新');
    }
  } catch (error: any) {
    ElMessage.error(error?.message || '解析文件失败');
  }
};

// 导出统计表
const exportExcel = () => {
  if (statData.value.length === 0) {
    ElMessage.warning('没有可导出的数据');
    return;
  }
  exportExcel(statData.value);
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
    margin-bottom: 30px;

    .upload-demo {
      margin-top: 20px;
    }
  }

  .stat-section {
    h3 {
      margin-bottom: 15px;
      font-size: 16px;
      font-weight: 500;
    }

    .table-actions {
      margin-top: 20px;
      text-align: right;
    }
  }
}
</style>
