<template>
  <DraggableTable ref="tableRef" min-height="200px" :columns="columnsConfig" :data="dataObj" :checkbox-config="checkboxConfig" :rowdragable="true">
    <template #positiveNumber="{ row, column }">
      <ElInput
        :model-value="row[column.field]"
        size="small"
        maxlength="4"
        :disabled="!row.resizable"
        :placeholder="getPlaceholder(column.title)"
        style="width: 100%"
        @update:model-value="handlePositiveNumberInput(row, column.field, $event)"
      />
    </template>
    <template #positiveSwitch="{ row, column }">
      <ElSwitch
        v-model="row[column.field]"
        size="small"
      />
    </template>
    <template #positiveSelect="{ row, column }">
      <el-select
        v-model="row[column.field]"
        class="m-2"
        placeholder="Select"
        size="small"
        :disabled="!row.resizable"
        style="width: 100%"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          @click.stop
          @mousedown.stop
        />
      </el-select>
    </template>
  </DraggableTable>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, ref } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  customRowConfig: {
    type: Array,
    default: () => [],
  },
})

const options = [
  {
    label: '左对齐',
    value: 'left',
  },
  {
    label: '右对齐',
    value: 'right',
  },
  {
    label: '居中对齐',
    value: 'center',
  },
]

const tableRef = ref<any>(null)
const checkboxConfig = { checkField: 'visible' }

// 处理正整数输入
function handlePositiveNumberInput(row: any, field: string, value: string) {
  let filtered = String(value || '').replace(/\D/g, '')
  filtered = filtered.replace(/^0+/, '') || ''
  if (filtered && Number(filtered) < 1) {
    filtered = '1'
  }
  row[field] = filtered
}
function getPlaceholder(title: string) {
  return `请输入${title}（大于0）`
}

// 默认列配置
const DEFAULT_COLUMNS = [
  { type: 'checkbox', width: 40 },
  { field: 'field', title: '字段' },
  { field: 'title', title: '列名称' },
  { field: 'width', width: 100, title: '宽度', slots: {
    default: 'positiveNumber',
  } },
  { field: 'resizable', title: '可调整', slots: {
    default: 'positiveSwitch',
  } },
  { field: 'align', title: '对齐方式', slots: {
    default: 'positiveSelect',
  } },
]

const columnsConfig = computed(() => {
  return props.customRowConfig?.length ? props.customRowConfig : DEFAULT_COLUMNS
})

const dataObj = computed(() => {
  return props.data.map((item: any) => {
    return {
      ...item,
      width: item.renderWidth,
      align: item.align ?? 'left',
    }
  })
})
const DraggableTable = defineAsyncComponent(() =>
  import('@moluoxixi/components/DraggableTable'),
)
defineExpose({
  // 暴露表格实例
  getTableData: () => {
    return tableRef.value.getTable().getTableData()
  },
})
</script>
