<template>
  <ElCheckboxGroup
    :id="checkboxId"
    v-bind="$attrs"
    ref="scrollContainer"
    v-model="data"
    :style="props.virtualScroll ? { overflow: 'auto', height: '100%' } : {}"
    @change="handleCheckboxChange"
    @scroll="handleScroll"
  >
    <!-- 虚拟滚动的占位元素 -->
    <div
      v-if="props.virtualScroll"
      class="virtual-scroll-placeholder"
      :style="{ height: `${serverOrLocalOptions.value.length * itemHeight}px`, position: 'absolute', top: 0, left: 0, width: '100%' }"
    />

    <!-- 实际渲染的内容 -->
    <div v-if="props.virtualScroll" :style="{ position: 'relative', transform: `translateY(${startIndex.value * itemHeight}px)` }">
      <template v-if="props.isGroup">
        <div
          v-for="(options, groupKey) in visibleGroupedOptions"
          :key="groupKey"
          class="checkbox-group"
        >
          <div class="group-main">
            <div class="group-line" />
            <div class="group-title">
              {{ props.groupLabel ? serverOrLocalOptions.find((item:any) => item[props.groupKey as string] === groupKey)?.[props.groupLabel] : groupKey }}
            </div>
          </div>
          <div class="checkbox-group-options" :style="computedStyle">
            <div
              v-for="item in options"
              :key="item[computedValue]"
              class="checkbox-wrapper"
              :data-value="item[computedValue]"
              :data-label="item[computedLabel]"
            >
              <ElTooltip
                v-if="tooltipVisible[item[computedValue]]"
                :content="item[computedLabel]"
                placement="right"
                effect="light"
              >
                <ElCheckbox
                  :label="item[computedValue]"
                  :disabled="
                    computedDisabledHandler({
                      label: item[computedLabel],
                      value: item[computedValue],
                      data: item,
                    })
                  "
                  v-bind="props.checkboxProps"
                  class="ellipsis-checkbox"
                >
                  {{ item[computedLabel] }}
                </ElCheckbox>
              </ElTooltip>
              <ElCheckbox
                v-else
                :label="item[computedValue]"
                :disabled="
                  computedDisabledHandler({
                    label: item[computedLabel],
                    value: item[computedValue],
                    data: item,
                  })
                "
                v-bind="props.checkboxProps"
                class="ellipsis-checkbox"
              >
                {{ item[computedLabel] }}
              </ElCheckbox>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="checkbox-group-options" :style="computedStyle">
          <div
            v-for="item in visibleOptions"
            :key="item[computedValue]"
            class="checkbox-wrapper"
            :data-value="item[computedValue]"
            :data-label="item[computedLabel]"
          >
            <ElTooltip
              v-if="tooltipVisible[item[computedValue]]"
              :content="item[computedLabel]"
              placement="right"
              effect="light"
            >
              <ElCheckbox
                :label="item[computedValue]"
                :disabled="
                  computedDisabledHandler({
                    label: item[computedLabel],
                    value: item[computedValue],
                    data: item,
                  })
                "
                v-bind="props.checkboxProps"
                class="ellipsis-checkbox"
              >
                {{ item[computedLabel] }}
              </ElCheckbox>
            </ElTooltip>
            <ElCheckbox
              v-else
              :label="item[computedValue]"
              :disabled="
                computedDisabledHandler({
                  label: item[computedLabel],
                  value: item[computedValue],
                  data: item,
                })
              "
              v-bind="props.checkboxProps"
              class="ellipsis-checkbox"
            >
              {{ item[computedLabel] }}
            </ElCheckbox>
          </div>
        </div>
      </template>
    </div>

    <!-- 非虚拟滚动模式 -->
    <template v-else>
      <template v-if="props.isGroup">
        <div
          v-for="(options, groupKey) in groupedOptions"
          :key="groupKey"
          class="checkbox-group"
        >
          <div class="group-main">
            <div class="group-line" />
            <div class="group-title">
              {{ props.groupLabel ? serverOrLocalOptions.find((item:any) => item[props.groupKey as string] === groupKey)?.[props.groupLabel] : groupKey }}
            </div>
          </div>
          <div class="checkbox-group-options" :style="computedStyle">
            <div
              v-for="item in options"
              :key="item[computedValue]"
              class="checkbox-wrapper"
              :data-value="item[computedValue]"
              :data-label="item[computedLabel]"
            >
              <ElTooltip
                v-if="tooltipVisible[item[computedValue]]"
                :content="item[computedLabel]"
                placement="right"
                effect="light"
              >
                <ElCheckbox
                  :label="item[computedValue]"
                  :disabled="
                    computedDisabledHandler({
                      label: item[computedLabel],
                      value: item[computedValue],
                      data: item,
                    })
                  "
                  v-bind="props.checkboxProps"
                  class="ellipsis-checkbox"
                >
                  {{ item[computedLabel] }}
                </ElCheckbox>
              </ElTooltip>
              <ElCheckbox
                v-else
                :label="item[computedValue]"
                :disabled="
                  computedDisabledHandler({
                    label: item[computedLabel],
                    value: item[computedValue],
                    data: item,
                  })
                "
                v-bind="props.checkboxProps"
                class="ellipsis-checkbox"
              >
                {{ item[computedLabel] }}
              </ElCheckbox>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="checkbox-group-options" :style="computedStyle">
          <div
            v-for="item in serverOrLocalOptions"
            :key="item[computedValue]"
            class="checkbox-wrapper"
            :data-value="item[computedValue]"
            :data-label="item[computedLabel]"
          >
            <ElTooltip
              v-if="tooltipVisible[item[computedValue]]"
              :content="item[computedLabel]"
              placement="right"
              effect="light"
            >
              <ElCheckbox
                :label="item[computedValue]"
                :disabled="
                  computedDisabledHandler({
                    label: item[computedLabel],
                    value: item[computedValue],
                    data: item,
                  })
                "
                v-bind="props.checkboxProps"
                class="ellipsis-checkbox"
              >
                {{ item[computedLabel] }}
              </ElCheckbox>
            </ElTooltip>
            <ElCheckbox
              v-else
              :label="item[computedValue]"
              :disabled="
                computedDisabledHandler({
                  label: item[computedLabel],
                  value: item[computedValue],
                  data: item,
                })
              "
              v-bind="props.checkboxProps"
              class="ellipsis-checkbox"
            >
              {{ item[computedLabel] }}
            </ElCheckbox>
          </div>
        </div>
      </template>
    </template>
  </ElCheckboxGroup>
