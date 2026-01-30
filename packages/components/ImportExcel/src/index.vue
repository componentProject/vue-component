<!-- ImportExcel组件主文件 -->
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

<script setup lang="ts">
import type { emitsType, propsType, slotsType } from './types'
import { getTypeDefault } from '@moluoxixi/utils/_utils'
import { ElButton } from 'element-plus'
import { computed, useTemplateRef } from 'vue'
import { read, utils } from 'xlsx'

defineOptions({
  name: 'ImportExcel',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<propsType>(), {
  titles: () => ['title', 'label'],
  fields: () => ['field', 'prop'],
})

const emit = defineEmits<emitsType>()

// 获取插槽
const slots = defineSlots<slotsType>()

const fileInputRef = useTemplateRef('fileInputRef')

/**
 * 规范化字符串或字符串数组为数组
 * @param val - 要规范化的值
 * @returns 规范化后的数组
 */
function toArray(val: any) {
  if (Array.isArray(val))
    return val.filter(v => v != null).map(v => String(v).trim())
  if (val == null)
    return []
  return [String(val).trim()]
}

/**
 * 从对象中按优先级获取第一个非空值
 * @param obj - 对象
 * @param keys - 键名或键名数组
 * @returns 第一个非空值
 */
function getValueByKeys(obj: any, keys: string | string[]) {
  const keyList = Array.isArray(keys) ? keys : [keys]
  for (const key of keyList) {
    const value = obj?.[key]
    if (value !== undefined && value !== null && value !== '')
      return value
  }
  return undefined
}

/**
 * 生成 [header, key] 映射对，支持 headers/keys 为字符串或字符串数组
 * @param columnsList - 列配置列表
 * @param titleKeys - 标题键名数组
 * @param fieldKeys - 字段键名数组
 * @returns 映射对数组
 */
function buildPairsFromColumns(columnsList: any[], titleKeys: string[], fieldKeys: string[]) {
  const pairs: [string, string][] = []
  columnsList.forEach((col: any) => {
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

/**
 * 触发文件选择
 */
function triggerSelect() {
  if (!fileInputRef.value)
    return
  fileInputRef.value.value = ''
  fileInputRef.value.click()
}

/**
 * 处理文件选择变化事件
 * @param e - 文件输入事件
 */
function handleFileChange(e: any) {
  const file = e?.target?.files?.[0]
  if (!file)
    return
  const reader = new FileReader()
  reader.onload = (evt) => {
    try {
      if (!evt.target || !evt.target.result)
        return
      const data = new Uint8Array(evt.target.result as ArrayBuffer)
      const wb = read(data, { type: 'array' })
      const firstSheetName = wb.SheetNames[0]
      const ws = wb.Sheets[firstSheetName]

      // 将sheet转为json，包含第一行表头
      const sheetJson = utils.sheet_to_json(ws, { header: 1, defval: '' })
      if (!sheetJson.length) {
        emit('warning', {
          message: '文件为空',
          data: [],
        })
        return
      }

      const [headerRow, ...bodyRows] = sheetJson as any[][]
      // 构造头部映射，支持 label->prop 与 title->field 匹配
      const headerMap = headerToKeyMap.value
      const keys = headerRow.map((h: any) => headerMap.get(String(h).trim()) || null)

      // 只保留映射到的列
      const filteredIndexes = keys
        .map((k: any, idx: any) => (k ? idx : -1))
        .filter((idx: number) => idx >= 0)

      const mappedKeys = filteredIndexes.map((i: number) => keys[i])

      // 组装数据
      const result = bodyRows.map((row: any[]) => {
        const obj: Record<string, any> = {}
        filteredIndexes.forEach((i: number, colIdx: number) => {
          obj[mappedKeys[colIdx]] = row[i]
        })
        return obj
      })

      emit('success', {
        message: '导入成功',
        data: result,
      })
    }
    catch (err) {
      console.error(err)
      emit('error', {
        message: '解析失败，请检查文件格式',
        error: err,
      })
    }
  }
  reader.onerror = (err) => {
    emit('error', {
      message: '文件读取失败',
      error: err,
    })
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
