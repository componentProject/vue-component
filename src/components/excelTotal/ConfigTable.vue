<template>
  <div class="config-table">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="进车记录配置" name="enter">
        <el-table :data="config.enterColumns" border>
          <el-table-column prop="key" label="字段名" width="120">
            <template #default="{ row }">
              <el-input v-model="row.key" />
            </template>
          </el-table-column>
          <el-table-column prop="label" label="显示名称" width="120">
            <template #default="{ row }">
              <el-input v-model="row.label" />
            </template>
          </el-table-column>
          <el-table-column prop="searchText" label="搜索关键词" width="150">
            <template #default="{ row }">
              <el-input v-model="row.searchText" />
            </template>
          </el-table-column>
        </el-table>
        <div class="table-actions">
          <el-button type="primary" @click="addEnterColumn">添加列</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="收费记录配置" name="fee">
        <el-table :data="config.feeColumns" border>
          <el-table-column prop="key" label="字段名" width="120">
            <template #default="{ row }">
              <el-input v-model="row.key" />
            </template>
          </el-table-column>
          <el-table-column prop="label" label="显示名称" width="120">
            <template #default="{ row }">
              <el-input v-model="row.label" />
            </template>
          </el-table-column>
          <el-table-column prop="searchText" label="搜索关键词" width="150">
            <template #default="{ row }">
              <el-input v-model="row.searchText" />
            </template>
          </el-table-column>
        </el-table>
        <div class="table-actions">
          <el-button type="primary" @click="addFeeColumn">添加列</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ExcelConfig, ColumnConfig } from './types'

defineOptions({
  name: 'ConfigTable',
})

const props = defineProps<{
  modelValue: ExcelConfig
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: ExcelConfig): void
}>()

const activeTab = ref('enter')

const config = ref<ExcelConfig>({ ...props.modelValue })

const addEnterColumn = () => {
  config.value.enterColumns.push({
    key: '',
    label: '',
    searchText: '',
    required: false,
  })
}

const removeEnterColumn = (index: number) => {
  config.value.enterColumns.splice(index, 1)
}

const addFeeColumn = () => {
  config.value.feeColumns.push({
    key: '',
    label: '',
    searchText: '',
    required: false,
  })
}

const removeFeeColumn = (index: number) => {
  config.value.feeColumns.splice(index, 1)
}

// 监听配置变化
watch(
  config,
  (newVal) => {
    emit('update:modelValue', newVal)
  },
  { deep: true },
)
</script>

<style scoped lang="scss">
.config-table {
  .table-actions {
    margin-top: 10px;
    text-align: right;
  }
}
</style>
