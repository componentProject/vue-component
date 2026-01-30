<!-- VoidFieldRenderer - 布局字段渲染器 -->
<template>
  <template v-if="shouldRender">
    <!-- 卡片容器 -->
    <template v-if="field.layout === 'card'">
      <component
        :is="layoutComponents.card"
        :title="computedTitle"
        :header="computedTitle"
        v-bind="componentProps"
        class="config-form-card"
      >
        <!-- Element Plus 使用 #header slot, Ant Design Vue 使用 #title slot -->
        <template v-if="computedTitle && isCollapsible" #header>
          <div class="config-form-card__header">
            <span>{{ computedTitle }}</span>
            <component
              :is="layoutComponents.button"
              type="primary"
              link
              @click="toggleCollapse"
            >
              {{ isExpanded ? '收起' : '展开' }}
            </component>
          </div>
        </template>
        <template v-if="computedTitle && isCollapsible" #title>
          <div class="config-form-card__header">
            <span>{{ computedTitle }}</span>
            <component
              :is="layoutComponents.button"
              type="primary"
              link
              @click="toggleCollapse"
            >
              {{ isExpanded ? '收起' : '展开' }}
            </component>
          </div>
        </template>

        <Transition name="collapse">
          <div v-show="isExpanded">
            <component :is="layoutComponents.row" :gutter="16">
              <template v-for="(childField, childName) in childFields" :key="childName">
                <component :is="layoutComponents.col" v-bind="getColProps(childField)">
                  <FieldRenderer
                    :field="childField"
                    :path="getChildPath(childName)"
                    :context="context"
                  >
                    <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
                      <slot :name="slotName" v-bind="slotProps" />
                    </template>
                  </FieldRenderer>
                </component>
              </template>
            </component>
          </div>
        </Transition>
      </component>
    </template>

    <!-- 折叠面板 -->
    <template v-else-if="field.layout === 'collapse'">
      <component
        :is="layoutComponents.collapse"
        v-model="activeCollapseKeys"
        :accordion="isAccordion"
        v-bind="componentProps"
        class="config-form-collapse"
      >
        <component
          :is="layoutComponents.collapseItem"
          v-for="panel in collapsePanels"
          :key="panel.key"
          :name="panel.key"
          :title="getPanelTitle(panel)"
          :disabled="isPanelDisabled(panel)"
        >
          <component :is="layoutComponents.row" :gutter="16">
            <template v-for="(childField, childName) in panel.properties" :key="childName">
              <component :is="layoutComponents.col" v-bind="getColProps(childField)">
                <FieldRenderer
                  :field="childField"
                  :path="getChildPath(childName)"
                  :context="context"
                >
                  <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
                    <slot :name="slotName" v-bind="slotProps" />
                  </template>
                </FieldRenderer>
              </component>
            </template>
          </component>
        </component>
      </component>
    </template>

    <!-- 标签页 -->
    <template v-else-if="field.layout === 'tabs'">
      <component
        :is="layoutComponents.tabs"
        v-model="activeTabKey"
        :tab-position="tabPosition"
        v-bind="componentProps"
        class="config-form-tabs"
      >
        <component
          :is="layoutComponents.tabPane"
          v-for="tab in tabPanes"
          :key="tab.key"
          :name="tab.key"
          :label="getTabTitle(tab)"
          :disabled="isTabDisabled(tab)"
        >
          <component :is="layoutComponents.row" :gutter="16">
            <template v-for="(childField, childName) in tab.properties" :key="childName">
              <component :is="layoutComponents.col" v-bind="getColProps(childField)">
                <FieldRenderer
                  :field="childField"
                  :path="getChildPath(childName)"
                  :context="context"
                >
                  <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
                    <slot :name="slotName" v-bind="slotProps" />
                  </template>
                </FieldRenderer>
              </component>
            </template>
          </component>
        </component>
      </component>
    </template>

    <!-- 分组 -->
    <template v-else-if="field.layout === 'group'">
      <div class="config-form-group" v-bind="componentProps">
        <div v-if="computedTitle" class="config-form-group__title">
          {{ computedTitle }}
        </div>
        <component :is="layoutComponents.row" :gutter="16">
          <template v-for="(childField, childName) in childFields" :key="childName">
            <component :is="layoutComponents.col" v-bind="getColProps(childField)">
              <FieldRenderer
                :field="childField"
                :path="getChildPath(childName)"
                :context="context"
              >
                <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
                  <slot :name="slotName" v-bind="slotProps" />
                </template>
              </FieldRenderer>
            </component>
          </template>
        </component>
      </div>
    </template>

    <!-- 分割线 -->
    <template v-else-if="field.layout === 'divider'">
      <component :is="layoutComponents.divider" v-bind="componentProps">
        <template v-if="computedTitle">
          {{ computedTitle }}
        </template>
      </component>
    </template>

    <!-- 提示信息 -->
    <template v-else-if="field.layout === 'alert'">
      <component
        :is="layoutComponents.alert"
        :title="computedTitle || ''"
        :description="computedDescription"
        v-bind="componentProps"
        class="config-form-alert"
      />
    </template>

    <!-- 通用 void 容器 -->
    <template v-else>
      <div class="config-form-void" v-bind="componentProps">
        <component :is="layoutComponents.row" :gutter="16">
          <template v-for="(childField, childName) in childFields" :key="childName">
            <component :is="layoutComponents.col" v-bind="getColProps(childField)">
              <FieldRenderer
                :field="childField"
                :path="getChildPath(childName)"
                :context="context"
              >
                <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
                  <slot :name="slotName" v-bind="slotProps" />
                </template>
              </FieldRenderer>
            </component>
          </template>
        </component>
      </div>
    </template>
  </template>
