<template>
  <ElDialog
    v-model="visible"
    destroy-on-close
    v-bind="computedDialogProps"
  >
    <VxeGrid
      id="custom"
      border
      :header-cell-config="{ height: '30px' }"
      :cell-config="{ height: '30px' }"
      min-height="200px"
      :columns="tableColumns"
      :data="tableData"
      :checkbox-config="checkboxConfig"
      :row-config="{
        useKey: true,
        resizable: true,
        drag: true,
      }"
      :row-drag-config="{
        showGuidesStatus: true,
        showIcon: false,
        trigger: 'row',
      }"
    >
      <template #title="{ row }">
        <div>{{ getTypeName(row.type) || row.title }}</div>
      </template>
      <template #width="{ row, column }">
        <ElInput
          v-model="row[column.field]"
          size="small"
          :disabled="!row.resizable"
          :placeholder="getPlaceholder(column.title)"
          style="width: 100%"
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
import { VxeGrid } from 'vxe-table'
import { ElButton, ElCheckbox, ElDialog, ElInput, ElOption, ElSelect, ElSwitch } from 'element-plus'
import { getTypeName } from '@moluoxixi/components/DraggableTable/src/_utils'
import { cloneDeep } from 'lodash'
import type { ColumnType } from '@moluoxixi/components/DraggableTable/src/_types'

const props = defineProps({
  columns: {
    type: Array as PropType<ColumnType[]>,
    default: () => [],
  },
  computedColumns: {
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
      return {}
    },
  },
})

const emit = defineEmits<{
  (e: 'confirm', customColumns: any[]): void
}>()

const computedDialogProps = computed(() => {
  return {
    width: '800px',
    title: '个性化列配置',
    ...props.dialogProps,
  }
})

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

const tableColumns = computed(() => {
  return props.customColumns || []
})

const tableData = ref([])

watch(() => visible.value, (v: boolean) => {
  if (v) {
    tableData.value = cloneDeep(props.computedColumns).map((item: any) => {
      return {
        ...item,
        visible: item.visible ?? true,
        width: item.width || Math.ceil(item.resizeWidth) || Math.ceil(item.renderWidth),
      }
    })
  }
}, {
  immediate: true,
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
        customColumns: tableData.value,
        isCommon: isCommon.value,
      })
      visible.value = false
      break
    case 'cancel':
      visible.value = false
  }
}
</script>
