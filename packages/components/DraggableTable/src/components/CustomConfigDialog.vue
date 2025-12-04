<!-- DraggableTable的对话框组件 -->
<template>
  <DragModalDialog
    v-model:visible="visible"
    resizable
    v-bind="computedDialogProps"
  >
    <VxeGrid
      ref="xTable"
      border
      show-overflow="title"
      show-header-overflow="title"
      show-footer-overflow="title"
      :header-cell-style="{ height: '32px' }"
      :header-cell-config="{ height: 32 }"
      :cell-config="{ height: 32 }"
      height="100%"
      :columns="computedColumns"
      :checkbox-config="computedCheckboxConfig"
      :row-class-name="handleRowClassName"
      :row-config="computedRowConfig"
      :row-drag-config="computedRowDragConfig"
      :tree-config="computedTreeConfig"
      :data="computedGridData"
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
          :placeholder="getPlaceholder(String(column.title || ''))"
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
          :empty-values="[undefined]"
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
        <ElPopover :visible="resetPopoverVisible" placement="top" :width="180">
          <p v-if="isCommon" style="white-space: pre-wrap;">
            恢复默认将清除【公共及个人自定义】样式恢复到系统默认样式，请您确定是否继续？
          </p>
          <p v-else style="white-space: pre-wrap;">
            恢复默认将清除您【个人自定义】样式恢复到系统默认样式，请您确定是否继续？
          </p>
          <div style="text-align: right; margin: 0">
            <ElButton size="small" @click="resetPopoverVisible = false">
              取消
            </ElButton>
            <ElButton size="small" type="primary" @click="handleEvent('reset')">
              确定
            </ElButton>
          </div>
          <template #reference>
            <ElButton @click="resetPopoverVisible = true">
              恢复默认
            </ElButton>
          </template>
        </ElPopover>
        <!--          <ElPopover :visible="confirmPopoverVisible" placement="top" :width="180"> -->
        <!--            <p style="white-space: pre-wrap;"> -->
        <!--              是否同步删除个人配置？ -->
        <!--            </p> -->
        <!--            <div style="text-align: right; margin: 0"> -->
        <!--              <ElButton size="small" @click="confirmPopoverVisible = false"> -->
        <!--                否 -->
        <!--              </ElButton> -->
        <!--              <ElButton size="small" type="primary" @click="handleEvent('confirm')"> -->
        <!--                是 -->
        <!--              </ElButton> -->
        <!--            </div> -->
        <!--            <template #reference> -->
        <!--              -->
        <!--            </template> -->
        <!--          </ElPopover> -->
        <ElButton type="primary" @click="handleEvent('confirm')">
          确认
        </ElButton>
        <ElButton @click="handleEvent('cancel')">
          取消
        </ElButton>
      </div>
    </template>
  </DragModalDialog>
</template>

<script lang="ts" setup>
import type { CustomConfigDialogEmitsType, CustomConfigDialogPropsType } from '@moluoxixi/components/DraggableTable/src/_types'
import type { VxeGridInstance } from 'vxe-table'
import { getTypeName } from '@moluoxixi/components/DraggableTable/src/_utils'
import { flattenTree, getClass } from '@moluoxixi/utils/_utils'
import { ElButton, ElCheckbox, ElInput, ElPopover, ElSwitch } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import Sortable from 'sortablejs'
import { computed, ref, useTemplateRef, watch } from 'vue'
// import DragModalDialog from '@moluoxixi/components/DragModalDialog'

const props = withDefaults(defineProps<CustomConfigDialogPropsType>(), {
  columns: () => [],
  collectColumns: () => [],
  customColumns: () => [],
  dragType: 'draggable',
  rowdragable: true,
  /** 需要禁用拖拽的行class */
  rowDisabledClass: '.has-parent',
  isConfiguration: false,
})

const emit = defineEmits<CustomConfigDialogEmitsType>()
// const xTableRef = useTemplateRef<VxeGridInstance>('xTable')
// const xTable = computed(() => xTableRef.value?.tableRef)
const xTable = useTemplateRef<VxeGridInstance>('xTable')

const computedDialogProps = computed(() => {
  return {
    title: '个性化列配置',
    width: '800px',
    height: '60%',
    contentStyle: {
      padding: '8px',
    },
    ...props.dialogProps,
  }
})

const computedPopperStyle = computed(() => {
  if (props.dialogProps?.zIndex) {
    return {
      zIndex: props.dialogProps.zIndex + 1,
    }
  }
  else {
    return {
      zIndex: 1001,
    }
  }
})

const visible = defineModel<boolean>({ default: false })

const resetPopoverVisible = ref(false)
const confirmPopoverVisible = ref(false)

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

