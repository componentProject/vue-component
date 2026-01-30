<!-- CustomComponentExample - Ant Design Vue 自定义组件示例 -->
<template>
  <div class="custom-component-example">
    <div class="example-desc">
      <h3>自定义组件接入方式（参考 Formily x-component）</h3>
      <p>通过 <code>component</code> 属性传入自定义组件，<code>type</code> 用于表示数据类型/语义</p>
    </div>

    <ConfigForm
      v-model="customComponentValues"
      :schema="customComponentSchema"
      :initial-values="customComponentInitialValues"
      :adapter="antDesignVueAdapter"
      @submit="handleCustomSubmit"
    />

    <ACollapse v-model:active-key="customActiveCollapse" class="example-schema">
      <ACollapsePanel key="schema" header="Schema 配置">
        <pre>{{ JSON.stringify(customComponentSchema, null, 2) }}</pre>
      </ACollapsePanel>
      <ACollapsePanel key="values" header="当前表单值">
        <pre>{{ JSON.stringify(customComponentValues, null, 2) }}</pre>
      </ACollapsePanel>
    </ACollapse>
  </div>
</template>

<script setup lang="ts">
import type { FormSchema } from '../../types'
import {
  Collapse as ACollapse,
  CollapsePanel as ACollapsePanel,
  message as AMessage,
} from 'ant-design-vue'
import { ref } from 'vue'
import { antDesignVueAdapter } from '../../adapters'
import ConfigForm from '../../index.vue'
// 导入自定义组件
import { StarRating, TagInput } from '../components'

defineOptions({
  name: 'AntdCustomComponentExample',
})

// 当前表单值
const customComponentValues = ref<Record<string, any>>({})

// 展开的折叠面板
const customActiveCollapse = ref(['schema', 'values'])

// 自定义组件表单 Schema
const customComponentSchema: FormSchema = {
  id: 'antd-custom-component-schema',
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
        activeColor: '#1890ff',
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
        // decorator: false - 不包装 FormItem
        rawInput: {
          type: 'input',
          decorator: false,
          componentProps: {
            placeholder: '无 FormItem 包装的输入框（无标签）',
            style: { width: '300px' },
          },
        },
        // 自定义组件 + decorator: false
        fullCustom: {
          type: 'number',
          decorator: false,
          component: StarRating,
          componentProps: {
            maxStars: 5,
            showText: true,
            texts: ['很差', '较差', '一般', '较好', '很好'],
            activeColor: '#722ed1',
          },
        },
        // 对比：有 FormItem 包装
        withTitle: {
          type: 'input',
          title: '带标题（有 FormItem）',
          componentProps: {
            placeholder: '对比：这个有 FormItem 包装',
          },
        },
        // 对比：无 FormItem 包装
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
  tags: ['Vue', 'TypeScript', 'Ant Design'],
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
  AMessage.success('自定义组件表单提交成功')
}
</script>

<style scoped>
.custom-component-example {
  padding: 16px 0;
}

.example-desc {
  margin-bottom: 20px;
  padding: 16px;
  background: linear-gradient(135deg, #1890ff 0%, #36cfc9 100%);
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
  background: #fafafa;
  padding: 16px;
  border-radius: 4px;
  overflow: auto;
  max-height: 400px;
  font-size: 12px;
}
</style>

