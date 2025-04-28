<template>
  <div class="excel-total">
    <div class="upload-section">
      <el-upload
        class="upload-demo"
        action="#"
        :auto-upload="false"
        :on-change="handleEnterFileChange"
        :show-file-list="false"
      >
        <el-button type="primary">上传进车情况总表</el-button>
      </el-upload>
      <el-upload
        class="upload-demo"
        action="#"
        :auto-upload="false"
        :on-change="handleFeeFileChange"
        :show-file-list="false"
      >
        <el-button type="primary">上传收费明细总表</el-button>
      </el-upload>
    </div>

    <div class="filter-section" v-if="stats.length > 0">
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="YYYY-MM-DD"
        @change="handleDateRangeChange"
      />
      <el-button type="primary" @click="exportExcel">导出Excel</el-button>
    </div>

    <el-table
      v-if="stats.length > 0"
      :data="filteredStats"
      style="width: 100%"
      border
    >
      <el-table-column prop="date" label="日期" width="120" />
      <el-table-column prop="weekday" label="星期" width="100" />
      <el-table-column label="入库/台" width="100">
        <template #default="{ row }">
          <el-tooltip
            placement="top"
            :content="getEnterTooltipContent(row)"
            :disabled="row.enterCount === 0"
          >
            <span>{{ row.enterCount }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="出库/台" width="100">
        <template #default="{ row }">
          <el-tooltip
            placement="top"
            :content="getExitTooltipContent(row)"
            :disabled="row.exitCount === 0"
          >
            <span>{{ row.exitCount }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="totalAmount" label="金额" width="120" />
      <el-table-column label="收费台数" width="100">
        <template #default="{ row }">
          <el-tooltip
            placement="top"
            :content="getPaidTooltipContent(row)"
            :disabled="row.paidCount === 0"
          >
            <span>{{ row.paidCount }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="未收台数" width="100">
        <template #default="{ row }">
          <el-tooltip
            placement="top"
            :content="getUnpaidTooltipContent(row)"
            :disabled="row.unpaidCount === 0"
          >
            <span>{{ row.unpaidCount }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="exitRatio" label="出库占比" width="100" />
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { parseEnterRecords, parseFeeRecords, generateStatData, exportExcel } from './utils'
import type { EnterRecord, FeeRecord, StatRow } from './types'

const enterRecords = ref<EnterRecord[]>([])
const feeRecords = ref<FeeRecord[]>([])
const stats = ref<StatRow[]>([])
const dateRange = ref<[string, string] | null>(null)

const filteredStats = computed(() => {
  if (!dateRange.value) return stats.value
  const [start, end] = dateRange.value
  return stats.value.filter(row => row.date >= start && row.date <= end)
})

const handleEnterFileChange = async (file: any) => {
  try {
    enterRecords.value = await parseEnterRecords(file.raw)
    updateStats()
  } catch (error: any) {
    ElMessage.error(error.message)
  }
}

const handleFeeFileChange = async (file: any) => {
  try {
    feeRecords.value = await parseFeeRecords(file.raw)
    updateStats()
  } catch (error: any) {
    ElMessage.error(error.message)
  }
}

const handleDateRangeChange = () => {
  // 日期范围变化时，会自动触发 filteredStats 的重新计算
}

const updateStats = () => {
  if (enterRecords.value.length > 0 && feeRecords.value.length > 0) {
    stats.value = generateStatData(enterRecords.value, feeRecords.value)
  }
}

const getEnterTooltipContent = (row: StatRow) => {
  return `
    <div style="max-height: 300px; overflow: auto;">
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px;">行号</th>
            <th style="border: 1px solid #ddd; padding: 8px;">车牌</th>
            <th style="border: 1px solid #ddd; padding: 8px;">入库时间</th>
          </tr>
        </thead>
        <tbody>
          ${row.enterRecords.map(record => `
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">${record.rowIndex}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${record.carNumber}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${record.enterTime}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `
}

const getExitTooltipContent = (row: StatRow) => {
  return `
    <div style="max-height: 300px; overflow: auto;">
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px;">行号</th>
            <th style="border: 1px solid #ddd; padding: 8px;">车牌</th>
            <th style="border: 1px solid #ddd; padding: 8px;">出库时间</th>
            <th style="border: 1px solid #ddd; padding: 8px;">金额</th>
            <th style="border: 1px solid #ddd; padding: 8px;">是否收费</th>
          </tr>
        </thead>
        <tbody>
          ${row.exitRecords.map(record => `
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">${record.rowIndex}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${record.carNumber}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${record.exitTime}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${record.fee}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${record.isPaid ? '是' : '否'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `
}

const getPaidTooltipContent = (row: StatRow) => {
  return `
    <div style="max-height: 300px; overflow: auto;">
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px;">行号</th>
            <th style="border: 1px solid #ddd; padding: 8px;">车牌</th>
            <th style="border: 1px solid #ddd; padding: 8px;">出库时间</th>
            <th style="border: 1px solid #ddd; padding: 8px;">金额</th>
          </tr>
        </thead>
        <tbody>
          ${row.paidRecords.map(record => `
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">${record.rowIndex}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${record.carNumber}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${record.exitTime}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${record.fee}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `
}

const getUnpaidTooltipContent = (row: StatRow) => {
  return `
    <div style="max-height: 300px; overflow: auto;">
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px;">行号</th>
            <th style="border: 1px solid #ddd; padding: 8px;">车牌</th>
            <th style="border: 1px solid #ddd; padding: 8px;">出库时间</th>
          </tr>
        </thead>
        <tbody>
          ${row.unpaidRecords.map(record => `
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">${record.rowIndex}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${record.carNumber}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${record.exitTime}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `
}
</script>

<style scoped>
.excel-total {
  padding: 20px;
}

.upload-section {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.filter-section {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  align-items: center;
}
</style>
