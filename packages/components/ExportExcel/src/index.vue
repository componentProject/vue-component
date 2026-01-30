<template>
  <div class="export-excel-wrapper">
    <!-- 使用默认按钮 -->
    <ElButton v-bind="$attrs" :disabled="isDisabled" @click="handleExport">
      <slot name="default">
        {{ buttonText }}
      </slot>
    </ElButton>
  </div>
</template>

<script setup lang="ts">
import type { emitsType, propsType, slotsType } from './types'
import { getTypeDefault } from '@moluoxixi/utils/utils'
import { ElButton } from 'element-plus'
import fileSaver from 'file-saver'
import { computed } from 'vue'
import { utils, write } from 'xlsx'
import { write as writeStyle } from 'xlsx-style-vite'

// 设置组件不继承属性到根元素，而是手动通过$attrs绑定
defineOptions({
  name: 'ExportExcel',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<propsType>(), {
  titles: () => ['title', 'label'],
  fields: () => ['field', 'prop'],
  fileName: '导出数据',
  buttonText: '导出',
  exportType: 'xlsx',
  autoWidth: true,
  allowEmptyExport: true,
  emptyMessage: '暂无数据可导出',
})

const emit = defineEmits<emitsType>()

// 获取插槽
const slots = defineSlots<slotsType>()
/**
 * 计算按钮是否禁用
 */
const isDisabled = computed(() => {
  return !props.allowEmptyExport && (!props.tableData || props.tableData.length === 0)
})

/**
 * 计算要导出的列
 */
const computedColumn = computed(() => {
  const columns = getTypeDefault(props.columns, 'array')
  const fieldKeys = getTypeDefault(props.fields, 'array')
  return columns.filter((col: any) => fieldKeys.some((k: string) => col && col[k] !== undefined && col[k] !== ''))
})

/**
 * 计算表头
 */
const computedHeader = computed(() => {
  const titleKeys = getTypeDefault(props.titles, 'array')
  return computedColumn.value.map((col: any) => {
    for (const k of titleKeys) {
      if (col && col[k] !== undefined && col[k] !== null) {
        return String(col[k])
      }
    }
    return ''
  })
})

/**
 * 计算数据字段键
 */
const computedKeys = computed(() => {
  const fieldKeys = getTypeDefault(props.fields, 'array')
  return computedColumn.value.map((col: any) => {
    for (const k of fieldKeys) {
      if (col && col[k] !== undefined && col[k] !== null && col[k] !== '') {
        return String(col[k])
      }
    }
    return ''
  })
})
/**
 * 处理导出
 */
function handleExport() {
  if (computedColumn.value.length !== getTypeDefault(props.columns, 'array').length) {
    console.warn(`部分列未找到字段(${getTypeDefault(props.fields, 'array').join('/')})，已被忽略`)
  }
  // 检查数据是否为空
  if (!props.tableData || props.tableData.length === 0) {
    if (props.allowEmptyExport) {
      // 允许空数据导出，但给出提示
      emit('warning', '当前数据为空，将导出表头信息')
      // 创建仅包含表头的数据
      const emptyData = [{}] // 创建一个空对象，以便生成工作表
      const header = computedHeader.value
      const keys = computedKeys.value

      // 导出仅有表头的Excel
      exportExcel(emptyData, header, props.fileName, keys)
    }
    else {
      // 不允许空数据导出
      emit('error', new Error(props.emptyMessage))
    }
  }
  else {
    // 获取表头和数据
    const header = computedHeader.value
    const keys = computedKeys.value

    // 处理数据
    const data = formatData(props.tableData, keys)
    // 导出Excel
    exportExcel(data, header, props.fileName, keys)
  }
}

/**
 * 格式化数据，支持嵌套属性和列级格式化函数
 * @param dataSource - 数据源
 * @param keys - 表格列的 key
 * @returns 格式化后的数据
 */
function formatData(dataSource: any[], keys: string[]) {
  return dataSource.map((item: any, rowIndex: number) => {
    const newItem: Record<string, any> = {}

    keys.forEach((key: string, colIndex: number) => {
      // 处理列级格式化函数
      const column = computedColumn.value[colIndex] as any
      if (column && typeof column.formatter === 'function') {
        newItem[key] = column.formatter(item, column, rowIndex)
        return
      }

      // 支持嵌套属性，如'user.name'
      if (key.includes('.')) {
        const keyArr = key.split('.')
        let value = item
        keyArr.forEach((k: string) => {
          value = value?.[k]
        })
        newItem[key] = value !== undefined ? value : ''
      }
      else {
        newItem[key] = item[key] !== undefined ? item[key] : ''
      }
    })
    return newItem
  })
}

/**
 * 导出 Excel 文件
 * @param data - 导出数据
 * @param header - 表头数组
 * @param fileName - 文件名
 * @param keys - 可选，列 key，用于空数据导出
 */
function exportExcel(data: any[], header: string[], fileName: string, keys: string[] | null = null) {
  // 创建工作簿
  const wb = utils.book_new()

  // 处理数据
  let worksheet

  if (data.length === 1 && Object.keys(data[0]).length === 0 && keys) {
    // 处理空数据导出情况
    // 为每个key创建一个空对象
    const emptyObj: Record<string, any> = {}
    keys.forEach((key: string) => {
      emptyObj[key] = ''
    })
    worksheet = utils.json_to_sheet([emptyObj], { header: keys })
  }
  else {
    // 正常数据导出
    worksheet = utils.json_to_sheet(data, keys ? { header: keys } : undefined)
  }

  // 添加表头
  utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' })

  // 设置表头样式（加粗）
  const range = utils.decode_range(worksheet['!ref'] || '')
  for (let col = range.s.c; col <= range.e.c; ++col) {
    const cellRef = utils.encode_cell({ r: 0, c: col })
    if (!worksheet[cellRef])
      continue

    // 获取当前列的align属性
    const column = computedColumn.value[col] as any
    const align = column?.align || 'left'

    // 使用表头样式函数
    worksheet[cellRef].s = getHeaderStyle(align)
  }

  // 如果需要自动调整列宽
  if (props.autoWidth) {
    // 获取所有列的最大宽度
    const columnsWidth: { wch: number }[] = []

    // 先加入表头的宽度
    header.forEach((h: string, idx: number) => {
      columnsWidth[idx] = {
        wch: calculateCellWidth(h.toString()),
      }
    })

    // 遍历所有数据行
    if (data.length > 0) {
      const dataKeys = keys || Object.keys(data[0])
      data.forEach((row: any) => {
        dataKeys.forEach((key: string, idx: number) => {
          const cellValue = row[key] === null || row[key] === undefined ? '' : row[key].toString()
          const cellWidth = calculateCellWidth(cellValue)
          if (!columnsWidth[idx] || columnsWidth[idx].wch < cellWidth) {
            columnsWidth[idx] = { wch: cellWidth }
          }
        })
      })
    }

    // 设置列宽
    worksheet['!cols'] = columnsWidth
  }

  // 处理单元格合并
  if (props.spanMethod && data.length > 0 && computedColumn) {
    const merges: any[] = []
    const headerLength = header.length

    for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
      for (let columnIndex = 0; columnIndex < headerLength; columnIndex++) {
        const spanInfo = props.spanMethod({
          rowIndex,
          columnIndex,
          row: data[rowIndex],
          column: computedColumn.value[columnIndex],
        })

        if (spanInfo) {
          let rowspan: number
          let colspan: number

          if (Array.isArray(spanInfo)) {
            rowspan = spanInfo[0]
            colspan = spanInfo[1]
          }
          else {
            rowspan = spanInfo.rowspan
            colspan = spanInfo.colspan
          }

          if (rowspan === 0 || colspan === 0) {
            continue
          }

          if (rowspan > 1 || colspan > 1) {
            const startRow = rowIndex + 1
            const startCol = columnIndex
            const endRow = startRow + rowspan - 1
            const endCol = startCol + colspan - 1

            merges.push({
              s: { r: startRow, c: startCol },
              e: { r: endRow, c: endCol },
            })
          }
        }
      }
    }

    if (merges.length > 0) {
      worksheet['!merges'] = merges
    }
  }

  // 添加样式设置
  setPubExcel(worksheet)
  mergeCell(worksheet)
  // 添加到工作簿
  utils.book_append_sheet(wb, worksheet, 'Sheet1')

  // 导出文件
  const fileType = props.exportType === 'xlsx' ? 'xlsx' : 'csv'
  const bookType = props.exportType === 'xlsx' ? 'xlsx' : 'csv'
  // 生成文件并下载
  let wbout
  if (props.exportType === 'xlsx') {
    // 使用xlsx-style-vite写入带样式的Excel文件
    wbout = writeStyle(wb, {
      bookType: 'xlsx',
      bookSST: false,
      type: 'binary',
    })
    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream;charset=utf-8' })
    const timestamp = new Date().getTime()
    const fullFileName = `${fileName}_${timestamp}.${fileType}`
    fileSaver.saveAs(blob, fullFileName)
  }
  else {
    // 使用原始xlsx库写入csv文件
    wbout = write(wb, { bookType, type: 'array' })
    const blob = new Blob([wbout], { type: 'application/octet-stream' })
    const timestamp = new Date().getTime()
    const fullFileName = `${fileName}_${timestamp}.${fileType}`
    fileSaver.saveAs(blob, fullFileName)
  }

  emit('success')
}

