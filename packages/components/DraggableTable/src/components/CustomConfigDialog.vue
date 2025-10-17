<template>
  <div v-if="visible">
    <DragModalDialog
      v-model:visible="visible"
      resizable
      v-bind="computedDialogProps"
    >
      <VxeGrid
        id="custom"
        ref="xTable"
        v-bind="gridProps"
      >
        <template #title="{ row }">
          <div>{{ getTypeName(row.type) || row.title }}</div>
        </template>
        <template #input="{ row, column }">
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
        <template #switch="{ row, column }">
          <ElSwitch
            v-model="row[column.field]"
            size="small"
          />
        </template>
        <template #select="{ row, column }">
          <TsSelect
            v-if="column.field !== 'fixed' || !row.parentId"
            v-model="row[column.field]"
            :options="column.params.options"
            class="m-2"
            :popper-style="computedPopperStyle"
            placeholder="Select"
            size="small"
            :disabled="!row.resizable"
          />
        </template>
      </VxeGrid>

      <template #footer>
        <div class="flex justify-end items-center">
          <ElCheckbox
            v-if="isConfiguration"
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
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, useTemplateRef } from 'vue'
import { ElButton, ElCheckbox, ElInput, ElSwitch } from 'element-plus'
import { getTypeName } from '@moluoxixi/components/DraggableTable/src/_utils'
import type { CustomConfigDialogEmits, CustomConfigDialogProps } from '@moluoxixi/components/DraggableTable/src/_types'
import { flattenTree } from '@moluoxixi/utils/_utils'
import { cloneDeep } from 'lodash'
import type { VxeGridInstance } from 'vxe-table'

const props = withDefaults(defineProps<CustomConfigDialogProps>(), {
  columns: () => [],
  collectColumns: () => [],
  customColumns: () => [],
  isConfiguration: false,
})

const emit = defineEmits<CustomConfigDialogEmits>()
const xTableRef = useTemplateRef<VxeGridInstance>('xTable')
const xTable = computed(() => xTableRef.value?.tableRef)

const computedDialogProps = computed(() => {
  return {
    title: '个性化列配置',
    width: '800px',
    height: '60%',
    teleportTo: '.containerMain',
    ...props.dialogProps,
  }
})

const computedPopperStyle = computed(() => {
  if (props.dialogProps?.zIndex) {
    return {
      'z-index': `${props.dialogProps.zIndex + 1}`,
    }
  }
  else {
    return {
      'z-index': 1001,
    }
  }
})

const visible = defineModel<boolean>({ default: false })

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
      fixed: item.fixed ?? '',
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
    headerCellConfig: { height: 30 },
    cellConfig: { height: 30 },
    height: '100%',
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
      emit('confirm', {
        customColumns: cloneDeep(props.columns),
        isCommon: isCommon.value,
      })
      break
    case 'confirm':
      emit('confirm', {
        customColumns: xTable.value?.getTableData()?.fullData,
        isCommon: isCommon.value,
      })
      break
  }
  visible.value = false
}
defineExpose({
  isCommon,
})
</script>

<style scoped lang="scss">
</style>