</template>

<script setup lang="ts">
import type { ComputedRef } from 'vue'
import type { CardFieldConfig, CollapseFieldConfig, CollapsePanel, FieldConfig, FormContext, TabPane, TabsFieldConfig, UIAdapter } from '../types'
import { computed, inject, ref } from 'vue'
import { executeExpression } from '../utils'
import FieldRenderer from './FieldRenderer.vue'

defineOptions({
  name: 'VoidFieldRenderer',
})

const props = defineProps<{
  /** 字段配置 */
  field: FieldConfig
  /** 字段路径 */
  path: string
  /** 表单上下文 */
  context: FormContext
}>()

const formHandlers = inject<Record<string, (...args: any[]) => any>>('configFormHandlers', {})

// 注入 adapter
const adapter = inject<ComputedRef<UIAdapter>>('configFormAdapter')

// 布局组件快捷访问
const layoutComponents = computed(() => adapter?.value.layout || {})

// 卡片展开状态
const isExpanded = ref(
  (props.field as CardFieldConfig).defaultExpanded !== false,
)

// 折叠面板激活项
const activeCollapseKeys = ref<string[]>(
  (props.field as CollapseFieldConfig).defaultActiveKey || [],
)

// 标签页激活项
const activeTabKey = ref<string>(
  (props.field as TabsFieldConfig).defaultActiveKey
  || ((props.field as TabsFieldConfig).tabs?.[0]?.key || ''),
)

// 是否应该渲染
const shouldRender = computed(() => {
  if (!props.field.display)
    return true
  const display = executeExpression(props.field.display, props.context, { handlers: formHandlers })
  return display !== 'none'
})

// 计算标题
const computedTitle = computed(() => {
  if (!props.field.title) {
    // 尝试获取 cardTitle
    if ('cardTitle' in props.field) {
      return executeExpression((props.field as CardFieldConfig).cardTitle, props.context, { handlers: formHandlers })
    }
    return undefined
  }
  return executeExpression(props.field.title, props.context, { handlers: formHandlers })
})

// 计算描述
const computedDescription = computed(() => {
  if (!props.field.description)
    return undefined
  return executeExpression(props.field.description, props.context, { handlers: formHandlers })
})

// 是否可折叠
const isCollapsible = computed(() => {
  return (props.field as CardFieldConfig).collapsible === true
})

// 是否手风琴模式
const isAccordion = computed(() => {
  return (props.field as CollapseFieldConfig).accordion === true
})

// 标签页位置
const tabPosition = computed(() => {
  return (props.field as TabsFieldConfig).tabPosition || 'top'
})

// 子字段配置
const childFields = computed(() => {
  if ('properties' in props.field && props.field.properties) {
    return props.field.properties as Record<string, FieldConfig>
  }
  return {}
})

// 折叠面板配置
const collapsePanels = computed<CollapsePanel[]>(() => {
  if ('panels' in props.field) {
    return (props.field as CollapseFieldConfig).panels || []
  }
  return []
})

// 标签页配置
const tabPanes = computed<TabPane[]>(() => {
  if ('tabs' in props.field) {
    return (props.field as TabsFieldConfig).tabs || []
  }
  return []
})

// 组件属性
const componentProps = computed(() => {
  const baseProps: Record<string, any> = {}

  if (props.field.componentProps) {
    for (const [key, value] of Object.entries(props.field.componentProps)) {
      baseProps[key] = executeExpression(value, props.context, { handlers: formHandlers })
    }
  }

  return baseProps
})

/**
 * 切换折叠状态
 */
function toggleCollapse() {
  isExpanded.value = !isExpanded.value
}

/**
 * 获取子字段路径
 * 对于布局容器（有 layout 属性），不添加 path 前缀
 * 因为它们不产生数据，只是用于布局
 */
function getChildPath(childName: string): string {
  // 如果当前字段是布局容器（有 layout 属性），且 name 为空，则直接使用 childName
  if (props.field.layout && !props.field.name) {
    return childName
  }
  return props.path ? `${props.path}.${childName}` : childName
}

/**
 * 获取栅格属性
 */
function getColProps(field: FieldConfig) {
  if (field.col) {
    const col = executeExpression(field.col, props.context, { handlers: formHandlers })
    return col
  }
  return { span: 24 }
}

/**
 * 获取面板标题
 */
function getPanelTitle(panel: CollapsePanel): string {
  return executeExpression(panel.title, props.context, { handlers: formHandlers })
}

/**
 * 判断面板是否禁用
 */
function isPanelDisabled(panel: CollapsePanel): boolean {
  if (!panel.disabled)
    return false
  return executeExpression(panel.disabled, props.context, { handlers: formHandlers })
}

/**
 * 获取标签页标题
 */
function getTabTitle(tab: TabPane): string {
  return executeExpression(tab.title, props.context, { handlers: formHandlers })
}

/**
 * 判断标签页是否禁用
 */
function isTabDisabled(tab: TabPane): boolean {
  if (!tab.disabled)
    return false
  return executeExpression(tab.disabled, props.context, { handlers: formHandlers })
}
</script>

<style scoped>
.config-form-card {
  margin-bottom: 16px;
}

.config-form-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.config-form-collapse {
  margin-bottom: 16px;
}

.config-form-tabs {
  margin-bottom: 16px;
}

.config-form-group {
  margin-bottom: 16px;
}

.config-form-group__title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--el-border-color-light);
}

.config-form-alert {
  margin-bottom: 16px;
}

.config-form-void {
  margin-bottom: 16px;
}
</style>
