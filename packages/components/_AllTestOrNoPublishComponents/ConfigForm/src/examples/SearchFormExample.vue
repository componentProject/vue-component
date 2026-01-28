<!-- 简单搜索栏表单示例 - 展示最小配置 -->
<template>
  <div class="search-form-example">
    <div class="example-section">
      <h3>Element Plus 搜索栏</h3>
      <ConfigForm
        ref="elementSearchRef"
        :schema="searchFormSchema"
        :initial-values="searchInitialValues"
        :adapter="elementPlusAdapter"
        @submit="handleElementSearch"
      />
      <div v-if="elementSearchResult" class="search-result">
        <strong>搜索条件：</strong>
        <pre>{{ JSON.stringify(elementSearchResult, null, 2) }}</pre>
      </div>
    </div>

    <div class="example-section">
      <h3>Ant Design Vue 搜索栏</h3>
      <ConfigForm
        ref="antdSearchRef"
        :schema="searchFormSchema"
        :initial-values="searchInitialValues"
        :adapter="antDesignVueAdapter"
        @submit="handleAntdSearch"
      />
      <div v-if="antdSearchResult" class="search-result">
        <strong>搜索条件：</strong>
        <pre>{{ JSON.stringify(antdSearchResult, null, 2) }}</pre>
      </div>
    </div>

    <div class="schema-preview">
      <h3>Schema 配置预览</h3>
      <p class="schema-desc">仅需以下配置即可生成完整的搜索表单：</p>
      <pre class="schema-code">{{ schemaPreview }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 简单搜索栏表单示例
 * 展示 ConfigForm 的最小配置方式
 */
import { ref } from 'vue'
import type { FormSchema } from '../_types'
import { createAntDesignVueAdapter } from '../adapters/ant-design-vue'
import { createElementPlusAdapter } from '../adapters/element-plus'
import ConfigForm from '../index.vue'

defineOptions({
  name: 'SearchFormExample',
})

// 适配器
const elementPlusAdapter = createElementPlusAdapter()
const antDesignVueAdapter = createAntDesignVueAdapter()

// 搜索结果
const elementSearchResult = ref<Record<string, unknown> | null>(null)
const antdSearchResult = ref<Record<string, unknown> | null>(null)

/**
 * 搜索栏表单 Schema - 最简配置示例
 */
const searchFormSchema: FormSchema = {
  id: 'search-form',
  name: '搜索表单',
  layout: {
    type: 'inline',
    labelWidth: '70px',
  },
  properties: {
    keyword: {
      type: 'input',
      title: '关键词',
      componentProps: {
        placeholder: '请输入关键词',
        clearable: true,
        style: { width: '180px' },
      },
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
        style: { width: '140px' },
      },
    },
    dateRange: {
      type: 'dateRange',
      title: '时间',
      componentProps: {
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        valueFormat: 'YYYY-MM-DD',
        style: { width: '240px' },
      },
    },
  },
  submit: {
    text: '搜索',
    buttonProps: { type: 'primary' },
  },
  reset: {
    text: '重置',
  },
}

// 初始值
const searchInitialValues = {
  keyword: '',
  status: '',
  dateRange: [],
}

/**
 * Element Plus 搜索处理
 */
function handleElementSearch(values: Record<string, unknown>) {
  console.log('[Element Plus] 搜索条件:', values)
  elementSearchResult.value = values
}

/**
 * Ant Design Vue 搜索处理
 */
function handleAntdSearch(values: Record<string, unknown>) {
  console.log('[Ant Design Vue] 搜索条件:', values)
  antdSearchResult.value = values
}

// Schema 预览文本
const schemaPreview = `{
  id: 'search-form',
  layout: { type: 'inline', labelWidth: '70px' },
  properties: {
    keyword: { type: 'input', title: '关键词' },
    status: {
      type: 'select',
      title: '状态',
      dataSource: {
        type: 'static',
        data: [
          { label: '全部', value: '' },
          { label: '待处理', value: 'pending' },
          // ...
        ]
      }
    },
    dateRange: { type: 'dateRange', title: '时间' }
  },
  submit: { text: '搜索' },
  reset: { text: '重置' }
}`
</script>

<style scoped>
.search-form-example {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.example-section {
  padding: 20px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #eee;
}

.example-section h3 {
  margin: 0 0 16px;
  font-size: 16px;
  color: #333;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
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

.schema-preview {
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  color: #fff;
}

.schema-preview h3 {
  margin: 0 0 8px;
  font-size: 18px;
}

.schema-desc {
  margin: 0 0 16px;
  opacity: 0.9;
  font-size: 14px;
}

.schema-code {
  margin: 0;
  padding: 16px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  font-size: 13px;
  line-height: 1.6;
  overflow-x: auto;
}
</style>

