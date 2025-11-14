<!-- TsTest组件示例 -->
<template>
  <div class="example-container">
    <h1>TsTest 组件示例</h1>

    <div class="example-section">
      <h2>基础用法</h2>
      <TsTest
        title="基础示例"
        description="这是一个基础的 TsTest 组件示例"
        theme="primary"
        @click="handleClick"
        @custom="handleCustom"
      />
    </div>

    <div class="example-section">
      <h2>不同主题</h2>
      <div class="theme-examples">
        <TsTest
          v-for="theme in themes"
          :key="theme"
          :title="`${theme} 主题`"
          :description="`这是 ${theme} 主题的示例`"
          :theme="theme"
          class="theme-item"
        />
      </div>
    </div>

    <div class="example-section">
      <h2>使用插槽</h2>
      <TsTest title="插槽示例" theme="success">
        <template #title>
          <h2 style="color: #67c23a;">
            自定义标题
          </h2>
        </template>
        <template #content>
          <div style="padding: 20px; text-align: center;">
            <p>这是自定义内容区域</p>
            <button style="padding: 10px 20px; background: #67c23a; color: white; border: none; border-radius: 4px;">
              自定义按钮
            </button>
          </div>
        </template>
      </TsTest>
    </div>
  </div>
</template>

<script setup lang="ts">
import TsTest from './index.vue'

const themes = ['primary', 'success', 'warning', 'danger', 'info'] as const

function handleClick(ev: MouseEvent) {
  console.log('点击事件:', ev)
}

function handleCustom(data: any) {
  console.log('自定义事件:', data)
}
</script>

<style scoped lang="scss">
.example-container {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.example-section {
  margin-bottom: 48px;

  h2 {
    margin-bottom: 24px;
    font-size: 24px;
    color: #303133;
  }
}

.theme-examples {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.theme-item {
  min-height: 300px;
}
</style>
