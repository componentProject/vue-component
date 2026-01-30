<!-- EnterNextContainer组件主文件 -->
<template>
  <div v-if="!props.virtualRef" ref="containerRef" class="w-full">
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import type { emitsType, propsType, slotsType } from './types'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

defineOptions({
  name: 'EnterNextContainer',
})
const props = withDefaults(defineProps<propsType>(), {
  virtualRef: null,
  allowSelectNextInEmpty: false,
})

// 定义可以发出的事件
const emit = defineEmits<emitsType>()

// 获取插槽
const slots = defineSlots<slotsType>()

const containerRef = ref<HTMLElement | null>(null)
const inputElements = ref<HTMLElement[]>([])

// 计算要监听的元素 - 如果提供了virtualRef则使用它，否则使用容器元素
const elementToObserve = computed(() => {
  return props.virtualRef
    ? (props.virtualRef as ComponentPublicInstance)?.$el || props.virtualRef
    : containerRef.value
})

/**
 * 收集容器内所有 input 和 select 元素，并为它们添加事件监听器
 * @param type - 收集类型，'mounted' 表示组件挂载时调用
 */
function collectInputElements(type: string = '') {
  const container = elementToObserve.value
  if (!container)
    return

  // 先移除之前的事件监听器
  inputElements.value.forEach((el) => {
    el.removeEventListener('keyup', handleInputKeyUp)
  })

  // 收集所有的input和select元素
  const elements = Array.from(container.querySelectorAll('input, select,textarea')) as HTMLElement[]

  // 过滤掉有 disabled 属性的元素
  const enabledElements = elements.filter(el => !el.hasAttribute('disabled'))

  inputElements.value = enabledElements
  if (type === 'mounted') {
    nextTick(() => {
      setTimeout(() => {
        if (typeof props.focusNum === 'number') {
          const activeElement = props.autoNext ? enabledElements[props.focusNum - 1] : elements[props.focusNum - 1]
          if (props.autoNext) {
            activeElement?.focus()
          }
          else {
            activeElement?.focus()
          }
          const hasAriaActive = attributeExistsWithNoValue(activeElement, 'aria-expanded', 'false')
          if (hasAriaActive) {
            activeElement.click()
          }
        }
      })
    })
  }
  // 为每个元素添加keyup事件监听
  enabledElements.forEach((el) => {
    el.addEventListener('keyup', handleInputKeyUp)
  })
}

/**
 * 检查元素属性是否存在且值匹配
 * @param element - 要检查的元素
 * @param attributeName - 属性名
 * @param value - 期望的属性值，如果未提供则只检查属性是否存在
 * @returns 属性是否存在且值匹配
 */
function attributeExistsWithNoValue(element: HTMLElement, attributeName: string, value?: any) {
  const hasAttribute = element.hasAttribute(attributeName)
  if (!hasAttribute)
    return true
  if (value)
    return element.getAttribute(attributeName) === value
  return !!element.getAttribute(attributeName)
}

/**
 * 处理 input 元素的 keyup 事件，实现按 Enter 键自动跳转到下一个输入框
 * @param event - 键盘事件
 */
function handleInputKeyUp(event: KeyboardEvent) {
  // 只处理Enter键
  if (event.key !== 'Enter')
    return

  // 阻止默认行为，避免表单提交等操作
  event.preventDefault()

  // 获取当前焦点元素
  const activeElement = event.target as HTMLElement

  // 如果当前没有元素被聚焦，或者焦点的元素不在我们的收集列表中，返回
  if (!activeElement || !inputElements.value.includes(activeElement))
    return

  const hasAriaActive = attributeExistsWithNoValue(activeElement, 'aria-expanded', 'false')

  // //#region 与element的automatic-dropdown属性互斥，同时存在不同automatic-dropdown时，会出bug
  // // 检查当前元素是否是select
  // const isSelect = attributeExistsWithNoValue(activeElement, 'aria-expanded')
  //
  // // 检查当前select是否展开
  // const isExpend = attributeExistsWithNoValue(activeElement, 'aria-expanded', 'true')
  //
  // // 检查当前select是否有选中值
  // const selectHasValue = attributeExistsWithNoValue(activeElement, 'aria-activedescendant')
  //
  // // 检查是否可以正常跳转
  // const canSelectNext = isSelect && isExpend ? selectHasValue || props.allowSelectNextInEmpty : true
  // // if (!canSelectNext) return
  // console.log('canSelectNext', canSelectNext)
  // //#endregion
  if (!hasAriaActive) {
    emit('noSelectValue', activeElement)
    return
  }

  // 获取当前焦点元素在列表中的索引
  const currentIndex = inputElements.value.findIndex(el => el === activeElement)

  // 如果找到了当前元素，检查是否有下一个元素
  if (currentIndex >= 0) {
    // 如果当前已是最后一个元素或没有更多元素
    if (currentIndex === inputElements.value.length - 1 || inputElements.value.length <= 1) {
      // 触发没有下一个元素的事件
      emit('noNextInput', activeElement)
    }
    else {
      // 还有下一个元素，正常跳转
      const nextIndex = currentIndex + 1
      const nextElement = inputElements.value[nextIndex]
      nextElement.focus()
    }
  }
}

/**
 * 设置 MutationObserver 监听 DOM 变化，自动更新输入元素列表
 * @returns 清理函数
 */
function setupMutationObserver() {
  if (!elementToObserve.value)
    return

  const observer = new MutationObserver(() => {
    collectInputElements()
  })

  observer.observe(elementToObserve.value, {
    childList: true,
    subtree: true,
  })

  // 返回清理函数
  return () => observer.disconnect()
}

/**
 * 监听 virtualRef 的变化
 */
watch(
  () => props.virtualRef,
  () => {
    collectInputElements()
  },
)

/**
 * 监听 elementToObserve 的变化
 */
watch(
  () => elementToObserve.value,
  () => {
    collectInputElements()
  },
)

let cleanup: (() => void) | undefined
const divObserver = ref()

/**
 * 设置 IntersectionObserver 监听元素进入视口
 */
function setupDivObserver() {
  divObserver.value = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // console.log('✅ 元素进入视口', entry.target)
        collectInputElements('mounted')
      }
    })
  }, {
    root: null,
    threshold: 0.1,
    rootMargin: '0px',
  })
  divObserver.value.observe(elementToObserve.value)
}
/**
 * 清除 IntersectionObserver
 */
function clearDivObserver() {
  divObserver.value.disconnect()
}

/**
 * 组件挂载时设置观察器
 */
onMounted(() => {
  setupDivObserver()
  cleanup = setupMutationObserver()
})

/**
 * 组件卸载时清理所有监听器
 */
onUnmounted(() => {
  // 移除所有事件监听器
  inputElements.value.forEach((el) => {
    el.removeEventListener('keyup', handleInputKeyUp)
  })

  // 断开MutationObserver
  cleanup?.()
  clearDivObserver()
})
</script>

<style scoped>

</style>
