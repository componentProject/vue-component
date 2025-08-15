<template>
  <div class="import-excel-wrapper">
    <ElButton v-bind="$attrs" @click="triggerSelect">
      <slot>
        导入
      </slot>
    </ElButton>
    <input
      ref="fileInputRef"
      class="import-excel-input"
      type="file"
      accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
      @change="handleFileChange"
    >
  </div>
</template>

<script setup>
import { ElButton, ElMessage } from 'element-plus'
import { computed, nextTick } from 'vue'
import * as XLSX from 'xlsx'
import { getTypeDefault } from '@moluoxixi/components/_utils/index.ts'

defineOptions({
  name: 'ImportExcel',
  inheritAttrs: false,
})

const props = defineProps({
  // 列配置（数组）：例如 [{ label/title, prop/field, ... }]
  // 具体使用哪个键由 titles/fields 两个优先级数组决定
  columns: {
    type: Array,
    required: true,
  },
  // 从 columns 中匹配列头名称时用到的字段名优先级
  // 例如：['title', 'label'] 将优先取 col.title，其次取 col.label
  titles: {
    type: Array,
    default: () => ['title', 'label'],
  },
  // 从 columns/tableData 中匹配字段 key 时用到的字段名优先级
  // 例如：['field', 'prop'] 将优先取 col.field，其次取 col.prop
  fields: {
    type: Array,
    default: () => ['field', 'prop'],
  },
})

const emits = defineEmits([
  // 导入成功，抛出解析后的数组数据
  'success',
  // 导入失败或中断，抛出错误信息
  'error',
])

const fileInputRef = useTemplateRef('fileInputRef')

// 规范化字符串或字符串数组为数组
function toArray(val) {
  if (Array.isArray(val))
    return val.filter(v => v != null).map(v => String(v).trim())
  if (val == null)
    return []
  return [String(val).trim()]
}

// 从对象中按优先级获取第一个非空值
function getValueByKeys(obj, keys) {
  const keyList = Array.isArray(keys) ? keys : [keys]
  for (const key of keyList) {
    const value = obj?.[key]
    if (value !== undefined && value !== null && value !== '')
      return value
  }
  return undefined
}

// 生成 [header, key] 映射对，支持 headers/keys 为字符串或字符串数组
function buildPairsFromColumns(columnsList, titleKeys, fieldKeys) {
  const pairs = []
  columnsList.forEach((col) => {
    const headerVal = getValueByKeys(col, titleKeys)
    const keyVal = getValueByKeys(col, fieldKeys)
    const headerList = toArray(headerVal)
    const keyList = toArray(keyVal)
    if (headerList.length === 0 || keyList.length === 0)
      return
    if (headerList.length === keyList.length) {
      headerList.forEach((h, idx) => {
        pairs.push([h, keyList[idx]])
      })
    }
    else if (headerList.length > 0 && keyList.length === 1) {
      headerList.forEach((h) => {
        pairs.push([h, keyList[0]])
      })
    }
    else if (headerList.length === 1 && keyList.length > 1) {
      pairs.push([headerList[0], keyList[0]])
    }
  })
  return pairs
}

// 映射：表头 -> 结果键
// 仅依赖 titles/fields 指定的键名从 columns 数组项中提取
const headerToKeyMap = computed(() => {
  const map = new Map()
  const columnsList = getTypeDefault(props.columns, 'array')
  const pairs = buildPairsFromColumns(columnsList, props.titles, props.fields)
  pairs.forEach(([h, k]) => {
    if (h && k)
      map.set(h, k)
  })
  return map
})

function triggerSelect() {
  if (!fileInputRef.value)
    return
  fileInputRef.value.value = ''
  fileInputRef.value.click()
}

function handleFileChange(e) {
  const file = e?.target?.files?.[0]
  if (!file)
    return
  const reader = new FileReader()
  reader.onload = (evt) => {
    try {
      const data = new Uint8Array(evt.target.result)
      const wb = XLSX.read(data, { type: 'array' })
      const firstSheetName = wb.SheetNames[0]
      const ws = wb.Sheets[firstSheetName]

      // 将sheet转为json，包含第一行表头
      const sheetJson = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' })
      if (!sheetJson.length) {
        ElMessage.warning('文件为空')
        emits('success', [])
        return
      }

      const [headerRow, ...bodyRows] = sheetJson
      // 构造头部映射，支持 label->prop 与 title->field 匹配
      const headerMap = headerToKeyMap.value
      const keys = headerRow.map(h => headerMap.get(String(h).trim()) || null)

      // 只保留映射到的列
      const filteredIndexes = keys
        .map((k, idx) => (k ? idx : -1))
        .filter(idx => idx >= 0)

      const mappedKeys = filteredIndexes.map(i => keys[i])

      // 组装数据
      const result = bodyRows.map((row) => {
        const obj = {}
        filteredIndexes.forEach((i, colIdx) => {
          obj[mappedKeys[colIdx]] = row[i]
        })
        return obj
      })

      emits('success', result)
      nextTick(() => {
        ElMessage.success('导入成功')
      })
    }
    catch (err) {
      console.error(err)
      ElMessage.error('解析失败，请检查文件格式')
      emits('error', err)
    }
  }
  reader.onerror = (err) => {
    ElMessage.error('文件读取失败')
    emits('error', err)
  }
  reader.readAsArrayBuffer(file)
}
</script>

<style scoped>
.import-excel-wrapper {
  display: inline-block;
}
.import-excel-input {
  display: none;
}
</style>