/**
 * 计算单元格宽度，中文字符宽度为 2，英文字符宽度为 1
 * @param cellValue - 单元格内容
 * @returns 宽度值
 */
function calculateCellWidth(cellValue: string) {
  if (!cellValue)
    return 10

  // 中文字符计算
  let width = 0
  for (let i = 0; i < cellValue.length; i++) {
    // 中文字符宽度设为2，英文字符宽度为1
    width += cellValue.charCodeAt(i) > 255 ? 2.2 : 1
  }

  // 给一些宽度余量，确保内容显示完整
  return Math.max(width + 4, 10)
}

// 获取单元格基础样式
function getBaseStyle(align: string) {
  return {
    border: {
      top: { style: 'thin', color: { rgb: 'aaaaaa' } },
      bottom: { style: 'thin', color: { rgb: 'aaaaaa' } },
      left: { style: 'thin', color: { rgb: 'aaaaaa' } },
      right: { style: 'thin', color: { rgb: 'aaaaaa' } },
    },
    alignment: {
      horizontal: align,
      vertical: 'center',
      wrapText: true,
      indent: 0,
    },
  }
}

// 获取表头样式
function getHeaderStyle(align: string) {
  const baseStyle = getBaseStyle(align)
  return {
    ...baseStyle,
    font: {
      bold: true,
    },
    fill: {
      fgColor: { rgb: 'F3F4F6' },
    },
  }
}

