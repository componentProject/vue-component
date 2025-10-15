<template>
  <div>
    <ElSelect
      :id="selectId"
      v-model="data"
      append-to="#app"
      :clearable="props.clearable"
      :filterable="props.filterable"
      :filter-method="computedFilterMethod"
      :collapse-tags="props.collapseTags"
      :tag-type="props.tagType"
      :teleported="props.teleported"
      :collapse-tags-tooltip="props.collapseTagsTooltip"
      v-bind="$attrs"
      @change="handleSelectChange"
      @visible-change="handleVisibleChange"
    >
      <ElOption
        v-for="(item) in computedOptions"
        :key="item[props.value]"
        :label="item[props.label]"
        :value="item[props.value]"
        :disabled="
          computedDisabledHandler({
            label: item[props.label],
            value: item[props.value],
            data: item,
          })
        "
      />
      <div
        v-if="props.enableLoadMore && props.hasMore"
        ref="loadMoreTrigger"
        class="load-more-trigger"
      >
        <span v-if="props.loading || isLoading">加载中...</span>
      </div>
    </ElSelect>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { computed, nextTick, onUnmounted, ref } from 'vue'
import { ElOption, ElSelect } from 'element-plus'
import { getType, getTypeDefault } from '@moluoxixi/utils/_utils'
import { useOptions } from '../../_hooks'

// 定义请求类型
type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
type RequestParamsType = 'query' | 'body' | 'form'

defineOptions({
  name: 'WlSelect',
})

const props = defineProps({
  tagType: {
    type: String as () => 'success' | 'info' | 'warning' | 'danger',
    default: 'primary',
  },
  teleported: {
    type: Boolean,
    default: true,
  },
  clearable: {
    type: Boolean,
    default: true,
  },
  filterable: {
    type: Boolean,
    default: true,
  },
  filterMethod: {
    type: Function as PropType<(query: string) => void>,
  },
  collapseTagsTooltip: {
    type: Boolean,
    default: true,
  },
  collapseTags: {
    type: Boolean,
    default: true,
  },
  label: {
    type: String,
    default: 'label',
  },
  value: {
    type: String,
    default: 'value',
  },
  disabledValues: {
    type: Array,
    default: () => [],
  },
  disabledLabels: {
    type: Array,
    default: () => [],
  },
  disabledHandler: {
    type: Function,
  },
  options: {
    type: Array,
    default: () => [],
  },
  filterFields: {
    type: Array,
    default: () => [],
  },
  // 开启加载更多
  enableLoadMore: {
    type: Boolean,
    default: false,
  },
  // 是否还有更多数据
  hasMore: {
    type: Boolean,
    default: false,
  },
  // 加载中
  loading: {
    type: Boolean,
    default: false,
  },
  // 请求类型
  requestMethod: {
    type: String as () => RequestMethod,
    default: 'POST',
  },
  // 请求地址
  requestUrl: {
    type: String,
    default: '',
  },
  // 请求入参
  requestParams: {
    type: Object,
    default: () => ({}),
  },
  // 入参类型
  requestParamsType: {
    type: String as () => RequestParamsType,
    default: 'body',
  },
  // 请求头
  requestHeaders: {
    type: Object,
    default: () => ({}),
  },
  // 返回值路径，例如 'list.data' 则获取 response.data.list.data
  responseDataPath: {
    type: String,
    default: '',
  },
})

const emits = defineEmits(['change', 'loadMore'])

const selectId = `select-${Math.random().toString(36).substr(2, 9)}`

const data = defineModel<any>()
const keyword = ref('')

const loadMoreTrigger = ref<HTMLElement>()
const observer = ref<IntersectionObserver>()
const isDropdownVisible = ref(false)
const hasTriggeredLoadMore = ref(false)

const allFilterFields = computed(() => {
  return Array.from(
    new Set(
      [
        ...getTypeDefault(props.filterFields, 'array'),
        'wbCode',
        'pyCode',
        'wbcode',
        'pycode',
        props.label,
        props.value,
      ].filter(item => item),
    ),
  )
})

