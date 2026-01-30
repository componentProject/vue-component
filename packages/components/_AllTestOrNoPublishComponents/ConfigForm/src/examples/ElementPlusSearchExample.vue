<!-- Element Plus 搜索栏表单示例 - 布局类型验证 -->
<template>
  <div class="search-form-example">
    <div class="example-section">
      <h3>Element Plus 搜索栏 - 布局类型验证</h3>

      <!-- 布局类型切换 -->
      <ElTabs v-model="activeLayout" type="card" class="layout-tabs">
        <ElTabPane label="Inline 布局" name="inline">
          <div class="layout-desc">
            <strong>inline:</strong> 所有字段在一行内水平排列，适合简单搜索栏
          </div>
          <ConfigForm
            :schema="getSchemaByLayout('inline')"
            :initial-values="searchInitialValues"
            :adapter="elementPlusAdapter"
            @submit="handleSearch"
          />
        </ElTabPane>

        <ElTabPane label="Horizontal 布局" name="horizontal">
          <div class="layout-desc">
            <strong>horizontal:</strong> 标签在左侧，输入框在右侧，适合表单详情
          </div>
          <ConfigForm
            :schema="getSchemaByLayout('horizontal')"
            :initial-values="searchInitialValues"
            :adapter="elementPlusAdapter"
            @submit="handleSearch"
          />
        </ElTabPane>

        <ElTabPane label="Vertical 布局" name="vertical">
          <div class="layout-desc">
            <strong>vertical:</strong> 标签在上方，输入框在下方，适合紧凑表单
          </div>
          <ConfigForm
            :schema="getSchemaByLayout('vertical')"
            :initial-values="searchInitialValues"
            :adapter="elementPlusAdapter"
            @submit="handleSearch"
          />
        </ElTabPane>
      </ElTabs>

      <div v-if="searchResult" class="search-result">
        <strong>搜索条件：</strong>
        <pre>{{ JSON.stringify(searchResult, null, 2) }}</pre>
      </div>
    </div>

    <div class="schema-preview">
      <h3>当前布局 Schema</h3>
      <p class="schema-desc">
        切换上方标签页查看不同布局类型的效果，仅需修改 <code>layout.type</code> 即可：
      </p>
      <pre class="schema-code">{{ currentSchemaPreview }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormSchema } from '../types'
import type { LayoutType } from '../types/constants'
/**
 * Element Plus 搜索栏表单示例
 * 展示三种布局类型：inline、horizontal、vertical
 */
import { ElTabPane, ElTabs } from 'element-plus'
import { computed, ref } from 'vue'
import { createElementPlusAdapter } from '../adapters/element-plus'
import ConfigForm from '../index.vue'

defineOptions({
  name: 'ElementPlusSearchExample',
})

// 适配器
const elementPlusAdapter = createElementPlusAdapter()

// 当前布局类型
const activeLayout = ref<LayoutType>('inline')

// 搜索结果
const searchResult = ref<Record<string, unknown> | null>(null)

/**
 * 基础字段配置
 */
const baseProperties = {
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
 * 根据布局类型生成 Schema
 * @param layoutType - 布局类型
 * @returns 表单 Schema
 */
function getSchemaByLayout(layoutType: LayoutType): FormSchema {
  return {
    id: `element-plus-search-form-${layoutType}`,
    name: '搜索表单',
    layout: {
      type: layoutType,
      labelWidth: layoutType === 'inline' ? '70px' : '100px',
    },
    properties: baseProperties as FormSchema['properties'],
    submit: {
      text: '搜索',
      buttonProps: { type: 'primary' },
    },
    reset: {
      text: '重置',
    },
  }
}

// 初始值
const searchInitialValues = {
  keyword: '',
  status: '',
  dateRange: [],
}

/**
 * 搜索处理
 * @param values - 搜索表单的值
 */
function handleSearch(values: Record<string, unknown>) {
  console.log(`[Element Plus - ${activeLayout.value}] 搜索条件:`, values)
  searchResult.value = values
}

/**
 * 当前布局的 Schema 预览
 */
const currentSchemaPreview = computed(() => {
  return `{
  id: 'element-plus-search-form',
  layout: {
    type: '${activeLayout.value}',  // 👈 切换布局类型
    labelWidth: '${activeLayout.value === 'inline' ? '70px' : '100px'}'
  },
  properties: {
    keyword: { type: 'input', title: '关键词', col: { span: 8 } },
    status: { type: 'select', title: '状态', col: { span: 8 } },
    dateRange: { type: 'dateRange', title: '时间', col: { span: 8 } }
  },
  submit: { text: '搜索' },
  reset: { text: '重置' }
}`
})
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

.schema-preview {
  padding: 20px;
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
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

.schema-desc code {
  padding: 2px 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  font-family: monospace;
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
