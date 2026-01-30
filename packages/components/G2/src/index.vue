<template>
  <div ref="container" class="w-full h-full" v-bind="$attrs" />
</template>

<script setup lang="ts">
import type { propsType } from './types'
// 等同extend(Runtime, stdlib())
// import { Chart } from '@antv/g2'
import { corelib, extend, Runtime } from '@antv/g2'
import { onMounted, onUnmounted, useTemplateRef } from 'vue'

defineOptions({
  name: 'G2',
})
const props = withDefaults(defineProps<propsType>(), {
  options: () => ({}),
})

// 按需打包，https://g2.antv.antgroup.com/manual/extra-topics/bundle
const Chart = extend(Runtime, corelib())

const container = useTemplateRef<HTMLElement>('container')
let chart: any

/**
 * 渲染图表
 */
async function renderChart() {
  if (!chart && container.value) {
    chart = new Chart({
      container: container.value,
    })
  }
  if (!chart)
    return

  if (props.options) {
    chart.options(props.options)
  }
  if (props.render) {
    await props.render(chart)
  }
  chart.render()
}

/**
 * 组件挂载时创建并渲染图表
 */
onMounted(() => {
  if (container.value) {
    chart = new Chart({
      container: container.value,
    })
    renderChart()
  }
})

/**
 * 组件卸载时销毁图表
 */
onUnmounted(() => {
  if (chart) {
    chart.destroy()
    chart = null
  }
})

defineExpose({
  /**
   * 获取图表实例
   * @returns 图表实例
   */
  getChart() {
    return chart
  },
})
</script>

<style lang="scss" scoped>

</style>
