<!-- CustomComponentExample - Element Plus 自定义组件示例 -->
<template>
  <div class="custom-component-example">
    <div class="example-desc">
      <h3>自定义组件接入方式（参考 Formily x-component / x-decorator）</h3>
      <p>通过 <code>component</code> 属性传入自定义组件，<code>decorator: false</code> 可禁用 FormItem 包装</p>
    </div>

    <ConfigForm
      v-model="customComponentValues"
      :schema="customComponentSchema"
      :initial-values="customComponentInitialValues"
      @submit="handleCustomSubmit"
    />

    <ElCollapse v-model="customActiveCollapse" class="example-schema">
      <ElCollapseItem title="Schema 配置" name="schema">
        <pre>{{ JSON.stringify(customComponentSchema, null, 2) }}</pre>
      </ElCollapseItem>
      <ElCollapseItem title="当前表单值" name="values">
        <pre>{{ JSON.stringify(customComponentValues, null, 2) }}</pre>
      </ElCollapseItem>
    </ElCollapse>
  </div>
</template>

<script setup lang="ts">
import type { FormSchema } from '../../types'
import { ElCollapse, ElCollapseItem, ElMessage } from 'element-plus'
import { ref } from 'vue'
import ConfigForm from '../../index.vue'
// 导入自定义组件
import { StarRating, TagInput } from '../components'

defineOptions({
  name: 'CustomComponentExample',
})

// 当前表单值
const customComponentValues = ref<Record<string, any>>({})

// 展开的折叠面板
const customActiveCollapse = ref(['schema', 'values'])

// 自定义组件表单 Schema
const customComponentSchema: FormSchema = {
  id: 'custom-component-schema',
  layout: {
    type: 'horizontal',
    labelWidth: '140px',
  },
  properties: {
    // 方式一：component 直接传入组件实例（推荐）
    tags: {
      type: 'array',
      title: '标签输入',
      description: 'component 直接传入组件实例（推荐方式）',
      component: TagInput,
      componentProps: {
        placeholder: '输入标签后按 Enter 添加',
        maxTags: 5,
        separator: ',',
      },
      col: { span: 12 },
    },
    // 方式二：component 传入另一个自定义组件
    starRating: {
      type: 'number',
      title: '星级评分',
      description: 'component 传入星级评分组件',
      component: StarRating,
      componentProps: {
        maxStars: 5,
        showText: true,
        texts: ['很差', '较差', '一般', '较好', '很好'],
        activeColor: '#ff9900',
      },
      col: { span: 12 },
    },
    // 方式三：[组件, 默认props] 元组形式
    tagInputWithDefaults: {
      type: 'array',
      title: '带默认配置的标签输入',
      description: '[组件, 默认props] 元组形式',
      component: [TagInput, { maxTags: 3, placeholder: '最多3个标签' }],
      componentProps: {
        separator: '，',
      },
      col: { span: 12 },
    },
    // 方式四：不指定 component，使用 type 对应的默认组件
    normalInput: {
      type: 'input',
      title: '普通输入框（对比）',
      description: '不指定 component，使用 type 默认组件',
      componentProps: {
        placeholder: '这是普通的输入框',
      },
      col: { span: 12 },
    },
    // ===== 无 FormItem 包装示例（低代码场景） =====
    noDecoratorSection: {
      layout: 'card',
      cardTitle: 'Decorator 配置演示',
      description: '通过 decorator: false 实现无 FormItem 包装',
      properties: {
        // 方式五：decorator: false - 不包装 FormItem（低代码场景）
        rawInput: {
          type: 'input',
          decorator: false,
          componentProps: {
            placeholder: '无 FormItem 包装的输入框（无标签）',
            style: { width: '300px' },
          },
        },
        // 方式六：自定义组件 + decorator: false（完全自包含）
        fullCustom: {
          type: 'number',
          decorator: false,
          component: StarRating,
          componentProps: {
            maxStars: 5,
            showText: true,
            texts: ['很差', '较差', '一般', '较好', '很好'],
            activeColor: '#e91e63',
          },
        },
        // 方式七：同时演示 title 和 decorator 配合
        withTitle: {
          type: 'input',
          title: '带标题（有 FormItem）',
          componentProps: {
            placeholder: '对比：这个有 FormItem 包装',
          },
        },
        noTitle: {
          type: 'input',
          decorator: false,
          componentProps: {
            placeholder: '对比：这个无 FormItem 包装',
          },
        },
      },
    },
  },
  submit: {
    text: '提交',
    buttonProps: { type: 'primary' },
  },
  reset: {
    text: '重置',
  },
}

// 自定义组件表单初始值
const customComponentInitialValues = {
  tags: ['Vue', 'TypeScript', 'ConfigForm'],
  starRating: 4,
  tagInputWithDefaults: ['前端', '后端'],
  normalInput: '普通输入内容',
  // Decorator 示例初始值
  rawInput: '无包装输入',
  fullCustom: 3,
  withTitle: '有标题',
  noTitle: '无标题',
}

/**
 * 处理自定义组件表单提交
 * @param values - 表单值
 */
function handleCustomSubmit(values: Record<string, any>) {
  console.log('[自定义组件] 表单提交:', values)
  ElMessage.success('自定义组件表单提交成功')
}
</script>

<style scoped>
.custom-component-example {
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

.example-schema {
  margin-top: 24px;
}

.example-schema pre {
  background: #f5f7fa;
  padding: 16px;
  border-radius: 4px;
  overflow: auto;
  max-height: 400px;
  font-size: 12px;
}
</style>

