<!-- TsTest 子组件 -->
<template>
  <div class="ts-test-item">
    <div class="ts-test-item-header">
      <h3 class="ts-test-item-title">
        {{ title }}
      </h3>
    </div>
    <div class="ts-test-item-body">
      <p class="ts-test-item-text">
        {{ text }}
      </p>
      <button class="ts-test-item-btn" @click="handleItemClick">
        子组件按钮
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'TsTestItem',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<Props>(), {
  title: '子组件标题',
  text: '这是子组件的内容',
})

const emit = defineEmits<{
  click: [ev: MouseEvent]
}>()

interface Props {
  title?: string
  text?: string
}

function handleItemClick(ev: MouseEvent) {
  emit('click', ev)
}
</script>

<style lang="scss">
/* 子组件样式 - 不使用 scoped，用于测试样式隔离 */

/* 类选择器 */
.ts-test-item {
  padding: 12px;
  margin: 8px 0;
  background: #ffffff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

/* 后代选择器 */
.ts-test-item .ts-test-item-header {
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #ebeef5;
}

/* 子选择器 */
.ts-test-item-header > .ts-test-item-title {
  font-size: 16px;
  font-weight: 500;
  color: #606266;
  margin: 0;
}

/* 属性选择器 */
.ts-test-item[data-active] {
  border-color: #409eff;
  background: #ecf5ff;
}

/* 伪类选择器 */
.ts-test-item-btn:hover {
  background: #66b1ff;
}

/* 伪元素选择器 */
.ts-test-item-text::after {
  content: ' (子组件)';
  color: #909399;
  font-size: 12px;
}

/* display: block */
.ts-test-item-body {
  display: block;
}

/* width */
.ts-test-item {
  width: 100%;
}

/* height */
.ts-test-item-header {
  min-height: 32px;
}

/* margin */
.ts-test-item-text {
  margin: 0 0 12px 0;
}

/* padding */
.ts-test-item-btn {
  padding: 6px 12px;
}

/* border */
.ts-test-item-btn {
  border: 1px solid #409eff;
}

/* border-radius */
.ts-test-item-btn {
  border-radius: 4px;
}

/* background */
.ts-test-item-btn {
  background: #409eff;
}

/* color */
.ts-test-item-btn {
  color: #ffffff;
}

/* font-size */
.ts-test-item-btn {
  font-size: 14px;
}

/* font-weight */
.ts-test-item-title {
  font-weight: 500;
}

/* line-height */
.ts-test-item-text {
  line-height: 1.5;
}

/* transition */
.ts-test-item-btn {
  transition: background 0.3s ease;
}

/* box-shadow */
.ts-test-item:hover {
  box-shadow: 0 2px 12px rgba(64, 158, 255, 0.2);
}

/* @media */
@media (max-width: 768px) {
  .ts-test-item {
    padding: 8px;
  }
}
</style>
