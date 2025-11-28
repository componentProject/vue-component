<!-- TsTest组件主文件 -->
<template>
  <div class="ts-test-container">
    <div class="ts-test-header">
      <h2 class="ts-test-title">
        {{ props.title || 'TsTest 组件' }}
      </h2>
      <p v-if="props.description" class="ts-test-description">
        {{ props.description }}
      </p>
    </div>
    <div class="ts-test-content">
      <div class="ts-test-card">
        <button class="ts-test-btn" @click="handleClick">
          按钮
        </button>
        <span class="ts-test-badge">标签</span>
      </div>
      <TsTestItem
        title="子组件示例"
        text="这是封装在 TsTest 中的子组件"
        @click="handleItemClick"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { emitsType, propsType, slotsType } from './_types'
import TsTestItem from './TsTestItem.vue'

defineOptions({
  name: 'TsTest',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<propsType>(), {
  title: 'TsTest 组件',
  description: '这是一个用于测试样式隔离的组件',
  theme: 'primary',
})

const emit = defineEmits<emitsType>()

// 获取插槽
const slots = defineSlots<slotsType>()

function handleClick(ev: MouseEvent) {
  emit('click', ev)
  emit('custom', { message: '自定义事件触发', timestamp: Date.now() })
}

function handleItemClick(ev: MouseEvent) {
  console.log('子组件点击事件:', ev)
  emit('custom', { message: '子组件事件触发', timestamp: Date.now() })
}
</script>
