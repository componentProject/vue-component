<template>
  <div class="excel-total">
    <div v-show="addNewTable || !statData.length" class="config-section">
      <h3>Excel列配置</h3>
      <config-table v-model="excelConfig" />
    </div>

    <div v-show="addNewTable || !statData.length" class="upload-section flex">
      <el-upload
        class="upload-demo mr-2"
        action="#"
        :auto-upload="false"
        :on-change="handleEnterFileChange"
      >
        <el-button type="primary">上传进车记录</el-button>
      </el-upload>
      <el-upload
        class="upload-demo ml-2"
        action="#"
        :auto-upload="false"
        :on-change="handleFeeFileChange"
      >
        <el-button type="primary">上传收费记录</el-button>
      </el-upload>
    </div>

    <div class="stat-table" v-if="statData.length > 0 && !addNewTable">
      <div class="table-header">
        <h3>车辆数据统计周表</h3>
        <div class="date-range">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="handleDateRangeChange"
          />
          <el-button class="mr2" type="primary" @click="addNewTable = true">添加新周表</el-button>
          <el-button type="primary" @click="exportStatData">导出统计表</el-button>
        </div>
      </div>
      <el-table
        :data="filteredStatData"
        border
        style="width: 100%"
        @row-contextmenu="handleRowContextMenu"
      >
        <el-table-column prop="date" label="日期" width="120" />
        <el-table-column prop="weekday" label="星期" width="100" />
        <el-table-column prop="enterCount" label="入库/台" width="100" />
        <el-table-column prop="exitCount" label="出库/台" width="100" />
        <el-table-column prop="totalAmount" label="金额" width="100" />
        <el-table-column prop="paidCount" label="收费台数" width="100" />
        <el-table-column prop="unpaidCount" label="未收台数" width="100" />
        <el-table-column prop="exitRatio" label="出库占比" width="100" />
      </el-table>
    </div>

    <!-- 右键菜单 -->
    <div
      v-if="showContextMenu"
      class="context-menu"
      :style="{ left: contextMenuX + 'px', top: contextMenuY + 'px' }"
      @click.stop
    >
      <div class="menu-item" @click="showSourceData('enter')">查看入库数据</div>
      <div class="menu-item" @click="showSourceData('exit')">查看出库数据</div>
      <div class="menu-item" @click="showSourceData('paid')">查看收费数据</div>
      <div class="menu-item" @click="showSourceData('unpaid')">查看未收费数据</div>
    </div>

    <!-- 数据来源弹窗 -->
    <el-dialog
      :title="sourceDialogTitle"
      v-model="showSourceDialog"
      width="80%"
    >
      <el-table :data="sourceData" border style="width: 100%">
        <el-table-column prop="number" label="编号" width="120" />
        <el-table-column prop="carNumber" label="车牌" width="120" />
        <el-table-column prop="enterTime" label="进站时间" width="180" />
        <el-table-column v-if="showExitTime" prop="exitTime" label="出站时间" width="180" />
        <el-table-column v-if="showFee" prop="fee" label="金额" width="100" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { UploadFile } from 'element-plus'
import { parseEnterRecords, parseFeeRecords, generateStatData, exportExcel, getDefaultDateRange } from './utils'
import type { ExcelConfig, EnterRecord, FeeRecord, StatRow } from './types'
import { defaultExcelConfig } from './types'
import ConfigTable from './ConfigTable.vue'
import moment from 'moment'

// 全局变量
const excelConfig = ref<ExcelConfig>({ ...defaultExcelConfig })
const enterRecords = ref<EnterRecord[]>([])
const feeRecords = ref<FeeRecord[]>([])
const addNewTable= ref(false)
// 日期范围
const dateRange = ref<[Date, Date] | undefined>(undefined)

// 计算统计表数据
const statData = computed<StatRow[]>(() => {
  if (enterRecords.value.length === 0 || feeRecords.value.length === 0) {
    return []
  }
  return generateStatData(enterRecords.value, feeRecords.value)
})

// 设置默认日期范围
const setDefaultDateRange = () => {
  if (enterRecords.value.length > 0 && feeRecords.value.length > 0) {
    dateRange.value = getDefaultDateRange(enterRecords.value, feeRecords.value)
  }
}

