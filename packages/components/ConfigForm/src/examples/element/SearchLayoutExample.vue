<!-- SearchLayoutExample - Element Plus 搜索栏布局示例 -->
<template>
  <div class="search-layout-example">
    <div class="example-desc">
      <h3>三种布局类型演示</h3>
      <p>通过修改 <code>layout.type</code> 即可切换布局类型</p>
    </div>

    <ElTabs v-model="searchLayout" type="card" class="layout-tabs">
      <ElTabPane label="Inline 布局" name="inline">
        <div class="layout-desc">
          <strong>inline:</strong> 所有字段在一行内水平排列，适合简单搜索栏
        </div>
        <ConfigForm
          :schema="getSearchSchemaByLayout('inline')"
          :initial-values="searchInitialValues"
          @submit="handleSearch"
        />
      </ElTabPane>

      <ElTabPane label="Horizontal 布局" name="horizontal">
        <div class="layout-desc">
          <strong>horizontal:</strong> 标签在左侧，输入框在右侧，适合表单详情
        </div>
        <ConfigForm
          :schema="getSearchSchemaByLayout('horizontal')"
          :initial-values="searchInitialValues"
          @submit="handleSearch"
        />
      </ElTabPane>

      <ElTabPane label="Vertical 布局" name="vertical">
        <div class="layout-desc">
          <strong>vertical:</strong> 标签在上方，输入框在下方，适合紧凑表单
        </div>
        <ConfigForm
          :schema="getSearchSchemaByLayout('vertical')"
          :initial-values="searchInitialValues"
          @submit="handleSearch"
        />
      </ElTabPane>
    </ElTabs>

    <div v-if="searchResult" class="search-result">
      <strong>搜索条件：</strong>
      <pre>{{ JSON.stringify(searchResult, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormSchema } from '../../types'
import type { LayoutType } from '../../types/constants'
import { ElMessage, ElTabPane, ElTabs } from 'element-plus'
import { ref } from 'vue'
import ConfigForm from '../../index.vue'

defineOptions({
  name: 'SearchLayoutExample',
})

// 当前选中的布局类型
const searchLayout = ref<LayoutType>('inline')

// 搜索结果
const searchResult = ref<Record<string, unknown> | null>(null)

// 搜索表单基础字段配置
const searchBaseProperties = {
  keyword: {
    type: 'input',
    title: '关键词',
    componentProps: {
      placeholder: '请输入关键词',
      clearable: true,
    },
    col: { span: 8 },
  },
  status: {
    type: 'select',
    title: '状态',
    dataSource: {
      type: 'static',
      data: [
        { label: '全部', value: '' },
        { label: '待处理', value: 'pending' },
        { label: '已完成', value: 'completed' },
        { label: '已取消', value: 'cancelled' },
      ],
    },
    componentProps: {
      placeholder: '请选择状态',
      clearable: true,
    },
    col: { span: 8 },
  },
  dateRange: {
    type: 'dateRange',
    title: '时间',
    componentProps: {
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期',
      valueFormat: 'YYYY-MM-DD',
    },
    col: { span: 8 },
  },
} as const

/**
 * 根据布局类型获取搜索表单 Schema
 * @param layoutType - 布局类型
 * @returns 表单 Schema
 */
function getSearchSchemaByLayout(layoutType: LayoutType): FormSchema {
  return {
    id: `element-plus-search-form-${layoutType}`,
    name: '搜索表单',
    layout: {
      type: layoutType,
      labelWidth: layoutType === 'inline' ? '70px' : '100px',
    },
    properties: searchBaseProperties as FormSchema['properties'],
    submit: {
      text: '搜索',
      buttonProps: { type: 'primary' },
    },
    reset: {
      text: '重置',
    },
  }
}

// 搜索表单初始值
const searchInitialValues = {
  keyword: '',
  status: '',
  dateRange: [],
}

/**
 * 处理搜索
 * @param values - 搜索条件
 */
function handleSearch(values: Record<string, unknown>) {
  console.log(`[Element Plus - ${searchLayout.value}] 搜索条件:`, values)
  searchResult.value = values
  ElMessage.success('搜索成功')
}
</script>

<style scoped>
.search-layout-example {
  padding: 16px 0;
}

.example-desc {
  margin-bottom: 20px;
  padding: 16px;
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  border-radius: 8px;
  color: #fff;
}

.example-desc h3 {
  margin: 0 0 8px;
  font-size: 18px;
}

.example-desc p {
  margin: 0;
  opacity: 0.9;
}

.example-desc code {
  padding: 2px 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  font-family: monospace;
}

.layout-tabs {
  margin-bottom: 16px;
}

.layout-desc {
  margin-bottom: 16px;
  padding: 12px 16px;
  background: #ecf5ff;
  border-radius: 4px;
  color: #409eff;
  font-size: 14px;
}

.layout-desc strong {
  color: #337ecc;
}

.search-result {
  margin-top: 16px;
  padding: 12px;
  background: #f0f9eb;
  border-radius: 4px;
  border: 1px solid #c2e7b0;
}

.search-result strong {
  color: #67c23a;
}

.search-result pre {
  margin: 8px 0 0;
  font-size: 12px;
  color: #606266;
  white-space: pre-wrap;
}
</style>