</template>

<script setup lang="ts">
import type { emitsType, propsType } from './_types'
import { ElCheckbox, ElCheckboxGroup, ElTooltip } from 'element-plus'
import { computed, nextTick, onMounted, onUnmounted, onUpdated, ref, watch } from 'vue'
import { useOptions } from '../../_hooks'

defineOptions({
  name: 'TsCheckbox',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<propsType>(), {
  layout: 'flex',
  xGap: 16,
  gridColumns: 4,
  label: 'label',
  value: 'value',
  groupKey: undefined,
  groupLabel: undefined,
  disabledHandler: undefined,
  disabledValues: () => [],
  disabledLabels: () => [],
  options: () => [],
  requestMethod: 'POST',
  requestUrl: '',
  requestParams: () => ({}),
  requestParamsType: 'body',
  requestHeaders: () => ({}),
  responseDataPath: '',
  checkboxProps: () => ({}),
  virtualScroll: false,
  visibleCount: 20,
})

const emits = defineEmits<emitsType>()

const computedLabel = computed(() => props.labelKey || props.label)
const computedValue = computed(() => props.valueKey || props.value)

// 分组计算属性
const groupedOptions = computed(() => {
  if (!props.isGroup) {
    return { '': serverOrLocalOptions.value }
  }

  const groups: Record<string, any[]> = {}
  serverOrLocalOptions.value.forEach((item) => {
    const groupKey = item[props.groupKey]
    if (!groups[groupKey]) {
      groups[groupKey] = []
    }
    groups[groupKey].push(item)
  })
  return groups
})

const computedStyle = computed(() => {
  const baseStyle = {
    'column-gap': `${props.xGap}px`,
  }
  if (props.layout === 'grid') {
    return {
      ...baseStyle,
      'display': 'grid',
      'grid-template-columns': `repeat(${props.gridColumns}, minmax(0, 1fr))`,
      'overflow': 'hidden',
      'word-wrap': 'break-word',
      'word-break': 'break-all',
    }
  }
  else {
    return {
      ...baseStyle,
      'display': 'flex',
      'flex-wrap': 'wrap',
    }
  }
})

const checkboxId = `checkbox-${Math.random().toString(36).substr(2, 9)}`
// 支持数组和 Set 类型的 v-model
const modelValue = defineModel<any[] | Set<any>>()
const data = computed({
  get: () => {
    // 将 Set 转换为数组供 ElCheckboxGroup 使用
    if (modelValue.value instanceof Set) {
      return Array.from(modelValue.value)
    }
    return modelValue.value || []
  },
  set: (value: any[]) => {
    // 将数组转换为 Set 或保持数组类型
    if (modelValue.value instanceof Set) {
      modelValue.value = new Set(value)
    }
    else {
      modelValue.value = value
    }
  },
})

// 使用 useOptions hook 来处理 options 获取逻辑
const { options: serverOrLocalOptions } = useOptions(props)

// 直接使用 serverOrLocalOptions

/**
 * 默认禁用处理函数
 * @param param
 * @param param.label - 标签文本
 * @param param.value - 标签值
 * @returns 是否禁用
 */
function defaultDisabledHandler({ label, value }: { label: any, value: any }) {
  return props.disabledValues.includes(value) || props.disabledLabels.includes(label)
}

/**
 * 处理复选框变化事件
 * @param value - 选中的值数组
 */
function handleCheckboxChange(value: any) {
  emits('change', value)
}

/**
 * 计算禁用处理函数
 */
const computedDisabledHandler = computed(() => {
  return props.disabledHandler || defaultDisabledHandler
})

// 虚拟滚动相关
const scrollContainer = ref<HTMLElement | null>(null)
const scrollTop = ref(0)
const itemHeight = 32 // 假设每个选项的高度为32px

const startIndex = ref(0)
const endIndex = ref(props.visibleCount || 20)

// 计算可见的选项
const visibleOptions = computed(() => {
  if (!props.virtualScroll)
    return serverOrLocalOptions.value
  return serverOrLocalOptions.value.slice(startIndex.value, endIndex.value)
})

// 计算可见的分组选项
const visibleGroupedOptions = computed(() => {
  if (!props.virtualScroll || !props.isGroup)
    return groupedOptions.value

  // 对于分组模式，我们需要计算可见的分组
  const allOptions = serverOrLocalOptions.value
  const visibleItems = allOptions.slice(startIndex.value, endIndex.value)

  if (visibleItems.length === 0)
    return {}

  // 获取可见项中的分组
  const visibleGroups = new Set(visibleItems.map(item => item[props.groupKey]))

  // 构建可见的分组对象
  const result: Record<string, any[]> = {}
  visibleGroups.forEach((groupKey) => {
    result[groupKey] = groupedOptions.value[groupKey]
  })

  return result
})

// 处理滚动事件
function handleScroll(e: Event) {
  const target = e.target as HTMLElement
  const scrollPosition = target.scrollTop
  scrollTop.value = scrollPosition

  // 计算起始索引
  const newStartIndex = Math.max(0, Math.floor(scrollPosition / itemHeight) - 5)
  const newEndIndex = Math.min(
    serverOrLocalOptions.value.length,
    newStartIndex + (props.visibleCount || 20) + 10,
  )

  startIndex.value = newStartIndex
  endIndex.value = newEndIndex
}

// Tooltip visibility management
const tooltipVisible = ref<Record<string, boolean>>({})

// Intersection Observer实例
let observer: IntersectionObserver | null = null

// 检查单个元素是否需要显示tooltip
function checkSingleTooltipVisible(el: HTMLElement) {
  const value = el.dataset.value
  const labelEl = el.querySelector('.el-checkbox__label')

  if (value && labelEl) {
    // 立即检查，无需setTimeout
    tooltipVisible.value[value] = labelEl.scrollWidth > labelEl.clientWidth
  }
}

// 批量检查可见元素
function checkVisibleElements(entries: IntersectionObserverEntry[]) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // 元素进入视口，检查是否需要显示tooltip
      checkSingleTooltipVisible(entry.target as HTMLElement)
    }
  })
}

