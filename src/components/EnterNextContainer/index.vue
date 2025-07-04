<template>
  <div ref="containerRef" class="enter-next-container">
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { ComponentInternalInstance, ComponentPublicInstance } from 'vue'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

interface Props {
  virtualRef?: ComponentPublicInstance | ComponentInternalInstance | HTMLElement | null
  /**
   * 是否允许在select没有选中值时跳转
   */
  allowSelectNextInEmpty?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  virtualRef: null,
  allowSelectNextInEmpty: false,
})

// 定义可以发出的事件
const emit = defineEmits<{
  (e: 'noNextInput', element: HTMLElement): void // 当找不到下一个输入元素时触发
  (e: 'noSelectValue', element: HTMLElement): void // 当select为空时触发
}>()

const containerRef = ref<HTMLElement | null>(null)
const inputElements = ref<HTMLElement[]>([])

// 计算要监听的元素 - 如果提供了virtualRef则使用它，否则使用容器元素
const elementToObserve = computed(() => {
  return props.virtualRef
    ? (props.virtualRef as ComponentPublicInstance)?.$el || props.virtualRef
    : containerRef.value
})

// 获取容器内所有input和select元素，并为它们添加事件监听器
function collectInputElements() {
  const container = elementToObserve.value
  if (!container)
    return

  // 先移除之前的事件监听器
  inputElements.value.forEach((el) => {
    el.removeEventListener('keyup', handleInputKeyUp)
  })

  // 收集所有的input和select元素
  const elements = Array.from(container.querySelectorAll('input, select')) as HTMLElement[]
  inputElements.value = elements

  // 为每个元素添加keyup事件监听
  elements.forEach((el) => {
    el.addEventListener('keyup', handleInputKeyUp)
  })
}

// 检查属性是否存在且值为空
function attributeExistsWithNoValue(element: HTMLElement, attributeName: string, value?: any) {
  const hasAttribute = element.hasAttribute(attributeName)
  if (!hasAttribute)
    return true
  if (value)
    return element.getAttribute(attributeName) === value
  return !!element.getAttribute(attributeName)
}

// 处理input元素的keyup事件
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

// 设置MutationObserver监听DOM变化
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

// 监听virtualRef的变化
watch(
  () => props.virtualRef,
  () => {
    collectInputElements()
  },
)

// 监听elementToObserve的变化
watch(
  () => elementToObserve.value,
  () => {
    collectInputElements()
  },
)

let cleanup: (() => void) | undefined

onMounted(() => {
  collectInputElements()
  cleanup = setupMutationObserver()
})

onUnmounted(() => {
  // 移除所有事件监听器
  inputElements.value.forEach((el) => {
    el.removeEventListener('keyup', handleInputKeyUp)
  })

  // 断开MutationObserver
  cleanup?.()
})
</script>

<style scoped>
.enter-next-container {
  display: contents;
}
</style>
