<!-- VoidFieldRenderer - 布局字段渲染器 -->
<template>
  <template v-if="shouldRender">
    <!-- 卡片容器 -->
    <template v-if="field.type === 'card'">
      <ElCard
        :header="computedTitle"
        v-bind="componentProps"
        class="config-form-card"
      >
        <template v-if="computedTitle" #header>
          <div class="config-form-card__header">
            <span>{{ computedTitle }}</span>
            <ElButton
              v-if="isCollapsible"
              type="primary"
              link
              @click="toggleCollapse"
            >
              {{ isExpanded ? '收起' : '展开' }}
            </ElButton>
          </div>
        </template>

        <ElCollapseTransition>
          <div v-show="isExpanded">
            <ElRow :gutter="16">
              <template v-for="(childField, childName) in childFields" :key="childName">
                <ElCol v-bind="getColProps(childField)">
                  <FieldRenderer
                    :field="childField"
                    :path="getChildPath(childName)"
                    :context="context"
                  >
                    <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
                      <slot :name="slotName" v-bind="slotProps" />
                    </template>
                  </FieldRenderer>
                </ElCol>
              </template>
            </ElRow>
          </div>
        </ElCollapseTransition>
      </ElCard>
    </template>

    <!-- 折叠面板 -->
    <template v-else-if="field.type === 'collapse'">
      <ElCollapse
        v-model="activeCollapseKeys"
        :accordion="isAccordion"
        v-bind="componentProps"
        class="config-form-collapse"
      >
        <ElCollapseItem
          v-for="panel in collapsePanels"
          :key="panel.key"
          :name="panel.key"
          :title="getPanelTitle(panel)"
          :disabled="isPanelDisabled(panel)"
        >
          <ElRow :gutter="16">
            <template v-for="(childField, childName) in panel.properties" :key="childName">
              <ElCol v-bind="getColProps(childField)">
                <FieldRenderer
                  :field="childField"
                  :path="getChildPath(childName)"
                  :context="context"
                >
                  <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
                    <slot :name="slotName" v-bind="slotProps" />
                  </template>
                </FieldRenderer>
              </ElCol>
            </template>
          </ElRow>
        </ElCollapseItem>
      </ElCollapse>
    </template>

    <!-- 标签页 -->
    <template v-else-if="field.type === 'tabs'">
      <ElTabs
        v-model="activeTabKey"
        :tab-position="tabPosition"
        v-bind="componentProps"
        class="config-form-tabs"
      >
        <ElTabPane
          v-for="tab in tabPanes"
          :key="tab.key"
          :name="tab.key"
          :label="getTabTitle(tab)"
          :disabled="isTabDisabled(tab)"
        >
          <ElRow :gutter="16">
            <template v-for="(childField, childName) in tab.properties" :key="childName">
              <ElCol v-bind="getColProps(childField)">
                <FieldRenderer
                  :field="childField"
                  :path="getChildPath(childName)"
                  :context="context"
                >
                  <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
                    <slot :name="slotName" v-bind="slotProps" />
                  </template>
                </FieldRenderer>
              </ElCol>
            </template>
          </ElRow>
        </ElTabPane>
      </ElTabs>
    </template>

    <!-- 分组 -->
    <template v-else-if="field.type === 'group'">
      <div class="config-form-group" v-bind="componentProps">
        <div v-if="computedTitle" class="config-form-group__title">
          {{ computedTitle }}
        </div>
        <ElRow :gutter="16">
          <template v-for="(childField, childName) in childFields" :key="childName">
            <ElCol v-bind="getColProps(childField)">
              <FieldRenderer
                :field="childField"
                :path="getChildPath(childName)"
                :context="context"
              >
                <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
                  <slot :name="slotName" v-bind="slotProps" />
                </template>
              </FieldRenderer>
            </ElCol>
          </template>
        </ElRow>
      </div>
    </template>

    <!-- 分割线 -->
    <template v-else-if="field.type === 'divider'">
      <ElDivider v-bind="componentProps">
        <template v-if="computedTitle">
          {{ computedTitle }}
        </template>
      </ElDivider>
    </template>

    <!-- 提示信息 -->
    <template v-else-if="field.type === 'alert'">
      <ElAlert
        :title="computedTitle || ''"
        :description="computedDescription"
        v-bind="componentProps"
        class="config-form-alert"
      />
    </template>

    <!-- 通用 void 容器 -->
    <template v-else>
      <div class="config-form-void" v-bind="componentProps">
        <ElRow :gutter="16">
          <template v-for="(childField, childName) in childFields" :key="childName">
            <ElCol v-bind="getColProps(childField)">
              <FieldRenderer
                :field="childField"
                :path="getChildPath(childName)"
                :context="context"
              >
                <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
                  <slot :name="slotName" v-bind="slotProps" />
                </template>
              </FieldRenderer>
            </ElCol>
          </template>
        </ElRow>
      </div>
    </template>
  </template>
</template>

<script setup lang="ts">
import type { CardFieldConfig, CollapseFieldConfig, CollapsePanel, FieldConfig, FormContext, TabPane, TabsFieldConfig } from '../_types'
import { ElAlert, ElButton, ElCard, ElCol, ElCollapse, ElCollapseItem, ElCollapseTransition, ElDivider, ElRow, ElTabPane, ElTabs } from 'element-plus'
import { computed, inject, ref } from 'vue'
import { executeExpression } from '../_utils'
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
 * 对于布局容器（void/card/collapse/tabs/group），不添加 path 前缀
 * 因为它们不产生数据，只是用于布局
 */
function getChildPath(childName: string): string {
  const voidTypes = ['void', 'card', 'collapse', 'tabs', 'group', 'divider', 'alert']
  // 如果当前字段是布局容器，且 name 为空或者是布局类型，则直接使用 childName
  if (voidTypes.includes(props.field.type) && !props.field.name) {
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