// 初始化Intersection Observer
function initObserver() {
  if (observer) {
    // 清理之前的observer
    observer.disconnect()
  }

  // 创建新的observer，只观察可见区域的元素
  observer = new IntersectionObserver(checkVisibleElements, {
    root: null, // 使用视口作为根元素
    rootMargin: '0px',
    threshold: 0.1, // 元素10%进入视口时触发
  })

  // 观察所有checkbox-wrapper元素
  document.querySelectorAll('.checkbox-wrapper').forEach((el) => {
    observer!.observe(el)
  })
}

// 事件委托处理鼠标悬停
function handleMouseEnter(e: MouseEvent) {
  const target = e.target as HTMLElement
  const checkboxWrapper = target.closest('.checkbox-wrapper') as HTMLElement

  if (checkboxWrapper) {
    const value = checkboxWrapper.dataset.value
    // 如果还没有检查过这个元素
    if (value && tooltipVisible.value[value] === undefined) {
      checkSingleTooltipVisible(checkboxWrapper)
    }
  }
}

onMounted(() => {
  nextTick(() => {
    // 初始化Intersection Observer
    initObserver()

    // 添加事件委托监听鼠标悬停
    document.querySelectorAll('.checkbox-group-options').forEach((el) => {
      el.addEventListener('mouseenter', handleMouseEnter)
    })

    // 初始化虚拟滚动
    if (props.virtualScroll && scrollContainer.value) {
      // 设置容器的高度
      scrollContainer.value.style.overflow = 'auto'
    }
  })
})

