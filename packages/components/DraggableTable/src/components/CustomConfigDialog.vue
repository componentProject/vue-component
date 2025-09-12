<template>
  <ElDialog
    v-model="visible"
    :title="title"
    :width="dialogWidth"
    destroy-on-close
  >
    <VxeGrid
      ref="tableRef"
      :header-cell-config="{ height: '30px' }"
      :cell-config="{ height: '30px' }"
      min-height="200px"
      :columns="columnsConfig"
      :data="dataObj"
      :checkbox-config="checkboxConfig"
      rowdragable
      v-bind="vxeProps"
    >
      <template #width="{ row, column }">
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
      <template #resizable="{ row, column }">
        <ElSwitch
          v-model="row[column.field]"
          size="small"
        />
      </template>
      <template #align="{ row, column }">
        <ElSelect
          v-model="row[column.field]"
          class="m-2"
          placeholder="Select"
          size="small"
          :disabled="!row.resizable"
          style="width: 100%"
        >
          <ElOption
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            @click.stop
            @mousedown.stop
          />
        </ElSelect>
      </template>
    </VxeGrid>

    <template #footer>
      <div class="flex justify-end items-center">
        <ElCheckbox
          v-model="isCommon" style="margin-right: 40px;" label="作为统一配置"
          size="large"
        />
        <ElButton @click="handleEvent('reset')">
          恢复默认
        </ElButton>
        <ElButton type="primary" @click="handleEvent('confirm')">
          确认
        </ElButton>
        <ElButton type="info" @click="handleEvent('cancel')">
          取消
        </ElButton>
      </div>
    </template>
  </ElDialog>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import type { PropType } from 'vue'
import type { VxeGridProps } from 'vxe-table'
import { ElButton, ElCheckbox, ElDialog, ElInput, ElOption, ElSelect, ElSwitch } from 'element-plus'
import { setMemoryUpload } from '@moluoxixi/utils/_api'

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  columns: {
    type: Array,
    default: () => [],
  },
  computedColumns: {
    type: Array,
    default: () => [],
  },
  columnsConfig: {
    type: Array,
    default: () => [],
  },
  title: {
    type: String,
    default: '个性化列配置',
  },
  dialogWidth: {
    type: [String, Number],
    default: '800px',
  },
  // 透传 VXE-Grid 配置，将会被 DraggableTable 接收并传递给 vxe-grid
  vxeProps: {
    type: Object as PropType<Partial<VxeGridProps>>,
    default: () => ({}),
  },
  confirmText: {
    type: String,
    default: '保存',
  },
  cancelText: {
    type: String,
    default: '取消',
  },
})

const emit = defineEmits<{
  (e: 'confirm', data: any[]): void
  (e: 'cancel'): void
}>()

const visible = defineModel<boolean>({ default: false })

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
  { field: 'width', width: 100, title: '宽度' },
  { field: 'resizable', title: '可调整' },
  { field: 'align', title: '对齐方式' },
]

const columnsConfig = computed(() => {
  return props.columnsConfig?.length ? props.columnsConfig : DEFAULT_COLUMNS
})

const tableData = ref([])

const dataObj = computed(() => {
  return props.data.map((item: any) => {
    return {
      ...item,
      width: item.renderWidth,
      align: item.align ?? 'left',
    }
  })
})

const isCommon = ref(false)

async function customConfigSave(computedColumns: any, type: boolean) {
  await setMemoryUpload({
    pageId: props.pageId,
    widgetId: props.id,
    userId: !type ? props.userId : '',
    data: JSON.stringify(computedColumns),
  })
}

function handleEvent(type: 'confirm' | 'reset' | 'cancel') {
  switch (type) {
    case 'reset':
      tableData.value = props.columns
      customConfigSave(props.columns, isCommon.value)
      break
    case 'confirm':
      customConfigSave(tableData.value, isCommon.value)
      visible.value = false
      break
    case 'cancel':
      visible.value = false
  }
}

defineExpose({
  // 暴露表格实例
  getTable() {
    return tableRef.value?.getTable()
  },
  getTableData() {
    return tableRef.value?.getTable().getTableData()
  },
})
</script>