// 获取内容单元格样式
function getContentStyle(align: string) {
  return getBaseStyle(align)
}

// 获取合并单元格样式
function getMergeStyle(align: string) {
  const { ...baseStyleWithoutPadding } = getBaseStyle(align)
  return {
    ...baseStyleWithoutPadding,
    font: {
      sz: 11,
    },
  }
}

// 表格样式设置
function setPubExcel(data: any) {
  const excludes = ['!cols', '!fullref', '!merges', '!ref', '!rows']
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      if (!excludes.includes(key)) {
        // 解析单元格位置
        const cell = utils.decode_cell(key)
        const isHeader = cell.r === 0
        // 获取当前列的align属性
        const column = computedColumn.value[cell.c] as any
        const align = column?.align || 'left'
        data[key].s = isHeader ? getHeaderStyle(align) : getContentStyle(align)
      }
    }
  }
  // 确保!rows数组存在且长度足够
  if (!data['!rows']) {
    data['!rows'] = []
  }

  // 获取数据总行数
  const totalRows = data['!ref'] ? utils.decode_range(data['!ref']).e.r + 1 : 0

  // 初始化!rows数组
  while (data['!rows'].length < totalRows) {
    data['!rows'].push({})
  }

  // 设置表头行高
  data['!rows'][0] = { hpx: 30 } // 表头行高30像素

  // 设置内容行默认行高
  for (let i = 1; i < data['!rows'].length; i++) {
    data['!rows'][i] = { hpx: 20 } // 内容行高20像素
  }
}

function mergeCell(ws: any) {
  if (ws['!merges']) {
    ws['!merges'].forEach((merge: any) => {
      const startCell = utils.encode_cell({ r: merge.s.r, c: merge.s.c })
      if (ws[startCell]) {
        // 获取当前列的align属性
        const column = computedColumn.value[merge.s.c] as any
        const align = column?.align || 'left'
        // 使用复用的合并单元格样式
        ws[startCell].s = getMergeStyle(align)
      }
    })
  }
  return ws
}

// 字符串转ArrayBuffer
function s2ab(s: string) {
  const buf = new ArrayBuffer(s.length)
  const view = new Uint8Array(buf)
  for (let i = 0; i < s.length; i++) {
    view[i] = s.charCodeAt(i) & 0xFF
  }
  return buf
}
</script>

<style scoped>
.export-excel-wrapper {
  display: inline-block;
  margin-left: 12px;
}
</style>
