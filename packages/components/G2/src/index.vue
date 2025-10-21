<template>
  <div ref="container" class="w-full h-full" v-bind="$attrs" />
</template>

<script setup lang="ts">
// 等同extend(Runtime, stdlib())
// import { Chart } from '@antv/g2'
import { corelib, extend, Runtime } from '@antv/g2'
import { onMounted, onUnmounted, useTemplateRef } from 'vue'
import type { propsType } from './_types'

defineOptions({
  name: 'G2',
})
const props = withDefaults(defineProps<propsType>(), {
  options: () => ({}),
})

// 按需打包，https://g2.antv.antgroup.com/manual/extra-topics/bundle
const Chart = extend(Runtime, corelib())

const container = useTemplateRef('container')
let chart

async function renderChart() {
  if (props.options) {
    chart.options(props.options)
  }
  if (props.render) {
    await props.render(chart)
  }
  chart.render()
}

onMounted(() => {
  chart = new Chart({
    container: container.value,
  })
  renderChart()
})
onUnmounted(() => {
  chart.destroy()
  chart = null
})

defineExpose({
  getChart() {
    return chart
  },
})
</script>

<style lang="scss" scoped>
@forward '@moluoxixi/components/_assets/styles/tailwind.scss';
</style>
