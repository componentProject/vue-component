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
import { ElButton } from 'element-plus'
import fileSaver from 'file-saver'
import { computed } from 'vue'
import { utils, write } from 'xlsx'
import { getTypeDefault } from '@moluoxixi/utils/_utils'
import type { emitsType, propsType, slotsType } from './_types'

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
// 计算按钮是否禁用
const isDisabled = computed(() => {
  return !props.allowEmptyExport && (!props.tableData || props.tableData.length === 0)
})
const computedColumn = computed(() => {
  const columns = getTypeDefault(props.columns, 'array')
  const fieldKeys = getTypeDefault(props.fields, 'array')
  return columns.filter(col => fieldKeys.some(k => col && col[k] !== undefined && col[k] !== ''))
})

const computedHeader = computed(() => {
  const titleKeys = getTypeDefault(props.titles, 'array')
  return computedColumn.value.map((col) => {
    for (const k of titleKeys) {
      if (col && col[k] !== undefined && col[k] !== null) {
        return String(col[k])
      }
    }
    return ''
  })
})
const computedKeys = computed(() => {
  const fieldKeys = getTypeDefault(props.fields, 'array')
  return computedColumn.value.map((col) => {
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
 * 格式化数据
 * @param {Array} dataSource 数据源
 * @param {Array} keys 表格列的key
 * @returns {Array} 格式化后的数据
 */
function formatData(dataSource, keys) {
  return dataSource.map((item, rowIndex) => {
    const newItem = {}

    keys.forEach((key, colIndex) => {
      // 处理列级格式化函数
      const column = computedColumn.value[colIndex]
      if (column && typeof column.formatter === 'function') {
        newItem[key] = column.formatter(item, column, rowIndex)
        return
      }

      // 支持嵌套属性，如'user.name'
      if (key.includes('.')) {
        const keyArr = key.split('.')
        let value = item
        keyArr.forEach((k) => {
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
 * 导出Excel
 * @param {Array} data 导出数据
 * @param {Array} header 表头
 * @param {string} fileName 文件名
 * @param {Array} keys 可选，列key，用于空数据导出
 */
function exportExcel(data, header, fileName, keys = null) {
  // 创建工作簿
  const wb = utils.book_new()

  // 处理数据
  let worksheet

  if (data.length === 1 && Object.keys(data[0]).length === 0 && keys) {
    // 处理空数据导出情况
    // 为每个key创建一个空对象
    const emptyObj = {}
    keys.forEach((key) => {
      emptyObj[key] = ''
    })
    worksheet = utils.json_to_sheet([emptyObj], { header: keys })
  }
  else {
    // 正常数据导出
    worksheet = utils.json_to_sheet(data, { header: keys })
  }

  // 添加表头
  utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' })

  // 设置表头样式（加粗）
  const range = utils.decode_range(worksheet['!ref'])
  for (let col = range.s.c; col <= range.e.c; ++col) {
    const cellRef = utils.encode_cell({ r: 0, c: col })
    if (!worksheet[cellRef])
      continue
    worksheet[cellRef].s = {
      font: {
        bold: true,
      },
      alignment: {
        horizontal: 'center',
        vertical: 'center',
      },
    }
  }

  // 如果需要自动调整列宽
  if (props.autoWidth) {
    // 获取所有列的最大宽度
    const columnsWidth = []

    // 先加入表头的宽度
    header.forEach((h, idx) => {
      columnsWidth[idx] = {
        wch: calculateCellWidth(h.toString()),
      }
    })

    // 遍历所有数据行
    if (data.length > 0) {
      const dataKeys = keys || Object.keys(data[0])
      data.forEach((row) => {
        dataKeys.forEach((key, idx) => {
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

  // 添加到工作簿
  utils.book_append_sheet(wb, worksheet, 'Sheet1')

  // 导出文件
  const fileType = props.exportType === 'xlsx' ? 'xlsx' : 'csv'
  const bookType = props.exportType === 'xlsx' ? 'xlsx' : 'csv'

  // 生成文件并下载
  const wbout = write(wb, { bookType, type: 'array' })
  const blob = new Blob([wbout], { type: 'application/octet-stream' })

  // 添加时间戳
  const timestamp = new Date().getTime()
  const fullFileName = `${fileName}_${timestamp}.${fileType}`

  fileSaver.saveAs(blob, fullFileName)

  // 导出成功提示
  emit('success')
}

/**
 * 计算单元格宽度
 * @param {string} cellValue 单元格内容
 * @returns {number} 宽度值
 */
function calculateCellWidth(cellValue) {
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
</script>

<style scoped>
.export-excel-wrapper {
  display: inline-block;
  margin-left: 12px;
}
</style>
