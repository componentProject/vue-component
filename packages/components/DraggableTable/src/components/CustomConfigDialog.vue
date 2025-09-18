<template>
  <DragModalDialog
    v-model:visible="visible"
    v-bind="props.dialogProps"
  >
    <VxeGrid
      id="custom"
      ref="xTable"
      v-bind="gridProps"
    >
      <template #title="{ row }">
        <div>{{ getTypeName(row.type) || row.title }}</div>
      </template>
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
  </DragModalDialog>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { VxeGrid } from 'vxe-table'
import { ElButton, ElCheckbox, ElInput, ElOption, ElSelect, ElSwitch } from 'element-plus'
import { getTypeName } from '@moluoxixi/components/DraggableTable/src/_utils'
import DragModalDialog from '@moluoxixi/components/DragModalDialog'
import type { ColumnType } from '@moluoxixi/components/DraggableTable/src/_types'
import { flattenTree } from '@moluoxixi/utils/_utils'

const props = defineProps({
  columns: {
    type: Array as PropType<ColumnType[]>,
    default: () => [],
  },
  collectColumns: {
    type: Array as PropType<ColumnType[]>,
    default: () => [],
  },
  customColumns: {
    type: Array as PropType<ColumnType[]>,
    default: () => [],
  },
  dialogProps: {
    type: Object,
    default: () => {
      return {
        title: '个性化列配置',
        width: '800px',
        height: '60%',
      }
    },
  },
})

const emit = defineEmits<{
  (e: 'confirm', customColumns: any[]): void
}>()
const xTable = useTemplateRef('xTable')

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
  return `请输入${title}（大于0）,不输入则为自适应`
}

const tableData = ref([])
function processData(data: any[] = []): any[] {
  return data.map((item: any) => {
    const { visible, width, resizeWidth, children, ...rest } = item
    return {
      ...rest,
      children: processData(children),
      visible: item.visible ?? true,
      width: item.width || (item.resizeWidth ? Math.ceil(item.resizeWidth) : ''),
    }
  })
}
watch(() => visible.value, (v: boolean) => {
  if (v) {
    tableData.value = processData(flattenTree(props.collectColumns))
  }
}, {
  immediate: true,
})
const gridProps = computed(() => {
  return {
    border: true,
    headerCellConfig: { height: '30px' },
    cellConfig: { height: '30px' },
    // height: '100%',
    height: '400px',
    columns: props.customColumns,
    checkboxConfig: { checkField: 'visible' },
    rowConfig: {
      // useKey: true,
      // resizable: true,
      drag: true,
    },
    rowDragConfig: {
      isPeerDrag: true,
      showGuidesStatus: true,
      showIcon: false,
      trigger: 'row',
    },
    treeConfig: {
      expandAll: true,
      transform: true,
      rowField: 'id',
      parentField: 'parentId',
    },
    data: tableData.value,
  }
})
const isCommon = ref(false)

function handleEvent(type: 'confirm' | 'reset' | 'cancel') {
  switch (type) {
    case 'reset':
      tableData.value = props.columns
      emit('confirm', {
        customColumns: tableData.value,
        isCommon: isCommon.value,
      })
      break
    case 'confirm':
      emit('confirm', {
        customColumns: xTable.value?.getTableData()?.fullData,
        isCommon: isCommon.value,
      })
      visible.value = false
      break
    case 'cancel':
      visible.value = false
  }
}
</script>