// 根据日期范围过滤数据
const filteredStatData = computed(() => {
  if (!dateRange.value) return statData.value
  const [start, end] = dateRange.value
  return statData.value.filter(row => {
    const date = moment(row.date)
    return date.isSameOrAfter(moment(start).format('YYYY-MM-DD')) &&
           date.isSameOrBefore(moment(end).format('YYYY-MM-DD'))
  })
})

// 处理日期范围变化
const handleDateRangeChange = (dates: [Date, Date] | null) => {
  dateRange.value = dates
}

// 右键菜单相关
const showContextMenu = ref(false)
const contextMenuX = ref(0)
const contextMenuY = ref(0)
const currentRow = ref<StatRow | null>(null)

// 数据来源弹窗相关
const showSourceDialog = ref(false)
const sourceDialogTitle = ref('')
const sourceData = ref<(EnterRecord | FeeRecord)[]>([])
const showExitTime = ref(false)
const showFee = ref(false)

// 更新文件解析函数
const handleEnterFileChange = async (uploadFile: UploadFile) => {
  try {
    const records = await parseEnterRecords(uploadFile.raw!, excelConfig.value);
    enterRecords.value = records;
    if (feeRecords.value.length > 0) {
      ElMessage.success('进车记录导入成功，统计表已更新');
      setDefaultDateRange();
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
      setDefaultDateRange();
    }
  } catch (error: any) {
    ElMessage.error(error?.message || '解析文件失败');
  }
};

// 处理右键菜单
const handleRowContextMenu = (row: StatRow, column: any, event: globalThis.MouseEvent) => {
  event.preventDefault();
  currentRow.value = row;
  contextMenuX.value = event.clientX;
  contextMenuY.value = event.clientY;
  showContextMenu.value = true;
};

// 点击其他地方关闭右键菜单
const handleDocumentClick = () => {
  showContextMenu.value = false;
};

// 生命周期钩子
onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('click', handleDocumentClick);
  }
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('click', handleDocumentClick);
  }
});

// 显示数据来源
const showSourceData = (type: 'enter' | 'exit' | 'paid' | 'unpaid') => {
  if (!currentRow.value) return;

  showContextMenu.value = false;
  showSourceDialog.value = true;
  showExitTime.value = type !== 'enter';
  showFee.value = type === 'paid' || type === 'unpaid';

  switch (type) {
    case 'enter':
      sourceDialogTitle.value = `入库数据 (${currentRow.value.date})`;
      sourceData.value = currentRow.value.enterRecords;
      break;
    case 'exit':
      sourceDialogTitle.value = `出库数据 (${currentRow.value.date})`;
      sourceData.value = currentRow.value.exitRecords;
      break;
    case 'paid':
      sourceDialogTitle.value = `收费数据 (${currentRow.value.date})`;
      sourceData.value = currentRow.value.paidRecords;
      break;
    case 'unpaid':
      sourceDialogTitle.value = `未收费数据 (${currentRow.value.date})`;
      sourceData.value = currentRow.value.unpaidRecords;
      break;
  }
};

// 导出统计表
const exportStatData = () => {
  if (!dateRange.value) {
    exportExcel(statData.value)
    return
  }
  const [start, end] = dateRange.value
  exportExcel(
    filteredStatData.value,  // 使用筛选后的数据
    moment(start).format('YYYY-MM-DD'),
    moment(end).format('YYYY-MM-DD')
  )
}
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
      margin-right: 12px;
    }
  }

  .stat-table {
    margin-bottom: 30px;

    .table-header {
      margin-bottom: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      h3 {
        font-size: 16px;
        font-weight: 500;
      }

      .date-range {
        display: flex;
        align-items: center;

        .el-date-picker {
          margin-right: 10px;
        }
      }
    }
  }

  .context-menu {
    position: fixed;
    background: white;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    z-index: 2000;

    .menu-item {
      padding: 8px 16px;
      cursor: pointer;

      &:hover {
        background-color: #f5f7fa;
      }
    }
  }
}
</style>