onUpdated(() => {
  nextTick(() => {
    // 重新初始化observer以处理新添加的元素
    initObserver()

    // 更新虚拟滚动
    if (props.virtualScroll) {
      // 重新计算可见范围
      const totalItems = serverOrLocalOptions.value.length
      endIndex.value = Math.min(totalItems, startIndex.value + (props.visibleCount || 20))
    }
  })
})

onUnmounted(() => {
  // 清理资源
  if (observer) {
    observer.disconnect()
  }

  document.querySelectorAll('.checkbox-group-options').forEach((el) => {
    el.removeEventListener('mouseenter', handleMouseEnter)
  })
})

// 监听选项变化，重置虚拟滚动
watch(() => serverOrLocalOptions.value.length, () => {
  if (props.virtualScroll) {
    scrollTop.value = 0
    startIndex.value = 0
    endIndex.value = Math.min(serverOrLocalOptions.value.length, props.visibleCount || 20)
  }
})
</script>

<style lang="scss" scoped>
.checkbox-wrapper {
  display: inline-block;
  position: relative;
  height: 32px; // 固定高度，用于虚拟滚动计算
}

.ellipsis-checkbox {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

// 虚拟滚动相关样式
.virtual-scroll-placeholder {
  pointer-events: none;
}

:deep(.el-checkbox-group) {
  position: relative;
  overflow: auto;
  height: 100%;
}
.checkbox-group {
  margin-bottom: 16px;
  width: 100%;
}

.group-main {
  display: flex;
  align-items: center;
  gap: 8px;
  line-height: 24px;
  font-weight: 700;

  .group-line {
    width: 4px;
    height: 14px;
    border-radius: 2px;
    background-color: var(--el-color-primary);
  }
  .group-title {
    flex: 1;
    font-size: 14px;
    line-height: 24px;
    color: #2a3651;
  }
}
</style>