const tableData = ref<any[]>([])
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
const computedColumns = computed(() => props.customColumns)
const computedCheckboxConfig = computed(() => ({
  checkField: 'visible',
}))
const computedRowConfig = computed(() => ({
  // useKey: true,
  // resizable: true,
  height: 32,
  drag: true,
}))
const computedRowDragConfig = computed(() => ({
  isPeerDrag: true,
  showGuidesStatus: true,
  showIcon: true,
  trigger: 'cell' as const,
}))
const computedTreeConfig = computed(() => ({
  expandAll: true,
  transform: true,
  rowField: 'id',
  parentField: 'parentId',
}))
const computedGridData = computed(() => tableData.value)
const isCommon = ref(false)

function handleEvent(type: 'confirm' | 'reset' | 'cancel') {
  switch (type) {
    case 'reset':
      emit('confirm', {
        customColumns: cloneDeep(props.columns),
        isCommon: isCommon.value,
        isReset: true,
      })
      break
    case 'confirm':
      emit('confirm', {
        customColumns: xTable.value?.getTableData()?.fullData || [],
        isCommon: isCommon.value,
      })
      break
  }
  confirmPopoverVisible.value = false
  resetPopoverVisible.value = false
  visible.value = false
}

//#region draggable模式逻辑
function handleRowClassName({ row }: { row: any }) {
  if (row.level > 1) {
    return 'has-parent'
  }
}
// 保存拖拽实例的引用
const rowSortableInstance = ref<InstanceType<typeof Sortable> | null>()
const columnSortableInstance = ref<InstanceType<typeof Sortable> | null>()

// 销毁行拖拽实例
function destroyRowSortable() {
  if (rowSortableInstance.value) {
    rowSortableInstance.value.destroy()
    rowSortableInstance.value = null
  }
}

// 销毁列拖拽实例
function destroyColumnSortable() {
  if (columnSortableInstance.value) {
    columnSortableInstance.value.destroy()
    columnSortableInstance.value = null
  }
}

// 初始化行拖拽
function initRowDraggable() {
  // 先销毁旧实例
  destroyRowSortable()

  if (!xTable.value)
    return

  const tableBody = xTable.value.$el.querySelector('.vxe-table--body tbody')

  if (!tableBody)
    return

  // 创建Sortable实例
  rowSortableInstance.value = Sortable.create(tableBody, {
    animation: 150,
    handle: 'tr',
    filter: getClass(props.rowDisabledClass, true),
    onEnd: ({ oldIndex = 0, newIndex = 0, item }: Record<string, any>) => {
      if (oldIndex === newIndex || !xTable.value)
        return
      // 获取源数据副本
      const tableDataCopy = [...tableData.value]
      // 移动行数据
      const rowData = tableDataCopy.splice(oldIndex, 1)[0]
      tableDataCopy.splice(newIndex, 0, rowData)
      const dragPos = oldIndex > newIndex ? 'top' : 'bottom'
      const newRow = dragPos === 'top' ? tableDataCopy[newIndex + 1] : tableDataCopy[newIndex - 1]
      const oldRow = tableDataCopy[newIndex]
      const hasParent = (newRow?.level && newRow.level > 1) || (oldRow?.level && oldRow.level > 1)
      const flag = props.rowDragEndMethod
        ? props.rowDragEndMethod({
            oldIndex,
            newIndex,
            newRow,
            oldRow,
            dragRow: rowData,
            dragPos,
            dragToChild: false,
          })
        : true
      if (!flag || hasParent) {
        const wrapperElem = item.parentNode
        if (wrapperElem) {
          const nodeList = Array.from(wrapperElem.childNodes)
          if (dragPos === 'top') {
            wrapperElem.insertBefore(nodeList[newIndex], nodeList[oldIndex + 1])
          }
          else {
            wrapperElem.insertBefore(nodeList[newIndex], nodeList[oldIndex])
          }
        }
        return
      }
      // 更新数据并发送事件
      tableData.value = tableDataCopy
      // { newRow, oldRow, dragRow, dragPos, dragToChild, offsetIndex, $event }
      // 构造vxe格式的事件参数
      const eventParams = {
        dragRow: rowData,
        newRow,
        oldRow,
        dragPos,
        offsetIndex: Math.abs(newIndex - oldIndex),
        dragToChild: false,
      }
      emit('rowDragend', eventParams)
    },
  })
}

function destroySortable() {
  if (props.rowdragable) {
    destroyRowSortable()
  }
}

function initSortable() {
  setTimeout(() => {
    if (props.rowdragable) {
      initRowDraggable()
    }
  }, 100)
}
watch(() => visible.value, (newVal) => {
  if (newVal) {
    initSortable()
  }
  else {
    destroySortable()
  }
}, {
  immediate: true,
})
//#endregion

defineExpose({
  isCommon,
})
</script>

<style scoped lang="scss">
</style>