// 使用 useOptions hook 来处理 options 获取逻辑
const { options: serverOrLocalOptions, isLoading } = useOptions({
  options: props.options,
  requestUrl: props.requestUrl,
  requestParams: props.requestParams,
  requestMethod: props.requestMethod,
  requestParamsType: props.requestParamsType,
  requestHeaders: props.requestHeaders,
  responseDataPath: props.responseDataPath,
})

const computedOptions = computed(() => {
  return getType(props.filterMethod, 'function')
    ? serverOrLocalOptions.value
    : serverOrLocalOptions.value.filter((item) => {
        return allFilterFields.value.some(field => item[field]?.toLowerCase().includes(keyword.value?.toLowerCase()))
      })
})

const computedFilterMethod = computed(() => {
  return props.filterMethod || defaultFilterMethod
})

function defaultFilterMethod(keywordStr: string) {
  keyword.value = keywordStr
}

function defaultDisabledHandler({ label, value }: { [label: string]: any }) {
  return props.disabledValues.includes(value) || props.disabledLabels.includes(label)
}

function handleSelectChange(value: any) {
  emits('change', value)
}

function handleVisibleChange(visible: boolean) {
  isDropdownVisible.value = visible

  if (visible) {
    hasTriggeredLoadMore.value = false

    if (props.enableLoadMore && props.hasMore && !props.loading) {
      setTimeout(() => {
        setupIntersectionObserver()
      }, 100)
    }
  }
  else {
    cleanupObserver()
  }
}

function setupIntersectionObserver() {
  if (!loadMoreTrigger.value || !props.hasMore || props.loading || hasTriggeredLoadMore.value) {
    return
  }

  cleanupObserver()

  // 使用 nextTick 确保 DOM 更新完成
  nextTick(() => {
    // 方法1: 通过 popper 属性查找当前激活的下拉框
    let dropdown = null

    // 获取当前 Select 元素
    const currentSelect = document.getElementById(selectId)
    if (!currentSelect) {
      console.warn('找不到当前 Select 元素')
      return
    }

    // 查找所有下拉框
    const allDropdowns = document.querySelectorAll('.el-select-dropdown')

    // 通过可见性判断当前激活的下拉框
    const activeDropdowns = Array.from(allDropdowns).filter((d) => {
      const style = window.getComputedStyle(d)
      return style.display !== 'none' && style.visibility !== 'hidden'
    })

    // 如果有多个激活的下拉框，选择最后一个（最新打开的）
    if (activeDropdowns.length > 0) {
      dropdown = activeDropdowns[activeDropdowns.length - 1]
    }

    // 确保找到下拉框的滚动容器
    if (dropdown) {
      dropdown = dropdown.querySelector('.el-select-dropdown__wrap') || dropdown
    }

    if (!dropdown) {
      console.warn('无法找到对应的下拉框容器')
      return
    }

    // 清理之前的调试代码
    observer.value = new IntersectionObserver((entries) => {
      const entry = entries[0]

      if (entry.isIntersecting
        && entry.intersectionRatio >= 0.1 // 降低阈值
        && props.enableLoadMore
        && props.hasMore
        && !props.loading
        && !hasTriggeredLoadMore.value) {
        hasTriggeredLoadMore.value = true
        emits('loadMore')

        // 3秒后重置状态
        setTimeout(() => {
          hasTriggeredLoadMore.value = false
        }, 1000)
      }
    }, {
      root: dropdown,
      rootMargin: '0px',
      threshold: [0.1],
    })

    observer.value.observe(loadMoreTrigger.value)
  })
}

function cleanupObserver() {
  if (observer.value) {
    observer.value.disconnect()
    observer.value = undefined
  }
}

const computedDisabledHandler = computed(() => {
  return getTypeDefault(props.disabledHandler, 'function') || defaultDisabledHandler
})

onUnmounted(() => {
  cleanupObserver()
})
</script>

<style scoped>
.load-more-trigger {
  padding: 8px 12px;
  text-align: center;
  color: #606266;
  font-size: 14px;
  border-top: 1px solid #eee;
  user-select: none;
}
</style>
